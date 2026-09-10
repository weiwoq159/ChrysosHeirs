import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { listApps } from "@tribios/shared/ipc/commands";
import { create } from "zustand";

interface ApplicationStore {
  apps: ApplicationManifest[];
  loadApps: () => Promise<void>;
}
export const useApplicationStore = create<ApplicationStore>((set) => ({
  apps: [],
  loadApps: async () => {
    const apps = await listApps();
    set({ apps });
  },
}));
