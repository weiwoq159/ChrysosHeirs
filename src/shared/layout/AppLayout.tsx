import { Outlet } from "react-router";

import { Breadcrumb, Layout, type BreadcrumbProps } from "antd";

import { appModulesMap, type AppName } from "@/modules/apps/registry";
import { useBreadcrumb } from "@/shared/hooks/useBreadcrum";

import { AppLayoutHeader, AppLayoutSider } from "./components";

import styles from "./AppLayout.module.scss";

const { Content } = Layout;
interface AppLayoutProps {
  appName: AppName;
  breadcrumbItems?: BreadcrumbProps["items"];
  selectedMenuKey?: string;
}
export const AppLayout = ({ appName, breadcrumbItems, selectedMenuKey }: AppLayoutProps) => {
  const app = appModulesMap.get(appName);

  if (!app) {
    throw new Error(`未找到应用配置：${appName}`);
  }

  const { title, cover } = app;
  const defaultBreadcrumb = useBreadcrumb({ className: styles.breadcrumb });
  const breadcrumb = breadcrumbItems ? (
    <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
  ) : (
    defaultBreadcrumb
  );

  return (
    <Layout className={styles.layout}>
      <AppLayoutHeader title={title} cover={cover} />
      <Layout>
        <AppLayoutSider appName={appName} selectedMenuKey={selectedMenuKey} />
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
