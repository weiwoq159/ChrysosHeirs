import { message } from "antd";

import { invoke as tauriInvoke } from "@tauri-apps/api/core";

import type { ApiResponse } from "@/shared/types/response";
type IpcPayload = Record<string, unknown>;

export const invokeApiCommand = async <T>(command: string, payload?: IpcPayload): Promise<ApiResponse<T>> => {
  const response = await tauriInvoke<ApiResponse<T>>(command, payload);
  if (!response.ok || response.data === undefined) {
    message.error(response.error ?? `Command failed: ${command}`);
    throw new Error(response.error ?? `Command failed: ${command}`);
  }
  return response;
};
