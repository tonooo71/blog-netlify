---
date: "2018-08-02T08:33:02+09:00"
title: "デュアルブートでVirtualBox"
slug: virtualbox-vkms
description: "今はWindows10とArch LinuxとのデュアルブートをしていてメインではLinux使っているんだけど、どうしてもWindows使いたい場合がある"
template: "post"
tags:
  - "Linux"
  - "Arch Linux"
draft: false
category: "Article"
redirect_from:
  - /2018/180802_virtualbox_vkms/180802_virtualbox_vkms/
---

今は Windows10 と Arch Linux とのデュアルブートをしていてメインでは Linux 使っているんだけど、どうしても Windows 使いたい場合があって(Office とか Office とか Office とか)  
これまでは Linux 側で VirtualBox に Windows を入れて使っていたんだけど、何分容量が少ないノート PC を使っているから実質トリプルブートになるこのやりかたは厳しいものがあった  
そこでデュアルブートをしている実パーティションの Windows を Linux 側から呼び出せばいいんじゃないかと思って調べてみたらなんかできそうだったのでやってみた

結論から言うとできたけどちょっと問題がいろいろ起きてやっぱやめようってなってしまったが...

### やったこと

基本的には[ArchWiki](https://wiki.archlinux.jp/index.php/VirtualBox/%E3%83%92%E3%83%B3%E3%83%88%E3%81%A8%E3%83%86%E3%82%AF%E3%83%8B%E3%83%83%E3%82%AF#Windows_.E3.81.AE.E3.83.91.E3.83.BC.E3.83.86.E3.82.A3.E3.82.B7.E3.83.A7.E3.83.B3.E3.82.92_VirtualBox_.E3.81.A7.E8.B5.B7.E5.8B.95)に則ってやった  
手順としては、

- 自分のユーザーをグループ`disk`と`vboxusers`に追加
- ArchWiki の通り udev を設定
- 仮想ディスクイメージファイルを作成
- VirtualBox の設定

ディスクイメージファイル作成はちょっと詰まった  
自分のディスク構成は、

```
$ fdisk -l
Disk /dev/nvme0n1: 238.5 GiB, 256060514304 bytes, 500118192 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 06321AVC-9994-4055-9FFF-F62FFC20193E

Device             Start       End   Sectors   Size Type
/dev/nvme0n1p1      2048    206847    204800   100M EFI System
/dev/nvme0n1p2    206848    239615     32768    16M Microsoft reserved
/dev/nvme0n1p3    239616 168017419 167777804    80G Microsoft basic data
/dev/nvme0n1p4 168017920 496429055 328411136 156.6G Microsoft basic data
/dev/nvme0n1p5 496431104 500117503   3686400   1.8G Windows recovery environment
```

ってなっているんだけど(nvme0n1p3 が Windows10、nvme0n1p4 が Arch Linux)、Wiki の通りにやると UEFI シェルが出てきてどうにもなんなくなってしまう(できるのかもしれないけどよくわからん)

```
$ vboxmanage internalcommands createrawvmdk -filename /path/to/vm/folder/windows.vmdk -rawdisk /dev/nvme0n1 -partitions 2,3 -relative
```

なのでブートローダーがある領域まで突っ込めばなんとかなるんじゃないかと思ってやってみた

```
$ vboxmanage internalcommands createrawvmdk -filename /path/to/vm/folder/windows.vmdk -rawdisk /dev/nvme0n1 -partitions 1,2,3 -relative
```

すると起動成功(systemd-boot から始まってしまうのでそこで Windows 選択する必要が出たが)  
普通に使えるしいいじゃん、ディスク容量も節約できるし

### やったぜ

って思ってたけど大きな問題点が 2 つ出た

1 つは VirtualBox で起動させると Windows のライセンス認証が通らない、通ってない状態になる  
なので普通に Windows 起動させたときにライセンス認証いちいちする必要が出てきてしまう  
(Wiki には設定で Hyper-V をオンにするとライセンス問題回避できるかもね、って書いてあるけど自分は無理でした)  
あと Office のライセンス認証も通らなかった

これより面倒な問題あって、VirtualBox で Windows を起動したあと普通に Windows を起動させて終了させるとなぜかブートローダーの順序が変わってしまうのに気がついた  
つまりいつもは Linux の systemd-boot を使っているんだけど、なぜか Windows のブートローダーが優先順位高く変更されてしまい、Linux が起動できなくなってしまう(いちいち BIOS 設定で変更しないといけなくなってしまった)

そこまでして実パーティションの Windows を呼び出して使うか...となってしまったので、結局元通り VirtualBox 上にインストールして今は使ってる

### Reference

- [デュアルブートしている環境で VirtualBox でホスト OS を Linux とし Windows をゲスト OS として起動する](https://www.ncaq.net/2018/01/31/17/12/33/)
- [実相を仮想的に窓開くこと](https://medium.com/@matsu_hiroshi/%E5%AE%9F%E7%9B%B8%E3%82%92%E4%BB%AE%E6%83%B3%E7%9A%84%E3%81%AB%E7%AA%93%E9%96%8B%E3%81%8F%E3%81%93%E3%81%A8-e37ae0c61ebf)
- [Windows のパーティションを VirtualBox で起動](https://wiki.archlinux.jp/index.php/VirtualBox/%E3%83%92%E3%83%B3%E3%83%88%E3%81%A8%E3%83%86%E3%82%AF%E3%83%8B%E3%83%83%E3%82%AF#Windows_.E3.81.AE.E3.83.91.E3.83.BC.E3.83.86.E3.82.A3.E3.82.B7.E3.83.A7.E3.83.B3.E3.82.92_VirtualBox_.E3.81.A7.E8.B5.B7.E5.8B.95)
