---
title: "Raspberry Pi 4にArch Linuxをインストール"
date: "2020-05-17T20:58:36.185112"
template: "post"
draft: false
description: "インストール後のセットアップ時に詰まった点などをメモ"
category: "Tech memo"
tags: 
  - "Arch Linux"
  - "Linux"
  - "Raspberry pi"
---

## Arch LinuxをRaspberry Pi にインストールする

インストールまでの手順などは基本的な情報は[Arch Wiki](https://wiki.archlinux.jp/index.php/Raspberry_Pi#Raspberry_Pi_4)にまとまっているので、インストール後の設定について、また引っかかった点などをまとめていきます。  

## SSHするにあたって

インストール後はSSHでRaspberry Piにアクセスします。  
このとき、アクセス元のターミナルによってはエラーが出たり、うまくキーボードのキー入力が反映されなかったりします。  
これは、アクセスもとの環境変数$TERMがSSHでアクセスした先にも引き継がれることが原因で、アクセスした先(この場合はRaspberry Pi側)に環境変数で指定されたターミナルのterminfoファイルが存在しないため引き起こされるものです。  
自分はTermiteを使用しており環境変数$TERMは`xterm-termite`となっていましたが、`xterm-termite.terminfo`ファイルがRaspberry Pi側の`/usr/share/terminfo/x/`フォルダ内に存在しておらず、バックスペースキーの入力が画面に反映されないという問題が生じていました。  
そこで、アクセス元のPCの`/usr/share/terminfo/x/xterm-termite.terminfo`ファイルをRaspberry Pi側の`/usr/share/terminfo/x/`フォルダ内にSCPを使ってコピーすることでこの問題は解消されました。

## 初めてpacmanを利用するとき

はじめはパッケージのインストールやアップグレードには`pacman`を利用すると思いますが、その際以下のような出力が表示されることがあります。  

```
warning: Public keyring not found; have you run 'pacman-key --init'?
downloading required keys...
error: keyring is not writable
error: keyring is not writable
error: keyring is not writable
error: keyring is not writable
...
```

キーリングが見つからないと出ているので、出力されたとおりに`pacman-key --init`を実行してみる。  
そして再び`pacman -Syyu`などを実行してみると、自分の環境では以下のような出力となりパッケージのアップデートに失敗してしまいました。  

```
downloading required keys...
:: Import PGP key 77193F152BDBE6A6, "Arch Linux ARM Build System <builder+xu6@archlinuxarm.org>"? [Y/n] 
error: key "77193F152BDBE6A6" could not be looked up remotely
:: Import PGP key 77193F152BDBE6A6, "Arch Linux ARM Build System <builder+xu6@archlinuxarm.org>"? [Y/n] 
error: key "77193F152BDBE6A6" could not be looked up remotely
...
```

いろいろ検索して`pacman-key --refresh-keys`や`pacman -S archlinux-keyring`を実行しても、以前パッケージのアップデートができなかったりそもそもそれらのコマンドが失敗するばかりでした。  
最終的には[Arch Wiki](https://wiki.archlinux.jp/index.php/Pacman-key#.E9.8D.B5.E3.82.92.E3.82.A4.E3.83.B3.E3.83.9D.E3.83.BC.E3.83.88.E3.81.A7.E3.81.8D.E3.81.AA.E3.81.84)を参考に`pacman-key --populate archlinuxarm`を実行したところアップデートに無事成功しました。(Wikiとは異なりarchlinuxのところをarchlinuxarmに変更する点に注意です)

## Wi-Fiに接続する

[こちら](https://tomosoft.jp/design/?p=10356#ArchLinux)を参考に、以下のコマンドを入力していきます。  
事前に`wpa_supplicant`のインストールが必要です。

```
wifi-menu -o

netctl enable _profile
netctl start _profile
```
