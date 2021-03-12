---
title: "React Hooksで作るメニュー外クリックで閉じるドロップダウンメニュー"
slug: dropdownmenu-react-hooks
date: "2020-03-01T21:38:23.133989"
description: "React Hooksを用いてBootstrapみたいなドロップダウンメニューを作る"
template: "post"
tags:
  - "React"
draft: false
category: "Article"
redirect_from:
  - /2020/03/200301_reacthooks-dropdownmenu/
---

## はじめに

これまでドロップダウンメニューが必要な時は React Bootstrap を用いていたのですが、自力でドロップダウンメニューを作る必要があったので、そのときの試行錯誤をメモとして残します。
ドロップダウンメニューが満たしてほしい仕様は以下の通りです。

1. ボタンクリックでメニューを表示/非表示
1. メニュー外をクリックしてもメニューが非表示になる

## Step 1

まずは上記の一つ目の条件のみを満たす、基本的なドロップダウンメニューを作ります
![image.png](/media/2020-03-01-step1.png)

```jsx
const Dropdown1 = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const handleClick = (text) => () => {
    alert(text);
    setIsOpenMenu(false);
  };
  return (
    <div className="menu-container" onClick={() => setIsOpenMenu(!isOpenMenu)}>
      <div className="menuButton">Menu 1</div>
      <ul className="menu" hidden={!isOpenMenu}>
        <li className="item" onClick={handleClick("a")}>
          {" "}
          a{" "}
        </li>
        <li className="item" onClick={handleClick("b")}>
          {" "}
          b{" "}
        </li>
        <li className="item" onClick={handleClick("c")}>
          {" "}
          c{" "}
        </li>
      </ul>
    </div>
  );
};
```

[CodePen でソースを見る](https://codepen.io/tonooo71/pen/OJPdvpL)

## Step 2

この Step 1 のメニューではメニューを表示した状態でメニュー外をクリックしてもメニューが閉じません。
なので`useRef`と`useEffect`を使って、ボタンをクリックするとドロップダウンメニューにフォーカスが来るようにし、フォーカスが外れた時に`onBlur`イベントにメニューを閉じる関数を登録します。

```jsx
const Dropdown2 = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    isOpenMenu && menuRef.current.focus();
  }, [isOpenMenu]);
  const handleClick = (text) => () => {
    alert(text);
  };
  return (
    <div
      className="menu-container"
      onClick={() => setIsOpenMenu(!isOpenMenu)}
      ref={menuRef}
      onBlur={() => setIsOpenMenu(false)}
      tabIndex={0}
    >
      <div className="menuButton">Menu 2</div>
      <ul className="menu" hidden={!isOpenMenu}>
        <li className="item" onClick={handleClick("a")}>
          {" "}
          a{" "}
        </li>
        <li className="item" onClick={handleClick("b")}>
          {" "}
          b{" "}
        </li>
        <li className="item" onClick={handleClick("c")}>
          {" "}
          c{" "}
        </li>
      </ul>
    </div>
  );
};
```

[CodePen でソースを見る](https://codepen.io/tonooo71/pen/OJPdvpL)

## Step 3

Step 2 のドロップダウンメニューにメニューアイテム間のセパレータとサブメニューを同様に追加してみます。

![image.png](/media/2020-03-01-step3.png)

```jsx
const Dropdown3 = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    isOpenMenu && menuRef.current.focus();
  }, [isOpenMenu]);
  const handleClick = (text) => () => {
    alert(text);
  };
  return (
    <div
      className="menu-container"
      onClick={() => setIsOpenMenu(!isOpenMenu)}
      ref={menuRef}
      onBlur={() => setIsOpenMenu(false)}
      tabIndex={0}
    >
      <div className="menuButton">Menu 3</div>
      <ul className="menu" hidden={!isOpenMenu}>
        <li className="item" onClick={handleClick("a")}>
          {" "}
          a{" "}
        </li>
        <li className="separator"></li>
        <li className="item" onClick={handleClick("b")}>
          {" "}
          b{" "}
        </li>
        <li className="item">
          {" "}
          c<span>▶</span>
          <ul className="submenu">
            <li className="item" onClick={handleClick("c-1")}>
              {" "}
              c-1{" "}
            </li>
            <li className="item" onClick={handleClick("c-2")}>
              {" "}
              c-2{" "}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
```

[CodePen でソースを見る](https://codepen.io/tonooo71/pen/OJPdvpL)

一見動作するのですが、少しおかしい挙動が見られます。
というのは、セパレータとサブメニュー「c」をクリックしてもメニューが閉じてしまうのです。
これは親要素へクリックイベントが伝播してしまい、`div`要素の`onClick`関数が実行されてしまうからです。(恐らく)

## Step 4

そこでドロップダウンメニュー全体の親である`ul`とサブメニューの親である`li`に`(e) => e.stopPropagation()`を追加したものが以下です。
これにより先述のおかしい動作は見られなくなります。

```jsx
const Dropdown4 = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    isOpenMenu && menuRef.current.focus();
  }, [isOpenMenu]);
  const handleClick = (text) => () => {
    alert(text);
  };
  return (
    <div
      className="menu-container"
      onClick={() => setIsOpenMenu(!isOpenMenu)}
      ref={menuRef}
      onBlur={() => setIsOpenMenu(false)}
      tabIndex={0}
    >
      <div className="menuButton">Menu 4</div>
      <ul
        className="menu"
        hidden={!isOpenMenu}
        onClick={(e) => e.stopPropagation()}
      >
        <li className="item" onClick={handleClick("a")}>
          {" "}
          a{" "}
        </li>
        <li className="separator"></li>
        <li className="item" onClick={handleClick("b")}>
          {" "}
          b{" "}
        </li>
        <li className="item" onClick={(e) => e.stopPropagation()}>
          {" "}
          c<span>▶</span>
          <ul className="submenu">
            <li className="item" onClick={handleClick("c-1")}>
              {" "}
              c-1{" "}
            </li>
            <li className="item" onClick={handleClick("c-2")}>
              {" "}
              c-2{" "}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
```

[CodePen でソースを見る](https://codepen.io/tonooo71/pen/OJPdvpL)

## 以上

です。

Qiita にも書きました  
[React+Hook で作るメニュー外クリックで閉じるドロップダウンメニュー](https://qiita.com/Tonooo/items/beaa6c0ab83d2b7c213d)
