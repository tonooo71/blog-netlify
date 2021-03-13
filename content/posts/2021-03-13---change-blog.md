---
template: post
title: "Netlifyにブログを移転しようとして失敗した話"
slug: change-blog
socialImage: /media/gatsby.png
draft: false
date: 2021-03-13T16:07:48.336334
description: "サイトマップファイルが認識されなかった、ついでにTypeScript化した"
category: Article
tags:
  - "Diary"
  - "Gatsby"
---

## Abstract

- Netlify CMS を使用してブログを書きたくなった
- 新たに Gatsby Starter を使用してブログを再構築した
  - ついでに一部 TypeScript 化した
- Google Search Console で sitemap.xml が認識されなかった
- 最終的に Github.io に戻ってきた

## Motivation

このブログはもともと静的サイトジェネレータである Hugo で作成し
Github.io で公開していたが、仕事で React を触るようになってからは
Gatsby に置き換えて生成していた。

ただ長い間ブログ書かないでいると、どうやってビルドしていたかとか
Markdown ファイルのヘッダの書き方とかを忘れてしまう、
そして記事を書くハードルが上がっていた気がする。

なので記事を CMS で管理することでそこが解消されるのではと思って
Netlify に移行して Netlify CMS を使用しようと思い移行を始めた。

## 新たな Gatsby Starter を使用してブログの再構築

今回使用した Gatsby Starter は、

- Markdown で記事を管理できる(以前の記事の流用を容易にするため)
- Netlify CMS の使用を前提としている

という条件で探し、
[gatsby-starter-lumen](https://www.gatsbyjs.com/starters/alxshelepenok/gatsby-starter-lumen)
を利用することにした。

因みに Netlify 公式が用意している、
[gatsby-starter-netlify-cms](https://www.gatsbyjs.com/starters/netlify-templates/gatsby-starter-netlify-cms/)
という Starter もあったが、ブログというよりはホームページのようなテンプレートだったので
[gatsby-starter-lumen](https://www.gatsbyjs.com/starters/alxshelepenok/gatsby-starter-lumen)
を使用することにした。

## TypeScript 化

Starter の TypeScript 化は、
[Gatsby.js の TypeScript 化 2020](https://zenn.dev/ryo_kawamata/articles/gatsby-ts-2020#4.-gatsby-node.js%E3%81%AEtypescript%E5%8C%96)
の記事を参考にさせていただいた。
この記事ではページ自体を生成する`gatsby`フォルダ内のファイルも
TypeScript 化させているようだが、今回は Starter におけるページのテンプレートを
定義している`src`フォルダ内のファイルを TypeScript 化した。

下記のレポジトリにブログを生成している Gatsby プロジェクトを置いているので
詳細な実装はこちらを参照されたい。  
[GitHub: tonooo71/blog-netlify](https://github.com/tonooo71/blog-netlify)

TypeScript 化に際し行ったことは、次の通り。

1. React コンポーネントを返しているファイルの拡張子を`tsx`に変更する
1. React と関係のない Javascript ファイルの拡張子を`ts`に変更する
1. 型定義を記述する
1. ビルドが通るように型まわりでエラーを返している個所を修正する

元の Starter では SCSS ファイルを JavaScript ファイル内で読み込んでおり、
TypeScript した際に`ts`が以下のようなエラーを吐くことがある。

```
モジュール './Feed.module.scss' またはそれに対応する型宣言が見つかりません。ts(2307)
```

モジュールに対する型がないことを怒られているようなので`src/types/index.d.ts`ファイルに以下を記述する。

```ts
declare module "*.ico";
declare module "*.png";
declare module "*.scss";
```

TypeScript 化の際で一番厄介だったのは、Gatsby が使用する GraphQL のリクエストに対する
返り値の型だった。
型定義自体は、Gatsby のプラグインである
[gatsby-plugin-typegen](https://github.com/cometkim/gatsby-plugin-typegen)
を利用することで容易に生成可能だった。

ただ、このプラグインにより生成される型には以下のような Maybe 型が多く含まれている。

```ts
type MarkdownRemark = Node & {
  readonly id: Scalars["ID"];
  readonly frontmatter: Maybe<MarkdownRemarkFrontmatter>;
  readonly excerpt: Maybe<Scalars["String"]>;
  readonly rawMarkdownBody: Maybe<Scalars["String"]>;
  readonly fileAbsolutePath: Maybe<Scalars["String"]>;
  readonly fields: Maybe<MarkdownRemarkFields>;
  readonly html: Maybe<Scalars["String"]>;
  readonly htmlAst: Maybe<Scalars["JSON"]>;
  readonly excerptAst: Maybe<Scalars["JSON"]>;
  readonly headings: Maybe<ReadonlyArray<Maybe<MarkdownHeading>>>;
  readonly timeToRead: Maybe<Scalars["Int"]>;
  readonly tableOfContents: Maybe<Scalars["String"]>;
  readonly wordCount: Maybe<MarkdownWordCount>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};
```

Maybe 型は生成されるファイル`gatsby-types.ts`の先頭で

```ts
declare namespace GatsbyTypes {
  type Maybe<T> = T | undefined;
  // 省略
}
```

と定義されており、つまりは`undefined`を取りうるということらしい。

この型があるせいで、GraphQL リクエストの返り値を利用している
(特に記事ページを生成している)モジュールは、返り値が`undefined`がである
場合に対処する必要がある。

例えば、記事ページを生成する`src/components/Post/Post.tsx`は
以下のように引数で渡ってくる GraphQL リクエストの返り値である`post`に対して
`undefined`であった時の処理を付け加えている。

```tsx
type Post = {
  post: GatsbyTypes.MarkdownRemark;
};

const Post: React.FC<Post> = ({ post }) => {
  const { html } = post;

  // html: 記事本体
  // post.fields: ブログ自体の情報
  // post.frontmatter: 記事のメタ情報
  if (
    html == undefined ||
    post.fields == undefined ||
    post.frontmatter == undefined
  )
    return null;

  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;

  if (slug == undefined || title == undefined || date == undefined)
    return null;

  return (
    // 省略
  );
};
```

## Netlify にデプロイする

Netlify でのブログは[こちら](https://tonooo71.netlify.app/)になった。

Netlify へのデプロイ時の設定などは色々なところに情報が落ちているので省略する。
自分は Netlify と Github を OAuth 認証で連携させることで、Github にコミットすると
Netlify がビルドとデプロイを自動で行うように設定した。

ビルド時の設定として、
Google Search Console と Google Analytics を使用するために
`index.html`にそれぞれから指定されたコードを追加する必要があったので、
"Build & Deploy" -> "Post processing" の "Snippet injection" で
追加した。

![snippet injection](/media/2021-03-13-netlify.png)

## なぜ Netlify をやめて Github.io に戻ったのか

主な理由として、Google Search Console でサイトマップファイル`sitemap.xml`が
認識されなかったのがある。

![sitemap](/media/2021-03-13-sitemap.png)

XML ファイルの書式が違うのかと思い、元の Github.io で公開していたサイトマップファイルと
比べてみたが同一のものだった。
さらに言うと Netlify で公開していたものを Github.io に移すと認識するようになったので、
Netlify でファイルの HTML ヘッダ情報を何か変更する必要があったのかもしれないが、
調べた結果よくわからなかったので Netlify での公開を断念した。
(Netlify の Forum でも似た問題のスレッドをいくつか見つけられたが、解決方法が書かれていなかった)

因みに移行の動機の一つだった Netlify CMS だが、
記事入力中に変換前の文章が消えたりする現象が多発しストレスだったので
結局あまり使わなかった。

あとは移行の際に記事ファイルのタイトルを新しい Starter のものに合わせたことで
記事 URL が変わってしまったので、次回はリダイレクト設定について書く。
