---
template: post
title: "Gatsby ブログ内のリダイレクトを行う"
slug: gatsby-redirect
socialImage: /media/gatsby.png
draft: false
date: 2021-03-14T00:24:35.885437
description: ""
category: Article
tags:
  - "Gatsby"
---

## Abstract

- Gatsby ブログ内のリダイレクトを Gatsby プラグインで行う

## Gatsby におけるリダイレクト方法

ここにおけるリダイレクトとは、このブログを例にすると

- リダイレクト元: https://tonooo.github.io/test1/
- リダイレクト先: https://tonooo.github.io/test2/

のことで、

- リダイレクト元: https://tonooo.github.io/test1/
- リダイレクト先: https://tonooo.netlify.com/test2/

のようなドメインから異なるようなリダイレクトは対象としない。

Gatsby にもともとある方法としては、
[createRedirect](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createRedirect)
関数を使用する方法がある。

これは、`createPages`関数内で以下のように定義して使用する。

```js
exports.createPages = ({ graphql, actions }) => {
  const { createRedirect } = actions;
  createRedirect({
    fromPath: "/old-url",
    toPath: "/new-url",
    isPermanent: true,
  });
  createRedirect({ fromPath: "/url", toPath: "/zn-CH/url", Language: "zn" });
  createRedirect({
    fromPath: "/not_so-pretty_url",
    toPath: "/pretty/url",
    statusCode: 200,
  });
  // Create pages here
};
```

今回は上記の方法を使用する代わりに、リダイレクト元(元々あった記事の URL)と
リダイレクト先(今ある記事の URL)の情報をまとめて管理できるようにするため、
今ある記事にリダイレクト元の URL を各方法をとることにした。

最終的には、Markdown ファイルの Frontmatter に、

```yaml
---
title: Polybarの導入
date: 2018-05-11T13:50:38+09:00
description: i3blockの代替としてPolybarを試す
category: Article
tags:
  - Linux
redirect_from:
  - /2018/180511_polybar/180511_polybar/
---

```

ように記述することで、ビルド時にリダイレクト元に
index.html ファイルが生成される。

## 方法

使用する Gatsby プラグインは、リダイレクト元とリダイレクト先の URL を指定して
リダイレクトを行う index.html を生成する [gatsby-plugin-meta-redirect](https://www.gatsbyjs.com/plugins/gatsby-plugin-meta-redirect/?=redirect) と、
Markdown ファイルの Frontmatter に記述したリダイレクト元 URL を使用して上記のプラグインを呼び出す[gatsby-redirect-from](https://www.gatsbyjs.com/plugins/gatsby-redirect-from/?=redirect)の 2 つを使用する。

方法は簡単でプラグインの説明どおり`npm`か`yarn`でインストールした後に、`gatsby-config.js`に

```js
plugins: [
  "gatsby-redirect-from",
  "gatsby-plugin-meta-redirect", // make sure this is always the last one
];
```

を追加するだけで良い。
