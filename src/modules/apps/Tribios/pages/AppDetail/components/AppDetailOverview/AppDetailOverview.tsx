import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { CheckCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Card, Flex, Tag } from "antd";

import { categoryLabels, statusLabels } from "@tribios/shared/constants/apps";

import styles from "./AppDetailOverview.module.scss";

interface AppDetailOverviewProps {
  application: ApplicationManifest;
}

export const AppDetailOverview = ({ application }: AppDetailOverviewProps) => {
  const entry = application.entry.trim();
  const items = [
    {
      key: "entry",
      icon: <FileTextOutlined />,
      title: "运行入口",
      text: entry ? `以 ${entry} 作为本地执行入口。` : "未配置本地执行入口。",
    },
    {
      key: "queue",
      icon: <CheckCircleOutlined />,
      title: "任务队列",
      text: application.queueable
        ? "支持进入任务队列，适合耗时或批量处理工作。"
        : "以即时方式运行，不会进入后台任务队列。",
    },
  ];

  return (
    <Card className={styles.card} classNames={{ body: styles.cardBody }}>
      <section aria-labelledby="app-overview-title">
        <h2 id="app-overview-title" className={styles.title}>
          应用概览
        </h2>
        <p className={styles.description}>这是该应用在本地注册表中的能力摘要。</p>
        <Flex vertical gap={10}>
          {items.map((item) => (
            <Flex key={item.key} className={styles.item} align="flex-start" gap={10}>
              <span className={styles.itemIcon} aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemText}>{item.text}</span>
              </div>
            </Flex>
          ))}
        </Flex>
      </section>

      <section className={styles.usage} aria-labelledby="app-usage-title">
        <h2 id="app-usage-title" className={styles.title}>
          使用说明
        </h2>
        <p className={styles.description}>应用可从应用库进入；后续可在此补充参数 Schema、权限策略和运行日志。</p>
        <Flex wrap gap={6}>
          <Tag variant="filled">{categoryLabels[application.category]}</Tag>
          <Tag variant="filled">{application.queueable ? "队列工具" : "即时工具"}</Tag>
          <Tag variant="filled">{statusLabels[application.status]}</Tag>
        </Flex>
      </section>
    </Card>
  );
};
