import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { invokeApiCommand } from "@/shared/ipc/client";

export const listApps = async (): Promise<ApplicationManifest[]> => {
  const response = await invokeApiCommand<ApplicationManifest[]>("list_applications");
  return response.data;
};
