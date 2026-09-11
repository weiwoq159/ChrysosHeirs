import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { listApps } from "@tribios/shared/ipc/commands";
import { create } from "zustand";

interface ApplicationStore {
  apps: ApplicationManifest[];
  appsMap: Record<string, ApplicationManifest>;
  error?: string;
  hasLoaded: boolean;
  isLoading: boolean;
  loadApps: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationStore>((set) => {
  let loading: Promise<void> | undefined;

  return {
    apps: [],
    appsMap: {},
    hasLoaded: false,
    isLoading: false,
    loadApps: () => {
      if (loading) {
        return loading;
      }

      set({ isLoading: true });
      loading = listApps()
        .then((apps) => {
          const appsMap = apps.reduce((acc, app) => ({ ...acc, [app.key]: app }), {});
          set({ apps, appsMap, error: undefined, hasLoaded: true });
        })
        .catch((error: unknown) => {
          set({ error: error instanceof Error ? error.message : "加载应用列表失败" });
        })
        .finally(() => {
          loading = undefined;
          set({ isLoading: false });
        });

      return loading;
    },
  };
});
