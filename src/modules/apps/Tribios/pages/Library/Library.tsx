import type { ApplicationCategory, ApplicationManifest } from "@tribios/shared/types/apps";

import { Flex, Row, Col } from "antd";

import { useApplicationStore } from "@tribios/shared/stores/apps";

import { Hero } from "@/shared/components";

import { LibraryOverview, LibraryFilter } from "./components";
import { type LibraryCategory } from "./constants";

const featureTags = ["应用索引", "分类筛选", "状态追踪"];

interface LibrarySummary {
  available: number;
  categories: number;
  categoryCounts: Record<ApplicationCategory, number>;
  total: number;
}

const getLibrarySummary = (apps: ApplicationManifest[]): LibrarySummary => {
  const categoryCounts: Record<ApplicationCategory, number> = {
    document: 0,
    file: 0,
    media: 0,
    system: 0,
    utility: 0,
  };
  const activeCategories = new Set<ApplicationCategory>();
  let available = 0;

  apps.forEach((application) => {
    categoryCounts[application.category] += 1;
    activeCategories.add(application.category);
    if (application.status === "available") available += 1;
  });

  return {
    available,
    categories: activeCategories.size,
    categoryCounts,
    total: apps.length,
  };
};
export const Library = () => {
  const apps = useApplicationStore((state) => state.apps);
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>("all");

  const summary = getLibrarySummary(apps);
  return (
    <Flex vertical gap={28}>
      <Hero
        eyebrow="APPLICATION LIBRARY"
        title="应用库"
        description="集中浏览和管理已收录的应用、工具与功能入口。"
        tags={featureTags}
      />
      <LibraryOverview total={summary.total} available={summary.available} categories={summary.categories} />
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={6}>
          <LibraryFilter
            activeCategory={activeCategory}
            categoryCounts={summary.categoryCounts}
            total={summary.total}
            onCategoryChange={setActiveCategory}
          />
        </Col>
        <Col xs={24} lg={18}>
          2
        </Col>
      </Row>
    </Flex>
  );
};
