import { useId } from "react";

import { Flex } from "antd";

import styles from "./Hero.module.scss";
interface HeroProps {
  eyebrow: string;
  title: string;
  description: string;
  tags: readonly string[];
}

export const Hero = ({ eyebrow, title, description, tags }: HeroProps) => {
  const titleId = useId();

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.heroMain}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
        <Flex wrap gap={8} className={styles.tagList} aria-label="功能标签">
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </Flex>
      </div>
    </section>
  );
};
