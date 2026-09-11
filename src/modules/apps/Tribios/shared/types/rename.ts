export interface RenameItemInput {
  sourcePath: string;
  targetName: string;
}

export type RenamePreviewStatus = "ready" | "unchanged" | "conflict" | "invalid";

export interface RenamePreviewItem {
  sourcePath: string;
  targetPath: string;
  status: RenamePreviewStatus;
  error?: string;
}
