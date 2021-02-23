import React from "react";
import { Link } from "gatsby";
import styles from "./Tags.module.scss";

type Tags = {
  tags: readonly (string | undefined)[];
  tagSlugs: readonly (string | undefined)[];
};

const Tags: React.FC<Tags> = ({ tags, tagSlugs }) => (
  <div className={styles["tags"]}>
    <ul className={styles["tags__list"]}>
      {tagSlugs &&
        tagSlugs.map((slug, i) => {
          if (slug == undefined) return null;
          return (
            <li className={styles["tags__list-item"]} key={tags[i]}>
              <Link to={slug} className={styles["tags__list-item-link"]}>
                {tags[i]}
              </Link>
            </li>
          );
        })}
    </ul>
  </div>
);

export default Tags;
