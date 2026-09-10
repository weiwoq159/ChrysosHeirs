import { Link } from "react-router";

import { Card, Col, Row } from "antd";

import { appModulesMap } from "@/modules/apps/registry";

import styles from "./OverviewContent.module.scss";

export const OverviewContent = () => {
  const modules = [...appModulesMap.values()];
  return (
    <Row gutter={[20, 20]}>
      {modules.map((module) => (
        <Col key={module.name} xs={24} sm={12} lg={8} xl={6} className={styles.column}>
          <Link to={module.path} className={styles.cardLink}>
            <Card
              hoverable
              className={styles.card}
              classNames={{ body: styles.cardBody }}
              cover={
                module.cover ? (
                  <div className={styles.cardCover}>
                    <img src={module.cover} alt="" draggable={false} className={styles.cardCoverImage} />
                  </div>
                ) : null
              }
            >
              <h2 className={styles.cardTitle}>{module.title}</h2>
              <p className={styles.cardPurpose}>{module.purpose}</p>
              <p className={styles.cardDescription}>{module.description}</p>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};
