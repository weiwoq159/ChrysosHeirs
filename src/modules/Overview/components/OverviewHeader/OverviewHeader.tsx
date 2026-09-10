import logo from "@/assets/images/IconHead_202037.png";

import styles from "./OverviewHeader.module.scss";

export const OverviewHeader = () => {
  return (
    <div className={styles.brand}>
      <img src={logo} alt="logo" className={styles.brandLogo} />
      <span className={styles.brandTitle}>翁法罗斯·黄金裔</span>
    </div>
  );
};
