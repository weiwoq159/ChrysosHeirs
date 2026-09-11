import { useMemo } from "react";
import { useNavigate } from "react-router";

import { Row, Col, Card } from "antd";

import { SectionHeader } from "@tribios/shared/components";
import { returnIcon } from "@tribios/shared/icon/icon";
import { useApplicationStore } from "@tribios/shared/stores/apps";
import type { ApplicationManifest } from "@tribios/shared/types/apps";

import styles from "./DashboardQuickAccess.module.scss";

export const DashboardQuickAccess = () => {
  const navigate = useNavigate();
  const apps = useApplicationStore((state) => state.apps);

  const quickAccessApps = useMemo(() => apps.filter(({ status }) => status === "available").slice(0, 8), [apps]);

  const goToAppDetail = (link: ApplicationManifest["link"]) => {
    navigate(link, { state: { detailSource: "dashboard" } });
  };

  return (
    <div className={styles["dashboard-quick-access"]}>
      <SectionHeader sectionTitle="快捷入口" viewAllPath="library" />
      <Row gutter={[24, 24]}>
        {quickAccessApps.map((app) => {
          const Icon = returnIcon(app.icon);
          return (
            <Col xs={12} sm={12} md={8} lg={6} key={app.key} className={styles.col}>
              <Card
                hoverable
                className={styles.card}
                classNames={{ body: styles.cardBody }}
                role="button"
                tabIndex={0}
                aria-label={`查看${app.name}详情`}
                onClick={() => goToAppDetail(app.link)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    goToAppDetail(app.link);
                  }
                }}
              >
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
