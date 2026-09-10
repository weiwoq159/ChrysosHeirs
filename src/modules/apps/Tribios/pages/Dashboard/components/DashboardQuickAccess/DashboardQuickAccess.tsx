import { useMemo } from "react";

import { Row, Col, Card } from "antd";

import { SectionHeader } from "@tribios/shared/components";
import { returnIcon } from "@tribios/shared/icon/icon";
import { useApplicationStore } from "@tribios/shared/stores/apps";

import styles from "./DashboardQuickAccess.module.scss";

export const DashboardQuickAccess = () => {
  const apps = useApplicationStore((state) => state.apps);

  const quickAccessApps = useMemo(() => apps.filter(({ status }) => status === "available").slice(0, 8), [apps]);

  return (
    <div className={styles["dashboard-quick-access"]}>
      <SectionHeader sectionTitle="快捷入口" viewAllPath="library" />
      <Row gutter={[24, 24]}>
        {quickAccessApps.map((app) => {
          const Icon = returnIcon(app.icon);
          return (
            <Col xs={12} sm={12} md={8} lg={6} key={app.key} className={styles.col}>
              <Card hoverable className={styles.card} classNames={{ body: styles.cardBody }} role="button" tabIndex={0}>
                <span className={styles.icon} aria-hidden>
                  <Icon />
                </span>
                <span className={styles.title}>{app.name}</span>
                <span className={styles.description}>{app.description}</span>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
