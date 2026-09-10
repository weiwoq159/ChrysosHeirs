import type { ApplicationCategory } from "@tribios/shared/types/apps";

import { Button, Card, Divider, Flex } from "antd";

import { categoryOptions, type LibraryCategory } from "../../constants";

import styles from "./LibraryFilter.module.scss";

interface LibraryFilterProps {
  activeCategory: LibraryCategory;
  categoryCounts: Record<ApplicationCategory, number>;
  total: number;
  onCategoryChange: (category: LibraryCategory) => void;
}

export const LibraryFilter = ({ activeCategory, categoryCounts, total, onCategoryChange }: LibraryFilterProps) => {
  return (
    <Card className={styles.card} classNames={{ body: styles.cardBody }}>
      <h2 className={styles.title}>分类筛选</h2>
      <p className={styles.description}>按应用用途快速定位已收录的工具。</p>

      <Flex component="nav" vertical gap={5} aria-label="应用分类">
        {categoryOptions.map(({ value, label }) => {
          const count = value === "all" ? total : categoryCounts[value];
          const isActive = value === activeCategory;

          return (
            <Button
              key={value}
              type="text"
              block
              className={styles.button}
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => onCategoryChange(value)}
            >
              <span>{label}</span>
              <span className={styles.count}>{count}</span>
            </Button>
          );
        })}
      </Flex>

      <Divider className={styles.divider} />
      <p className={styles.note}>
        <strong>应用注册表</strong>
        选择分类缩小范围，也可结合关键词和应用状态筛选。
      </p>
    </Card>
  );
};
