import { Card, Col, Empty, Flex, Row, Table, Tag, type TableColumnsType } from "antd";

import type { BatchRenamePreviewResult, BatchRenamePreviewRow } from "../types";

import styles from "../BatchRename.module.scss";

interface BatchRenamePreviewProps {
  result?: BatchRenamePreviewResult;
}

const statusMeta: Record<
  BatchRenamePreviewRow["status"],
  { color: "success" | "default" | "error" | "warning"; label: string }
> = {
  ready: { color: "success", label: "可重命名" },
  unchanged: { color: "default", label: "无变化" },
  conflict: { color: "error", label: "冲突" },
  invalid: { color: "warning", label: "非法名称" },
};

const columns: TableColumnsType<BatchRenamePreviewRow> = [
  { title: "原文件名", dataIndex: "sourceName", ellipsis: true },
  { title: "新文件名", dataIndex: "targetName", ellipsis: true },
  { title: "变化", dataIndex: "changed", width: 88, render: (changed: boolean) => (changed ? "已变化" : "无变化") },
  {
    title: "状态",
    dataIndex: "status",
    width: 140,
    render: (status: BatchRenamePreviewRow["status"], row) => {
      const meta = statusMeta[status];
      return (
        <Tag color={meta.color} variant="filled" title={row.error}>
          {row.error ?? meta.label}
        </Tag>
      );
    },
  },
];

export const BatchRenamePreview = ({ result }: BatchRenamePreviewProps) => {
  const items = result?.items ?? [];
  const stats = [
    { key: "total", label: "已选文件", value: result?.total ?? "—" },
    { key: "ready", label: "将被重命名", value: result?.ready ?? "—" },
    { key: "unchanged", label: "无变化", value: result?.unchanged ?? "—" },
    { key: "issues", label: "冲突 / 无效", value: result ? result.conflict + result.invalid : "—" },
  ];

  return (
    <Card className={styles.previewCard} classNames={{ body: styles.cardBody }}>
      <Flex className={styles.previewHeader} align="flex-start" justify="space-between" gap={16} wrap>
        <div>
          <h2 className={styles.title}>预览结果</h2>
          <p className={styles.previewDescription}>提交前校验原文件名与新文件名，冲突或非法名称会单独标出。</p>
        </div>
        <Tag color={result === undefined ? "blue" : "success"} variant="filled">
          {result === undefined ? "待预览" : "预览完成"}
        </Tag>
      </Flex>
      <Row gutter={[9, 9]} className={styles.stats}>
        {stats.map((stat) => (
          <Col key={stat.key} xs={12} sm={6}>
            <div className={styles.stat}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          </Col>
        ))}
      </Row>
      <Table<BatchRenamePreviewRow>
        className={styles.previewTable}
        columns={columns}
        dataSource={items}
        rowKey={(row) => `${row.sourcePath}::${row.targetPath}`}
        size="small"
        pagination={items.length > 8 ? { pageSize: 8, showSizeChanger: false } : false}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择文件并点击预览变更" /> }}
      />
    </Card>
  );
};
