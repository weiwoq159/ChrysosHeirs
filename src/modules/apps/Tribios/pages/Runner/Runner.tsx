import type { ComponentType } from "react";

import { Button, Empty, Flex } from "antd";

import { Hero } from "@/shared/components";
import { tribiosRouteSegment } from "@tribios/constants";
import { useApplicationStore } from "@tribios/shared/stores/apps";

import { BatchRename } from "./BatchRename/BatchRename";

const libraryPath = `/${tribiosRouteSegment}/library`;

const runnerViews: Partial<Record<string, ComponentType>> = {
  "batch-rename": BatchRename,
};
export const Runner = () => {
  const { runnerType } = useParams();
  const navigate = useNavigate();
  const appsMap = useApplicationStore((state) => state.appsMap);
  const hasLoaded = useApplicationStore((state) => state.hasLoaded);
  const loadApps = useApplicationStore((state) => state.loadApps);
  const normalizedKey = runnerType?.trim() ?? "";
  const application = appsMap[normalizedKey];

  useEffect(() => {
    void loadApps();
  }, [loadApps]);

  const goToLibrary = () => {
    navigate(libraryPath);
  };

  const libraryButton = <Button onClick={goToLibrary}>返回应用库</Button>;

  if (!hasLoaded) {
    return null;
  }

  const RunnerView = runnerViews[application.key];

  return (
    <Flex vertical gap={28}>
      <Hero
        eyebrow={application.eyebrow}
        title={application.name}
        description={application.description}
        tags={application.tags}
      />
      <>
        {RunnerView ? (
          <RunnerView />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ display: "grid", minHeight: 260, padding: "24px 16px", placeItems: "center" }}
            description={
              <Flex vertical align="center" gap={6}>
                <span style={{ color: "#1b405e", fontSize: 16, fontWeight: 600 }}>运行器尚未接入</span>
                <span style={{ color: "#71889a", fontSize: 13, lineHeight: 1.7, maxWidth: 360 }}>
                  已找到该应用，但对应的运行界面还没有接入。
                </span>
              </Flex>
            }
          >
            {libraryButton}
          </Empty>
        )}
      </>
    </Flex>
  );
};
