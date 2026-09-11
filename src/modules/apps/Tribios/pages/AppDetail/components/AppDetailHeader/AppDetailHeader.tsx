import { createElement } from "react";

import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Tag } from "antd";

import { statusLabels } from "@tribios/shared/constants/apps";
import { returnIcon } from "@tribios/shared/icon/icon";
import type { ApplicationManifest, ApplicationStatus } from "@tribios/shared/types/apps";

import styles from "./AppDetailHeader.module.scss";

interface AppDetailHeaderProps {
  application: ApplicationManifest;
  backLabel: string;
  onBack: () => void;
  onRun?: () => void;
  runDisabled?: boolean;
}

const statusColors: Record<ApplicationStatus, "error" | "success" | "warning"> = {
  available: "success",
  disabled: "warning",
  unavailable: "error",
};

export const AppDetailHeader = ({ application, backLabel, onBack, onRun, runDisabled }: AppDetailHeaderProps) => {
  const description = application.description.trim();

  return (
    <header className={styles.header}>
      <Button type="text" icon={<ArrowLeftOutlined />} className={styles.backButton} onClick={onBack}>
        {backLabel}
      </Button>
      <Flex className={styles.content} align="flex-start" justify="space-between" gap={20} wrap>
        <Flex className={styles.identity} align="flex-start" gap={16}>
          <span className={styles.icon} aria-hidden="true">
            {createElement(returnIcon(application.icon))}
          </span>
          <div>
            <h1 id="app-detail-title" className={styles.title}>
              {application.name}
            </h1>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
        </Flex>
        <Flex align="center" gap={12} wrap>
          <Tag className={styles.status} color={statusColors[application.status]}>
            {statusLabels[application.status]}
          </Tag>
          {onRun ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              disabled={runDisabled}
              title={runDisabled ? "当前应用不可用" : undefined}
              onClick={onRun}
            >
              运行
            </Button>
          ) : null}
        </Flex>
      </Flex>
    </header>
  );
};
