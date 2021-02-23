---
date: "2018-07-16T02:05:47+09:00"
title: "Arch Linux再インストールで詰まった点"
description:
template: "post"
tags:
  - "Linux"
  - "Arch Linux"
draft: false
category: "Article"
---

## デュアルブート

Windows: 80GB  
Arch Linux: 160GB

Windows のパーティションツールでは 120GB ぐらいまでしかできなかったから、フリーソフト使用した

## Arch Linux インストール

arch-chroot でインストールすべきもの

- NetworkManager
- tlp

## Arch Linux 設定

#### 日本語キーボード

`loadkeys jp106`しているのにターミナル上で日本語キーボードにならない(英語キーボードになる)  
これは`setxkbmap -layout jp`とすることで治る  
`loadkeys jp106`は CUI 環境に限り有効らしい

#### ncmpcpp で mp3 が表示されない

`u`を押してロードするのを忘れていた

#### yaourt がない

というか archlinux.fr に繋がらない...  
手動で`yay`をインストールした

#### ranger

ranger だけは dotfiles に一部の設定ファイルしか保存してないので、一旦設定をコピーしてから dotfiles のファイルで上書きする

```
$ ranger --copy-config=all
```

#### USB 認識

今回もマジでよくわからなかった  
Udisks っぽいんだけど、結局 Nautilus で解決してしまった
