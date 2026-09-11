import type { ApplicationManifest } from "@tribios/shared/types/apps";

import { Alert, Button, Card, Flex, Pagination } from "antd";

import type { LibraryStatus } from "../../constants";

import { LibraryAppGrid } from "../LibraryAppGrid/LibraryAppGrid";
import { LibraryToolbar } from "../LibraryToolbar/LibraryToolbar";

import styles from "./LibraryCatalog.module.scss";

const pageSizeOptions = [6, 9, 12];

interface LibraryCatalogProps {
  apps: ApplicationManifest[];
  error?: string;
  hasActiveFilters: boolean;
  keyword: string;
  resultCount: number;
  status: LibraryStatus;
  onKeywordChange: (keyword: string) => void;
  onRefresh: () => Promise<void>;
  onReset: () => void;
  onStatusChange: (status: LibraryStatus) => void;
}

export const LibraryCatalog = ({
  apps,
  error,
  hasActiveFilters,
  keyword,
  resultCount,
  status,
  onKeywordChange,
  onRefresh,
  onReset,
  onStatusChange,
}: LibraryCatalogProps) => {
  const [pagination, setPagination] = useState({ apps, page: 1, pageSize: pageSizeOptions[0] });
  const { pageSize } = pagination;
  const page = pagination.apps === apps ? pagination.page : 1;
  const paginatedApps = apps.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    setPagination({ apps, page: nextPageSize === pageSize ? nextPage : 1, pageSize: nextPageSize });
  };

  return (
    <Card className={styles.card} classNames={{ body: styles.cardBody }}>
      <Flex className={styles.header} align="flex-end" justify="space-between" gap={18} wrap>
        <div>
          <h2 className={styles.title}>已收录应用</h2>
          <p className={styles.description}>应用入口与本地能力的统一索引。</p>
        </div>
        <span className={styles.resultCount}>显示 {resultCount} 项</span>
      </Flex>

      <LibraryToolbar
        hasActiveFilters={hasActiveFilters}
        keyword={keyword}
        status={status}
        onKeywordChange={onKeywordChange}
        onRefresh={onRefresh}
        onReset={onReset}
        onStatusChange={onStatusChange}
      />

      {error ? (
        <Alert
          className={styles.alert}
          type="error"
          showIcon
          title="应用清单读取失败"
          description={error}
          action={
            <Button size="small" onClick={() => void onRefresh()}>
              重试
            </Button>
          }
        />
      ) : null}

      <LibraryAppGrid apps={paginatedApps} />

      {apps.length > 0 ? (
        <Flex className={styles.pagination} justify="flex-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={apps.length}
            showSizeChanger
            responsive
            pageSizeOptions={pageSizeOptions}
            onChange={handlePageChange}
          />
        </Flex>
      ) : null}
    </Card>
  );
};
