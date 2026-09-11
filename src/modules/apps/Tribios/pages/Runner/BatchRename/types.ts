import type { RenamePreviewItem } from "@tribios/shared/types/rename";

export type RenameMode = "prefix" | "suffix" | "replace" | "sequence";

export interface BatchRenameRules {
  affix: string;
  renameMode: RenameMode;
  replaceWith: string;
  search: string;
  sequencePadding: number;
  sequenceStart: number;
}

export interface BatchRenamePreviewRequest {
  targetDirectory: string;
  rules: BatchRenameRules;
}

export interface BatchRenamePreviewRow extends RenamePreviewItem {
  changed: boolean;
  sourceName: string;
  targetName: string;
}

export interface BatchRenamePreviewResult {
  conflict: number;
  invalid: number;
  items: BatchRenamePreviewRow[];
  ready: number;
  total: number;
  unchanged: number;
}
