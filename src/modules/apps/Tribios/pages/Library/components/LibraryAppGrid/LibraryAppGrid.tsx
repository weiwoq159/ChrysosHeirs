import { Link } from "react-router";

import { Card, Col, Empty, Flex, Row, Tag } from "antd";

import { categoryLabels, statusLabels } from "@tribios/shared/constants/apps";
import { returnIcon } from "@tribios/shared/icon/icon";
import type { ApplicationManifest } from "@tribios/shared/types/apps";

import styles from "./LibraryAppGrid.module.scss";

interface LibraryAppGridProps {
  apps: ApplicationManifest[];
}

export const LibraryAppGrid = ({ apps }: LibraryAppGridProps) => {
  if (apps.length === 0) {
    return <Empty className={styles.empty} description="没有匹配的应用" />;
  }

  return (
    <Row gutter={[14, 14]}>
      {apps.map(({ key, link, name, category, description, status, queueable, icon }) => {
        const Icon = returnIcon(icon);

        return (
          <Col key={key} xs={24} md={12} xl={8} className={styles.column}>
            <Link
              to={link}
              state={{ detailSource: "library" }}
              className={styles.cardButton}
              aria-label={`查看${name}详情`}
            >
              <Card hoverable className={styles.card} classNames={{ body: styles.cardBody }}>
                <Flex align="flex-start" justify="space-between" gap={10}>
                  <Flex className={styles.identity} align="center" gap={10}>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.name}>{name}</span>
                  </Flex>
                  <span className={styles.status} data-status={status}>
                    {statusLabels[status]}
                  </span>
                </Flex>

                <p className={styles.description}>{description}</p>

                <Flex className={styles.tags} wrap gap={6}>
                  <Tag variant="filled">{categoryLabels[category]}</Tag>
                  <Tag variant="filled">{queueable ? "可加入队列" : "不支持队列"}</Tag>
                </Flex>
                <span className={styles.key}>{key}</span>
              </Card>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
};
