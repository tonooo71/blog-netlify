---
date: "2018-08-11T15:56:24+09:00"
title: "NeovimでLSPを使う"
description: "C++の開発環境をNeovimで実現しようとしていろいろ調べていたところ、NeovimにLanguage Server Protocol(LSP)を導入したという記事をいくつか見つけたのでやってみた"
template: "post"
tags: 
  - "Neovim"
draft: false
category: "Tech memo"
---

C++の開発環境をNeovimで実現しようとしていろいろ調べていたところ、NeovimにLanguage Server Protocol(LSP)を導入したという記事をいくつか見つけたのでやってみた。  
  
LSPの説明は[この記事](https://qiita.com/atsushieno/items/ce31df9bd88e98eec5c4)読むとして、概略してコードの補完や参照などがエディタの種類にかかわらずアクセスすることで利用可能になるサーバーという認識で良いのかな。  
これまでも`deoplete`と言語ごとにプラグインを導入することで補完をすることはできていたんだけど、LSP使うと大分高速にできる、さらにリンターとしても利用できるみたいなので乗り換えてみようと思った次第です。  
　　
### LanguageClient-neovim

まずNeovimでLSPを利用するために、[LanguageClient-neovim](https://github.com/autozimu/LanguageClient-neovim)をインストールします。  
私はdein.vimでプラグイン管理しているので、  

```toml
[[plugins]]
repo = 'autozimu/LanguageClient-neovim'
rev = 'next'
build = 'bash install.sh'
```

と`dein.toml`に書き込んでNeovimを起動させインストールします。  
LanguageClient-neovim以外にもLSPのプラグインは[vim-lsp](https://github.com/prabirshrestha/vim-lsp)とかあるみたいなんだけど、LanguageClient-neovimは`deoplete`で使える!と見たので、よく意味はわかってないんですがこちらを選択しました。  
そして言語ごとのサーバーをインストールし、LanguageClient-neovimで参照することでLSPを利用します。  
利用できるサーバーの一覧は[こちら](https://langserver.org/)のページに載っています。  

### C/C++

C/C++用のサーバーは`clangd`,`cquery`,`ccls`があるみたいで、`clangd`だけが機能的に他のものに劣っているようなことが先程の一覧ページに書いてあります。  
なので最初は`cquery`を導入しようと思ってたんですが、なんかうまく動かなかったので結局`clangd`使うことにしました。  
`clangd`はもともと`clang`とか`llvm`をインストールしていたので、私の環境では何も追加でインストールせず使えました。  
設定は、

```toml
[[plugins]]
repo = 'autozimu/LanguageClient-neovim'
rev = 'next'
build = 'bash install.sh'
hook_add = '''
    set hidden
    let g:LanguageClient_autoStart = 1
    let g:LanguageClient_serverCommands = {
        \ 'c': ['clangd'],
        \ 'cpp': ['clangd'],
\ }
'''
```

と書けば(とりあえずは)動きます。  
動いているかの確認は、適当なC/C++ファイルを開いてコード打って補完候補が出てくるかどうかでできます。  
ただ、私の環境だとそもそもLSPが立ち上がっていなかったり、立ち上がっていても`clangd`を呼び出してくれないなどトラブルが頻発しました。  
設定を`dein.toml`の上の方に書いたら直ったんで今は動いてますが、どうして起動しなかったりしたのかは結局よくわからないです。  

#### 追記

これ`hook_source`じゃなくて`hook_add`って書く必要があったぽい、そのせいだったかもしれない。  
  
設定中の`let g:LanguageClient_autoStart = 1`はLSPを自動起動するというものです。起動していなくても、手動で`:LanguageClientStart`とコマンドに打つことで起動することができます。  

### Python

どうせなのでPython用のLSPも導入します。  
2つあるようですが、GitHubのスター数的に[Python Language Server](https://github.com/palantir/python-language-server)を導入すればいいでしょう。  
インストールは`pip install python-language-server`で行います。  
そして`README.md`に書かれてあるとおり、いくつかのプラグインをオプションとして用いることが可能なようです。  
私はこの中からリンターである`pycodestyle`(以前まで`pep8`と呼ばれていたもの)とコードを保存時にフォーマットしてくれる`yapf`を導入しました。  
導入には、

```
$ pip install 'python-language-server[pycodestyle]'
$ pip install 'python-language-server[yapf]'
```

などとすれば良いようです。  
そしてLanguageClient-neovimの設定に、

```toml
    let g:LanguageClient_serverCommands = {
        \ 'python': ['pyls'],
\ }
```

を追記すれば動きます。  
おそらくこれでリンターも動くはずなので(まだ確認していないのですが)、`ale`で`pylint`とかを動かしていたのですが、これらを削除しました。  
こんな感じです。まだキーコンフィグ全く設定していないので、そのうち追記するかと思います。  

### Reference

  * [NeovimでC/C++のIDE(っぽい)環境を構築する](https://qiita.com/arwtyxouymz0110/items/b09ef1ed7a2f7bf1c5e6)
  * [LanguageClient-neovim](https://github.com/autozimu/LanguageClient-neovim)
  * [neovimでLSP(LanguageServerProtocol)を使ってみる](http://wheson-prog.hatenablog.jp/entry/2018/06/05/141730)
  * [Python Language Server](https://github.com/palantir/python-language-server)
  * [Language Server Protocolを使ってvimでpython入力補完](https://qiita.com/kouichi_c/items/5f047ab3a7c64277e97c)
