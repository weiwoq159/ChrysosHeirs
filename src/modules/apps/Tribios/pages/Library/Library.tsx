import type { ApplicationCategory, ApplicationManifest } from "@tribios/shared/types/apps";

import { useEffect, useMemo, useState } from "react";

import { App, Col, Flex, Row } from "antd";

import { useApplicationStore } from "@tribios/shared/stores/apps";

import { Hero } from "@/shared/components";

import { LibraryCatalog, LibraryFilter, LibraryOverview } from "./components";
import type { LibraryCategory, LibraryStatus } from "./constants";

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
  const { message } = App.useApp();
  const apps = useApplicationStore((state) => state.apps);
  const error = useApplicationStore((state) => state.error);
  const loadApps = useApplicationStore((state) => state.loadApps);
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>("all");
  const [activeStatus, setActiveStatus] = useState<LibraryStatus>("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    void loadApps();
  }, [loadApps]);

  const summary = useMemo(() => getLibrarySummary(apps), [apps]);
  const filteredApps = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();

    return apps.filter((application) => {
      const matchesCategory = activeCategory === "all" || application.category === activeCategory;
      const matchesStatus = activeStatus === "all" || application.status === activeStatus;
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        `${application.name} ${application.description} ${application.key}`.toLocaleLowerCase().includes(normalizedKeyword);

      return matchesCategory && matchesStatus && matchesKeyword;
    });
  }, [activeCategory, activeStatus, apps, keyword]);
  const hasActiveFilters = activeCategory !== "all" || activeStatus !== "all" || keyword.length > 0;

  const handleReset = () => {
    setActiveCategory("all");
    setActiveStatus("all");
    setKeyword("");
  };

  const handleRefresh = async () => {
    await loadApps();

    const refreshError = useApplicationStore.getState().error;
    if (refreshError) {
      message.error(refreshError);
      return;
    }

    message.success("应用清单已刷新");
  };

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
          <LibraryCatalog
            apps={filteredApps}
            error={error}
            hasActiveFilters={hasActiveFilters}
            keyword={keyword}
            resultCount={filteredApps.length}
            status={activeStatus}
            onKeywordChange={setKeyword}
            onRefresh={handleRefresh}
            onReset={handleReset}
            onStatusChange={setActiveStatus}
          />
        </Col>
      </Row>
    </Flex>
  );
};
