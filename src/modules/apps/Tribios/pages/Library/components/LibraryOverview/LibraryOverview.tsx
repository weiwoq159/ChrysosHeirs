import { Card, Col, Row } from "antd";

import styles from "./LibraryOverview.module.scss";

interface LibraryOverviewProps {
  available: number;
  categories: number;
  total: number;
}

const overviewItems = [
  { key: "total", label: "已收录应用", description: "集中收录的工具与功能入口" },
  { key: "available", label: "当前可用", description: "已标记为可用的应用" },
  { key: "categories", label: "能力分类", description: "按用途归档与筛选" },
] as const;

export const LibraryOverview = ({ available, categories, total }: LibraryOverviewProps) => {
  const values = { available, categories, total };

  return (
    <section aria-label="应用库概览">
      <Row gutter={[14, 14]}>
        {overviewItems.map(({ key, label, description }) => (
          <Col key={key} xs={24} md={8}>
            <Card className={styles.card} classNames={{ body: styles.cardBody }}>
              <span className={styles.label}>{label}</span>
              <strong className={styles.value}>{values[key]}</strong>
              <span className={styles.description}>{description}</span>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};
