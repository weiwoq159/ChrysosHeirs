import {
  AudioOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DashboardOutlined,
  DiffOutlined,
  EditOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SnippetsOutlined,
  SwapOutlined,
} from "@ant-design/icons";

const iconMap = {
  AudioOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DashboardOutlined,
  DiffOutlined,
  EditOutlined,
  FilePdfOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SnippetsOutlined,
  SwapOutlined,
} as const;

export const returnIcon = (key: string) => {
  return iconMap[key as keyof typeof iconMap] ?? FileTextOutlined;
};
