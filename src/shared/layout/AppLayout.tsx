import { Outlet } from "react-router";

import { Layout } from "antd";

import { appModulesMap, type AppName } from "@/modules/apps/registry";
import { useBreadcrumb } from "@/shared/hooks/useBreadcrum";

import { AppLayoutHeader, AppLayoutSider } from "./components";

import styles from "./AppLayout.module.scss";

const { Content } = Layout;
interface AppLayoutProps {
  appName: AppName;
}
export const AppLayout = ({ appName }: AppLayoutProps) => {
  const app = appModulesMap.get(appName);

  if (!app) {
    throw new Error(`未找到应用配置：${appName}`);
  }

  const { title, cover } = app;
  const breadcrumb = useBreadcrumb({ className: styles.breadcrumb });

  return (
    <Layout className={styles.layout}>
      <AppLayoutHeader title={title} cover={cover} />
      <Layout>
        <AppLayoutSider appName={appName} />
        <Layout className={styles.contentLayout}>
          {breadcrumb}
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
