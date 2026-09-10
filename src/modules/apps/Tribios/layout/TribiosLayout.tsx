import { useApplicationStore } from "@tribios/shared/stores/apps";
import { useMount } from "ahooks";

import { AppLayout } from "@/shared/layout/AppLayout";

export const TribiosLayout = () => {
  const getApps = useApplicationStore((state) => state.loadApps);
  useMount(() => {
    getApps();
  });

  return <AppLayout appName="tribios" />;
};
