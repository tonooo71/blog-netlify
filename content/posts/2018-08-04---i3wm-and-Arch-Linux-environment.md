---
title: "i3wm + Arch Linux初期環境構築まとめ"
date: "2018-08-04T17:40:07.370970"
description: "Arch Linuxにタイル型ウィンドウマネージャi3wmを入れた時のセットアップまとめ"
template: "post"
tags:
  - "i3wm"
  - "Linux"
  - "Arch Linux"
draft: false
category: "Article"
---

## 概要

なんで i3wm という Window Manager を使うようになったかというと、ノート PC を Arch Linux+Gnome で使用していて以下のような気になる点があったからです。

- 画面が小さいので、無駄なくウィンドウを整列させて使いたい
- タッチパッドでの操作がしにくいので、キーボードで基本的な操作を完結させたい
- Gnome は(比較的)重い(らしい)ので、軽いウィンドウマネージャを使いたい

実際使ってみると軽いしキーボードで操作しやすいし、なんなら GUI じゃなくて CUI のアプリケーション使うようになったりといった変化もありました。

ただ Arch Linux をインストールした上で Windows Manager を i3wm だけインストールすると、いろいろ設定したりパッケージをインストールしたりするのがね...面倒...

Arch Linux のインストールは[ArchWiki: インストールガイド](https://wiki.archlinux.jp/index.php/%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89)のとおりにやりましたがここは省略。

## i3wm インストール

`i3-wm`と`i3status`、`dmenu`(ランチャー)をインストールします。
(`i3status`と`dmenu`は後で別のものに置き換えますが、設定しなくとも使えるのでまずはこれをインストールしておきます)
初期設定で Mod キーをどこにするか聞かれますが、Windows の入っていた PC なら Win キーである Mod4 が無難だと思います。

ディスプレイマネージャとして`LightDM`、あとはターミナルを何かインストールしておきます。

ノート PC なら省電力用に`tlp`とかインストールしておくのもあり。

### ネットワーク設定

ネットワーク管理のためのパッケージをインストールします。(私は`NetworkManager`にしています)
`NetworkManager.service`は`dhcpcd.service`と競合するので、`dhcpcd.service`を disable する必要があります。

Bluetooth を使用するには`bluez`と`bluez-utils`を導入します。
(PluseAudio を使用していて Bluetooth ヘッドホン使いたいなら`pulseaudio-bluetooth`もインストールする必要がありそうです)
このままでも CLI で接続設定することができますが([Bluetooth: CLI による設定](https://wiki.archlinux.jp/index.php/Bluetooth#CLI_.E3.81.AB.E3.82.88.E3.82.8B.E8.A8.AD.E5.AE.9A))、私は GUI で設定したいので`Blueman`をインストールしました。

### Fcitx

日本語入力するために Fcitx と Mozc をインストールします。
あとは日本語フォントも適当に入れておきます。(Noto font とか ipafont とか)

```shell
sudo pacman -S fcitx fcitx-mozc fcitx-im fcitx-configtool
sudo pacman -S otf-ipafont ttf-dejavu
```

設定

~/.xintrc

```sh
export DefaultImModule=fcitx
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

fcitx を起動したら、fcitx-configtool から適当なキーボードと mozc を追加します。

## i3 関連

i3 は`~/.config/i3/config`に設定を記述することでカスタマイズが可能です。
ここで設定可能な項目は、だいたいキーバインドとアプリケーション設定がほとんどです。

### キーバインド

ほとんどデフォルトのままですが、追加した設定をいくつか記述します
3 つめのはマルチディスプレイのときにワークスペースを移動するためのものです。

~/.config/i3/config

```conf
# Font for window titles. Will also be used by the bar unless a different font
# is used in the bar {} block below.
#font pango:monospace 8
font pango:Dejavu Sans,IPAGothic 10

# Prior=Page up Next=Page Down
bindsym $mod+Prior workspace prev
bindsym $mod+Next workspace next

#move workspace
bindsym $mod+Shift+Prior move workspace to output up
bindsym $mod+Shift+Next move workspace to output down
```

### ハードウェアキーの設定

特殊キーの名前を調べるには`xorg-xev`パッケージの`xev`コマンドで可能です。

#### 輝度

[バックライト(ArchWiki)](https://wiki.archlinux.jp/index.php/バックライト)を参照。
輝度の調整をキーに割り当てるには、`xorg-xbacklight`パッケージの`xbacklight`コマンドを使って config に書き込みます。

~/.config/i3/config

```conf
# Screen brightness controls
bindsym XF86MonBrightnessUp exec xbacklight -inc 10
bindsym XF86MonBrightnessDown exec xbacklight -dec 10
```

#### 音量

まず`pulseaudio`と設定ツールである`pavucontrol`をインストールします。
`pluseaudio`のフロントエンドとしては`pamixer`などが存在します。(あとで使うのでインストールしておきました)
あと flash の音を出すために`pulseaudio-alsa`が必要です。

~/.config/i3/config

```conf
# Pulse Audio controls
bindsym XF86AudioRaiseVolume exec --no-startup-id pactl set-sink-volume 0 +5%
bindsym XF86AudioLowerVolume exec --no-startup-id pactl set-sink-volume 0 -5%
bindsym XF86AudioMute exec --no-startup-id pactl set-sink-mute 0 toggle
```

#### スクリーンショット

せっかくなのでスクリーンショットも PrtScr キーで動作させます。
スクリーンショットには`imagemagick`パッケージを使用します。
]
~/.config/i3/config

```conf
# screenshot
bindsym Print exec --no-startup-id import -window root ~/Pictures/screenshot`date "+%y%m%d%H%M"`.jpg
```

### その他

#### 壁紙

`feh`で設定します。(feh は軽量の画像ビューアです)

```shell
feh --bg-scale ~/Pictures/wallpaper.png
```

最後に設定した壁紙(とコマンド)を使用するのであれば

```shell
~/.fehbg
```

で大丈夫です。

#### 外部モニタ

まず`xrandr`をインストールします。
そして HDMI ポートや VGA ポートに接続された際に、自動的に画面を拡張するようなスクリプトを書いた上で、自動起動させておきます。(スクリプトはご自身の環境に合わせてください)

~/.config/i3/config

```conf
exec --no-startup-id ~/.config/i3/script/monitor_detect.sh
```

~/.config/i3/script/monitor_detect.sh

```bash
#!/bin/bash

#st_prev=$(cat /sys/class/drm/card0-HDMI-A-1/status)
st_prev="disconnected"

while :
do
    st_next=$(cat /sys/class/drm/card0-HDMI-A-1/status)
    if [ $st_prev != $st_next ]; then
        st_prev=$st_next
        if [ $st_next = "connected" ]; then
            xrandr --output eDP1 --mode 1600x900 --output HDMI1 --auto --above eDP1
        else
            xrandr --output eDP1 --mode 1600x900 --output HDMI1 --off
        fi
        ~/.fehbg
    fi
    sleep 1
done
```

#### 蓋を閉じたときの動作

ノート PC なので、蓋を閉じたらサスペンドするように変更します。

/etc/systemd/logind.conf

```conf
HandleLidSwitch=suspend
```

#### 画面ロック

`i3lock`が標準で推奨されているようですが、マルチモニタで壁紙がずれるので`light-locker`を使います。
これだと LightDM のログイン画面と同じになります。
`light-locker`をサスペンドから起動した後に使用するには、

~/.config/i3/config

```conf
exec --no-startup-id light-locker --lock-on-suspend
```

### dmenu の代替

`rofi`が上位互換として使えます。
これについてはこちらのサイト([Jenemal Notes](http://malkalech.com/rofi_window_switcher))に詳しく説明されているので割愛します。

### i3status の代替

自作スクリプトを適用できたり、見た目をより柔軟に変えられるパッケージが存在します。
シンプルながらある程度の拡張性がある`i3blocks`と、外観までかなり自由に変えることができる`polybar`があります。
詳しい設定は省きますが、`i3blocks`も`polybar`も設定ファイルは GitHub に上げていますので良ければ。
`polybar`に関しては[別記事](https://tonooo71.github.io/post/180607_polybar_setting/)にも書いています。

### config(一部)

~/.config/i3/config

```conf

# start a terminal
bindsym $mod+Return exec termite

# kill focused window
bindsym $mod+Shift+q kill

# start a program launcher
bindsym $mod+d exec ~/.config/i3/script/rofi_launch.sh

# switch to workspace
bindsym $mod+Zenkaku_Hankaku exec --no-startup-id ~/.config/polybar/scripts/add_ws.py
bindsym $mod+Prior workspace prev
bindsym $mod+Next workspace next

#move workspace
bindsym $mod+Shift+Prior move workspace to output up
bindsym $mod+Shift+Next move workspace to output down

# restart i3 inplace (preserves your layout/session, can be used to upgrade i3)
bindsym $mod+Shift+r exec --no-startup-id ~/.config/polybar/launch.sh restart

# color
# class                 border  backgr. text    indicator child_border
client.focused          #98c379 #98c379 #282c34 #98c379   #545862
client.focused_inactive #545862 #545862 #abb2bf #545862   #545862
client.unfocused        #545862 #545862 #abb2bf #545862   #545862

# Pulse Audio controls
bindsym XF86AudioRaiseVolume exec --no-startup-id pactl set-sink-volume @DEFAULT_SINK@ +5%
bindsym XF86AudioLowerVolume exec --no-startup-id pactl set-sink-volume @DEFAULT_SINK@ -5%
bindsym XF86AudioMute exec --no-startup-id pactl set-sink-mute @DEFAULT_SINK@ toggle

# backlight
bindsym XF86MonBrightnessUp exec xbacklight -inc 10
bindsym XF86MonBrightnessDown exec xbacklight -dec 10

# screenshot
bindsym Print exec --no-startup-id import -window root ~/Pictures/screenshot`date "+%y%m%d%H%M"`.jpg

# startup apps
exec --no-startup-id xrandr --output eDP1 --mode 1600x900 --output HDMI1 --off
exec --no-startup-id ~/.config/i3/script/monitor_detect.sh
exec --no-startup-id ~/.fehbg
exec --no-startup-id fcitx
exec --no-startup-id ~/.config/polybar/launch.sh
exec --no-startup-id light-locker --lock-on-suspend
exec --no-startup-id xset s off -dpms
exec --no-startup-id dropbox

# application setting(float)
for_window [class="Lxappearance"] floating enable, resize set 600 400
for_window [class="Pavucontrol"] floating enable, resize set 600 400
for_window [class="Fcitx-config-gtk3"] floating enable, resize set 600 400
for_window [class="mozc_tool"] floating enable, resize set 600 400
for_window [class="Blueman-manager"] floating enable, resize set 600 400
for_window [class="Gnome-terminal"] floating enable move absolute position 990 px 470 px, resize set 600 400

```

最後の application setting(float)では、タイルではなく通常のウィンドウのような感じで表示させるアプリの指定ができます。
基本的には設定ツールに適用しています。
`lxappearance`は GTK+テーマやアイコン、ポインタを変更することができるツールです。
アプリのクラス名を調べるためには`xorg-xprop`パッケージをインストールして、

```shell
xprop | grep WM_CLASS
```

任意のアプリの画面をクリックすると

```shell
WM_CLASS(STRING) = "urxvt", "URxvt"
```

こんな感じで表示されます。

### 最後に

本当に使いやすいです。
基本的にキーボードで操作できるということもあって、同様にキーボードで操作できる CUI アプリケーションを使うようになりましたね。(`ranger`とか`neovim`とか`ncmpcpp`とか)
メモリも起動時で 0.2~0.3GB 程度しか使用しておらずかなり軽量なのも良いです。

### Source

[GitHub: tonooo71/dotfiles](https://github.com/tonooo71/dotfiles)

### Qiita

[Qiita: i3+Arch Linux 初期環境構築まとめ](https://qiita.com/Tonooo/items/256fcaffd7113b1ed018)
