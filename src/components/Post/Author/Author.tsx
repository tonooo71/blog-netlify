import React from "react";
import { getContactHref } from "../../../utils";
import styles from "./Author.module.scss";
import { useSiteMetadata } from "../../../hooks";

const Author: React.FC = () => {
  const { author } = useSiteMetadata();

  if (author == undefined || author.contacts?.twitter == undefined) return null;

  return (
    <div className={styles["author"]}>
      <p className={styles["author__bio"]}>
        {/* {author.bio}
        <a
          className={styles["author__bio-twitter"]}
          href={getContactHref("twitter", author.contacts.twitter)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <strong>{author.name}</strong> on Twitter
        </a> */}
      </p>
    </div>
  );
};

export default Author;
