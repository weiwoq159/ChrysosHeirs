import type { ApplicationCategory, ApplicationStatus } from "@tribios/shared/types/apps";

export const categoryLabels: Record<ApplicationCategory, string> = {
  document: "文档工具",
  file: "文件处理",
  media: "媒体处理",
  system: "系统管理",
  utility: "实用工具",
};

export const statusLabels: Record<ApplicationStatus, string> = {
  available: "可用",
  disabled: "已停用",
  unavailable: "不可用",
};
