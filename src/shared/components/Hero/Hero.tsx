import { useId } from "react";

import { Flex } from "antd";

import coverImage from "@/assets/images/Tribios.webp";

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
      <Flex justify="space-between">
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
        <img src={coverImage} alt="" style={{ opacity: 0.3, height: 200 }} />
      </Flex>
    </section>
  );
};
