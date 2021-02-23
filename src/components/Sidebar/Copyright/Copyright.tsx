import React from "react";
import styles from "./Copyright.module.scss";

type Copyright = {
  copyright: string;
};

const Copyright: React.FC<Copyright> = ({ copyright }) => (
  <div className={styles["copyright"]}>{copyright}</div>
);

export default Copyright;
