import type { ApplicationCategory, ApplicationStatus } from "@tribios/shared/types/apps";

import { categoryLabels, statusLabels } from "@tribios/shared/constants/apps";

export type LibraryCategory = ApplicationCategory | "all";
export type LibraryStatus = ApplicationStatus | "all";

export const categoryOptions: ReadonlyArray<{ label: string; value: LibraryCategory }> = [
  { value: "all", label: "全部应用" },
  { value: "document", label: categoryLabels.document },
  { value: "file", label: categoryLabels.file },
  { value: "media", label: categoryLabels.media },
  { value: "system", label: categoryLabels.system },
  { value: "utility", label: categoryLabels.utility },
];

export const statusOptions: ReadonlyArray<{ label: string; value: LibraryStatus }> = [
  { value: "all", label: "全部状态" },
  { value: "available", label: statusLabels.available },
  { value: "disabled", label: statusLabels.disabled },
  { value: "unavailable", label: statusLabels.unavailable },
];
