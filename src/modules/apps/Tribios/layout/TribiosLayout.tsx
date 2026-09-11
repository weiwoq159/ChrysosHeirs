import { Link, useParams } from "react-router";

import { AppLayout } from "@/shared/layout/AppLayout";
import { tribiosRouteSegment } from "@tribios/constants";
import { useApplicationStore } from "@tribios/shared/stores/apps";
import { useMount } from "ahooks";

export const TribiosLayout = () => {
  const { applicationKey, runnerType } = useParams();
  const appsMap = useApplicationStore((state) => state.appsMap);
  const getApps = useApplicationStore((state) => state.loadApps);
  const targetApplicationKey = applicationKey ?? runnerType;
  const application = targetApplicationKey ? appsMap[targetApplicationKey] : undefined;
  const libraryPath = `/${tribiosRouteSegment}/library`;
  const breadcrumbItems = application
    ? [
        { title: <Link to={`/${tribiosRouteSegment}`}>提里西庇俄斯</Link> },
        { title: <Link to={libraryPath}>应用库</Link> },
        { title: application.name },
      ]
    : undefined;

  useMount(() => {
    getApps();
  });

  return (
    <AppLayout
      appName="tribios"
      breadcrumbItems={breadcrumbItems}
      selectedMenuKey={targetApplicationKey ? libraryPath : undefined}
    />
  );
};
