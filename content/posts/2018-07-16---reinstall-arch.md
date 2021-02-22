---
date: "2018-07-16T02:05:47+09:00"
title: "Arch Linux再インストールで詰まった点"
description: 
template: "post"
tags: 
  - "Linux"
  - "Arch Linux"
draft: false
category: "Tech memo"
---

## デュアルブート

Windows: 80GB  
Arch Linux: 160GB  
  
Windowsのパーティションツールでは120GBぐらいまでしかできなかったから、フリーソフト使用した

## Arch Linuxインストール

arch-chrootでインストールすべきもの  

  * NetworkManager
  * tlp

## Arch Linux設定

#### 日本語キーボード

`loadkeys jp106`しているのにターミナル上で日本語キーボードにならない(英語キーボードになる)  
これは`setxkbmap -layout jp`とすることで治る  
`loadkeys jp106`はCUI環境に限り有効らしい

#### ncmpcppでmp3が表示されない

`u`を押してロードするのを忘れていた

#### yaourtがない

というかarchlinux.frに繋がらない...  
手動で`yay`をインストールした

#### ranger

rangerだけはdotfilesに一部の設定ファイルしか保存してないので、一旦設定をコピーしてからdotfilesのファイルで上書きする  

```
$ ranger --copy-config=all
```

#### USB認識

今回もマジでよくわからなかった  
Udisksっぽいんだけど、結局Nautilusで解決してしまった