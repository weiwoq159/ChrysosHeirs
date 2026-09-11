import { invokeApiCommand } from "@/shared/ipc/client";
import type { InvokeArgs } from "@tauri-apps/api/core";
import type { ApplicationManifest } from "@tribios/shared/types/apps";
import type { RenameItemInput, RenamePreviewItem } from "@tribios/shared/types/rename";

export const listApps = async (): Promise<ApplicationManifest[]> => {
  return invokeApiCommand<ApplicationManifest[]>("list_applications");
};

export const previewBatchRename = async (items: RenameItemInput[]): Promise<RenamePreviewItem[]> => {
  return invokeApiCommand<RenamePreviewItem[]>("preview_batch_rename", { items } as InvokeArgs);
};

export const listBatchRenameFiles = async (directory: string): Promise<string[]> => {
  return invokeApiCommand<string[]>("list_batch_rename_files", { directory } as InvokeArgs);
};
