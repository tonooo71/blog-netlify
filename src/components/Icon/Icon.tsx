import React from "react";
import styles from "./Icon.module.scss";

type IconProps = {
  path: string;
  viewBox: string;
};

type Icon = {
  name: string;
  icon: IconProps;
};

const Icon: React.FC<Icon> = ({ name, icon }) => (
  <svg className={styles["icon"]} viewBox={icon.viewBox}>
    <title>{name}</title>
    <path d={icon.path} />
  </svg>
);

export default Icon;
