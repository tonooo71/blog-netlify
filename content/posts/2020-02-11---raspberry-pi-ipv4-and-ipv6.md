---
title: "IPv6環境下でRaspberry pi 4をIPv4接続"
date: "2020-02-11T21:15:31.920892"
slug: raspberry-pi-ipv4-and-ipv6
description: "IPv6(IPoE)環境下でスイッチングハブを使ってRaspberry pi 4をIPv4接続し、外部からIPアドレスで接続できるようにする"
tags:
  - "Raspberry pi"
template: "post"
socialImage: "/media/2020-02-11-ipv6v4.png"
draft: false
category: "Article"
redirect_from:
  - /2020/200211_ipv4raspi/
---

## 前提

うちの IPv6(IPoE)接続環境は以下の通り

![IPv6接続環境](/media/2020-02-11-ipv6.png)

- フレッツ光ネクストマンションタイプ(プロパイダ: BIGLOBE)
- ルーター: WN-AX1167GR2(IO DATA)

## 実現したいこと

- Raspberry pi 4 を購入したので、サーバ用途に使いたい
- ただこれまでの PC は IPv6 接続のままを維持したい
- IPv6 ルータに接続した PC から Raspberry pi 4 にローカルで SSH 接続したい

## 結果

以下のような構成となった

![IPv6v4接続環境](/media/2020-02-11-ipv6v4.png)

- スイッチングハブ: LS105G(TP-Link)
- IPv4 ルータ: WHR-G301N(Buffalo)

## 詳細

IPv6 ルータ側の設定は変更せず、IPv4 ルータ側の設定をする  
まず IPv4 ルータの DHCP サーバ機能を切り、IPv4 ルータの IP アドレスを IPv6 ルータの DHCP サーバで割当可能な IP アドレスにする必要がある  
例えば、IPv6 ルータの IP アドレスが`192.168.0.1`で割当可能な IP アドレスが`192.168.0.2`から`192.168.0.32`だった場合、IPv4 ルータの IP アドレスを`192.168.0.31`などに設定する  
そして、IPv6 ルータと IPv4 ルータを接続することで、IPv6 ルータに接続された PC から IPv4 ルータに接続された Raspberry pi 4 にローカル IP でアクセスできるようになる

## その他

Raspberry pi 4 のファイアウォール設定や IP アドレス固定の設定は別に書くかも

## Reference

- [IPv4 PPPoE と IPv6（v6 プラス）を併用する](https://oyamadenshi.com/ipv6-ipv4/)
