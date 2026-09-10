import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

import { type MenuProps, Layout, Menu, Space } from "antd";

import { appModulesMap, type AppName } from "@/modules/apps/registry";
import { routesMap } from "@/router";
import type { AppRouteObject } from "@/shared/types/route";

import styles from "./AppLayoutSider.module.scss";

const { Sider } = Layout;

export interface AppLayoutSiderProps {
  appName: AppName;
  extra?: ReactNode;
}

export const AppLayoutSider = ({ appName, extra }: AppLayoutSiderProps) => {
  const { pathname } = useLocation();
  const app = appModulesMap.get(appName);

  if (!app) {
    throw new Error(`未找到应用配置：${appName}`);
  }

  const appRoutes = routesMap.get(appName);
  const appRouteChildren = (appRoutes?.[0]?.children ?? []) as AppRouteObject[];

  const navigationItems: MenuProps["items"] = appRouteChildren
    .filter((route) => route.handle?.menu && route.handle.breadcrumb)
    .map((route) => {
      const path = route.index || !route.path ? `/${appName}` : `/${appName}/${route.path}`;

      return {
        key: path,
        label: <Link to={path}>{route.handle?.breadcrumb}</Link>,
      };
    });

  return (
    <Sider width={240} className={styles.sider}>
      <Space orientation="vertical" size={6} className={styles.heading}>
        <span className={styles.kicker}>{app.name.toUpperCase()}</span>
        <span className={styles.title}>功能导航</span>
      </Space>
      <Menu className={styles.menu} mode="inline" selectedKeys={[pathname]} items={navigationItems} />
      <div className={styles.footer}>
        {extra}
        <p className={styles.quote}>{app.descriptionHero}</p>
      </div>
    </Sider>
  );
};
