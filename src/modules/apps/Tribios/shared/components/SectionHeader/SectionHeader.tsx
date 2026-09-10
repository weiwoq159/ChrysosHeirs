import { Link, type To } from "react-router";

import { Flex } from "antd";

import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
  sectionTitle: string;
  viewAllPath: To;
}

export const SectionHeader = ({ sectionTitle, viewAllPath }: SectionHeaderProps) => {
  return (
    <Flex align="center" justify="space-between" className={styles.header}>
      <h2 className={styles.title}>{sectionTitle}</h2>
      <Link
        to={viewAllPath}
        className={styles.viewAllLink}
        aria-label={`查看全部${sectionTitle}`}
      >
        查看全部
      </Link>
    </Flex>
  );
};
