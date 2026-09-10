import { appModulesMap } from "@/modules/apps/registry";
import { Hero } from "@/shared/components";

import { DashboardQuickAccess } from "./components";

const featureTags = ["应用索引", "分类筛选", "状态追踪"];

export const Dashboard = () => {
  const app = appModulesMap.get("tribios");
  return (
    <div>
      <Hero eyebrow="DASHBOARD" title="欢迎回来。" description={app?.descriptionHero ?? ""} tags={featureTags} />
      <DashboardQuickAccess />
    </div>
  );
};
