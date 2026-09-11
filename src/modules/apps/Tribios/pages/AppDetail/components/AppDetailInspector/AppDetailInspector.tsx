import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { Card, Descriptions, type DescriptionsProps } from "antd";

import { categoryLabels, statusLabels } from "@tribios/shared/constants/apps";

import styles from "./AppDetailInspector.module.scss";

interface AppDetailInspectorProps {
  application: ApplicationManifest;
}

const displayValue = (value: string) => value.trim() || "—";

export const AppDetailInspector = ({ application }: AppDetailInspectorProps) => {
  const items: DescriptionsProps["items"] = [
    { key: "category", label: "分类", children: categoryLabels[application.category] },
    { key: "status", label: "状态", children: statusLabels[application.status] },
    { key: "entry", label: "入口", children: displayValue(application.entry) },
    { key: "queueable", label: "队列", children: application.queueable ? "允许" : "不进入" },
  ];
  const manifestSummary = JSON.stringify(
    {
      key: application.key,
      entry: application.entry,
      queueable: application.queueable,
      status: application.status,
    },
    null,
    2,
  );

  return (
    <Card className={styles.card} classNames={{ body: styles.cardBody }}>
      <section aria-labelledby="app-inspector-title">
        <h2 id="app-inspector-title" className={styles.title}>
          应用检查器
        </h2>
        <p className={styles.description}>来自 manifest 的基础信息。</p>
        <Descriptions className={styles.descriptions} layout="vertical" size="small" column={2} items={items} />
      </section>

      <section className={styles.manifest} aria-labelledby="manifest-summary-title">
        <h2 id="manifest-summary-title" className={styles.title}>
          Manifest 摘要
        </h2>
        <pre className={styles.code}>{manifestSummary}</pre>
      </section>
    </Card>
  );
};
