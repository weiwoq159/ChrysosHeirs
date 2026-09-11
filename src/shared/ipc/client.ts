import { invoke as tauriInvoke, type InvokeArgs } from "@tauri-apps/api/core";

import type { ApiResponse } from "@/shared/types/response";

export const invokeApiCommand = async <T>(command: string, payload?: InvokeArgs): Promise<T> => {
  const response = await tauriInvoke<ApiResponse<T>>(command, payload);
  if (!response.ok || response.data === undefined) {
    throw new Error(response.error ?? `Command failed: ${command}`);
  }
  return response.data;
};
