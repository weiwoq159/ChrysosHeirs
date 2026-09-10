import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { create } from "zustand";

interface ApplicationStore {
  apps: ApplicationManifest[];
  loadApps: () => Promise<void>;
}
export const useApplicationStore = create<ApplicationStore>((set) => ({
  apps: [],
  loadApps: () => Promise.resolve(),
}));
