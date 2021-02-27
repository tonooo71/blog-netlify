import React from "react";
import { Link } from "gatsby";
import styles from "./Menu.module.scss";

type Menu = {
  menu: readonly (GatsbyTypes.SiteSiteMetadataMenu | undefined)[];
};

const Menu: React.FC<Menu> = ({ menu }) => (
  <nav className={styles["menu"]}>
    <ul className={styles["menu__list"]}>
      {menu.map((item) => {
        if (item?.path == undefined) return null;

        return (
          <li className={styles["menu__list-item"]} key={item.path}>
            <Link
              to={item.path}
              className={styles["menu__list-item-link"]}
              activeClassName={styles["menu__list-item-link--active"]}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Menu;