import { ClearOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Select } from "antd";

import { statusOptions, type LibraryStatus } from "../../constants";

import styles from "./LibraryToolbar.module.scss";

interface LibraryToolbarProps {
  hasActiveFilters: boolean;
  keyword: string;
  status: LibraryStatus;
  onKeywordChange: (keyword: string) => void;
  onRefresh: () => Promise<void>;
  onReset: () => void;
  onStatusChange: (status: LibraryStatus) => void;
}

export const LibraryToolbar = ({
  hasActiveFilters,
  keyword,
  status,
  onKeywordChange,
  onRefresh,
  onReset,
  onStatusChange,
}: LibraryToolbarProps) => {
  return (
    <Flex className={styles.toolbar} gap={10} wrap align="center">
      <Input
        className={styles.search}
        value={keyword}
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索应用名称、描述或 key"
        aria-label="搜索应用"
        onChange={(event) => onKeywordChange(event.target.value)}
      />
      <Select<LibraryStatus>
        className={styles.status}
        value={status}
        options={[...statusOptions]}
        aria-label="筛选应用状态"
        onChange={onStatusChange}
      />
      <Button icon={<ReloadOutlined />} onClick={() => void onRefresh()}>
        刷新
      </Button>
      <Button icon={<ClearOutlined />} disabled={!hasActiveFilters} onClick={onReset}>
        重置
      </Button>
    </Flex>
  );
};
