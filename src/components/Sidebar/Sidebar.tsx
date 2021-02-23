import React from "react";
import Author from "./Author";
import Contacts from "./Contacts";
import Copyright from "./Copyright";
import Menu from "./Menu";
import styles from "./Sidebar.module.scss";
import { useSiteMetadata } from "../../hooks";

type Sidebar = {
  isIndex?: boolean;
};

const Sidebar: React.FC<Sidebar> = ({ isIndex }) => {
  const { author, copyright, menu } = useSiteMetadata();

  if (author == undefined || copyright == undefined || menu == undefined)
    return null;

  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar__inner"]}>
        <Author author={author} isIndex={isIndex} />
        <Menu menu={menu} />
        <Contacts contacts={author.contacts} />
        <Copyright copyright={copyright} />
      </div>
    </div>
  );
};

export default Sidebar;
