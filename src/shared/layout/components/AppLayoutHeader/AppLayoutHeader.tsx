import { Link } from "react-router";

import { Divider, Layout, Space } from "antd";

import logo from "@/assets/images/IconHead_202037.png";

import styles from "./AppLayoutHeader.module.scss";

const { Header } = Layout;

export interface AppLayoutHeaderProps {
  cover: string | null;
  title: string;
}

export const AppLayoutHeader = ({ cover, title }: AppLayoutHeaderProps) => {
  return (
    <Header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="返回应用总览">
        <Space align="center" size={14}>
          <Space align="center" size={14}>
            <img className={styles.brandLogo} src={logo} alt="" />
            <span className={styles.brandName}>翁法罗斯</span>
          </Space>
          <Divider orientation="vertical" className={styles.brandDivider} />
          <span className={styles.brandSection}>{title}</span>
        </Space>
      </Link>
      {cover && <img className={styles.headerArtwork} src={cover} alt="" />}
    </Header>
  );
};
