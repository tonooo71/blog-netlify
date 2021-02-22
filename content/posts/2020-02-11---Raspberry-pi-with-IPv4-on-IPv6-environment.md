---
title: "IPv6環境下でRaspberry pi 4をIPv4接続"
date: "2020-02-11T21:15:31.920892"
description: "IPv6(IPoE)環境下でスイッチングハブを使ってRaspberry pi 4をIPv4接続し、外部からIPアドレスで接続できるようにする"
tags: 
  - "Raspberry pi"
template: "post"
socialImage: "/media/2020-02-11-ipv6v4.png"
draft: false
category: "Tech memo"
---

## 前提

うちのIPv6(IPoE)接続環境は以下の通り  

![IPv6接続環境](/media/2020-02-11-ipv6.png)

  * フレッツ光ネクストマンションタイプ(プロパイダ: BIGLOBE)
  * ルーター: WN-AX1167GR2(IO DATA)

## 実現したいこと

  * Raspberry pi 4を購入したので、サーバ用途に使いたい
  * ただこれまでのPCはIPv6接続のままを維持したい
  * IPv6ルータに接続したPCからRaspberry pi 4にローカルでSSH接続したい

## 結果

以下のような構成となった  

![IPv6v4接続環境](/media/2020-02-11-ipv6v4.png)

  * スイッチングハブ: LS105G(TP-Link)
  * IPv4ルータ: WHR-G301N(Buffalo)

## 詳細

IPv6ルータ側の設定は変更せず、IPv4ルータ側の設定をする  
まずIPv4ルータのDHCPサーバ機能を切り、IPv4ルータのIPアドレスをIPv6ルータのDHCPサーバで割当可能なIPアドレスにする必要がある  
例えば、IPv6ルータのIPアドレスが`192.168.0.1`で割当可能なIPアドレスが`192.168.0.2`から`192.168.0.32`だった場合、IPv4ルータのIPアドレスを`192.168.0.31`などに設定する  
そして、IPv6ルータとIPv4ルータを接続することで、IPv6ルータに接続されたPCからIPv4ルータに接続されたRaspberry pi 4にローカルIPでアクセスできるようになる

## その他

Raspberry pi 4のファイアウォール設定やIPアドレス固定の設定は別に書くかも

## Reference

  * [IPv4 PPPoEとIPv6（v6プラス）を併用する](https://oyamadenshi.com/ipv6-ipv4/)
