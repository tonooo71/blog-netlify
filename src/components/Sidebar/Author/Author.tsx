import React from "react";
import { withPrefix, Link } from "gatsby";
import styles from "./Author.module.scss";

type Author = {
  author: GatsbyTypes.SiteSiteMetadataAuthor;
  isIndex?: boolean;
};

const Author: React.FC<Author> = ({ author, isIndex }) => {
  if (author?.photo == undefined) return null;

  return (
    <div className={styles["author"]}>
      <Link to="/">
        <img
          src={withPrefix(author.photo)}
          className={styles["author__photo"]}
          width="75"
          height="75"
          alt={author.name}
        />
      </Link>

      {isIndex === true ? (
        <h1 className={styles["author__title"]}>
          <Link className={styles["author__title-link"]} to="/">
            {author.name}
          </Link>
        </h1>
      ) : (
        <h2 className={styles["author__title"]}>
          <Link className={styles["author__title-link"]} to="/">
            {author.name}
          </Link>
        </h2>
      )}
      <p className={styles["author__subtitle"]}>{author.bio}</p>
    </div>
  );
};

export default Author;
