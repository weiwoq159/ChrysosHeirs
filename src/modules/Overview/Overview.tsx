import { Layout } from "antd";

import { OverviewHeader, OverviewFooter, OverviewContent } from "./components";

import styles from "./Overview.module.scss";

const { Header, Content, Footer } = Layout;
export const Overview = () => {
  return (
    <Layout className={styles.overview}>
      <Header className={styles.header}>
        <OverviewHeader />
      </Header>
      <Content className={styles.content}>
        <OverviewContent />
      </Content>
      <Footer className={styles.footer}>
        <OverviewFooter />
      </Footer>
    </Layout>
  );
};
