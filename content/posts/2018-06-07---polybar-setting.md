---
date: "2018-06-07T13:24:32+09:00"
title: "Polybarの設定"
slug: polybar-setting
description: "前回に引き続きPolybarの設定"
template: "post"
category: "Article"
draft: false
tags:
  - "Linux"
  - "i3wm"
socialImage: "/media/2018-06-07-screenshot1806071323.jpg"
redirect_from:
  - /2018/180607_polybar_setting/
---

## 外観

![Screenshot1806071323](/media/2018-06-07-screenshot1806071323.jpg)

色は NeoVim の Onedark テーマに揃えた

i3blocks よりも色々設定できたり便利になってよかった、思ってたよりもメモリ消費量も変わらなかったしいい感じ

### ワークスペース

左端にあるやつ、使用していないワークスペースも常に表示させておきたかったんだけど、そういうのは現状の i3wm では無理なのかな？

"+"はワークスペースを一つ増やすボタン、使用していないワークスペースのうち最も若い番号のワークスペースに遷移する

Virtual Box 起動させると Mod キーが使用できなくなってワークスペース増やせないのが不便だったので作った

キーバインディングとしては Mod+HankakuZenkaku にしてある

あんま使わないかなーと思ってたけど、何番のワークスペースがあいているか確認してからワークスペース開いていた動作がなくなるのもあって結構よく使うようになった

### MPD

音楽鳴らせますね

i3block だとクリックの種類で再生だったり曲の遷移だったりを変えていたのが、Polybar だた各ボタンで操作可能なのが便利

### システムトレイ

表示されるのは次の項目

- Bluetooth 接続状態(接続時のみ表示)
- アップデートの有無(アップデートがあるときだけ表示)
- ネットワーク(有線 or 無線-SSID)
- メモリ消費量
- バッテリー
- 音量
- 時計

## 設定ファイル

### launch.sh

Polybar、Mod+Shift+r で i3wm を再読込するとワークスペースのモジュールが動作しなくなってしまうので、そのへんを考慮した

```sh
#!/bin/bash

## restart i3
if [[ $1 = "restart" ]]; then
	i3-msg restart
	sleep 1
fi

# Terminate already running bar instances
killall -q polybar

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

# Launch bar
polybar eDP1 &
polybar HDMI1 &
polybar DP2
```

引数に`restart`を書くと i3wm を再読込してから Polybar を再起動する

### config

Polybar はもともとモジュールをいくつも持っていて、デフォルトだとそれらから構成されているんだけど、若干出力がクドかったり冗長だなと感じたので i3blocks のときに作ったモジュールをほとんど流用した

カスタムモジュールを使うのも結構楽だったので、そのへんは Wiki がちゃんと充実してるから見ながらやればだいたいできると思う

```conf
[colors]
mono0 = #282c34
mono1 = #545862
mono2 = #abb2bf
mono3 = #c8ccd4
mono4 = #353b45
red = #e06c75
green = #98c379
yellow = #e5c07b
blue = #61afef
purple = #c678dd
teal = #56b6c2

[bar/eDP1]
monitor = ${env:MONITOR:eDP1}
bottom = true
fixed-center = true

width = 100%
height = 25
offset-x = 0%
offset-y = 0%
radius = 0.0

background = ${colors.mono0}
foreground = ${colors.green}

line-size = 3
line-color = #f00

border-size = 0
border-color = #00282c34

padding-left = 0
padding-right = 0

module-margin-left = 0
module-margin-right = 0

font-0 = Source Han Code JP H:pixelsize=11;2
font-1 = FontAwesome:pixelsize=12;3

modules-left = i3 add_ws
modules-center = ncmpcpp mpd
modules-right = bluetooth update network memory battery volume date

separator =
dim-value = 1.0

;tray-position =
;tray-padding = 0
;tray-transparent = false
;tray-background = ${root.background}

;wm-restack = i3
;override-redirect = true
enable-ipc = true

scroll-up = i3wm-wsnext
scroll-down = i3wm-wsprev

cursor-click = pointer
cursor-scroll = default

[bar/HDMI1]
monitor = ${env:MONITOR:HDMI1}
(略)

[bar/DP2]
monitor = ${env:MONITOR:DP2}
(略)

[module/i3]
type = internal/i3
format = <label-state> <label-mode>
index-sort = true
wrapping-scroll = false
;label-mode-padding = 2
;label-mode-foreground = #000
;label-mode-background = ${colors.mono0}

; focused = Active workspace on focused monitor
label-focused = %index%
label-focused-background = ${colors.green}
label-focused-foreground = ${colors.mono0}
label-focused-padding = 2

; unfocused = Inactive workspace on any monitor
label-unfocused = %index%
label-unfocused-background = ${colors.mono4}
label-unfocused-foreground = ${colors.mono2}
label-unfocused-padding = 2

; visible = Active workspace on unfocused monitor
label-visible = %index%
label-visible-background = ${colors.mono4}
label-visible-foreground = ${colors.mono2}
label-visible-padding = 2

; urgent = Workspace with urgency hint set
label-urgent = %index%
label-urgent-background = ${colors.red}
label-urgent-foreground = ${colors.mono0}
label-urgent-padding = 2

[module/add_ws]
type = custom/text
content = 
content-padding = 1
content-background = ${colors.mono4}
content-foreground = ${colors.mono2}
click-left = exec ~/.config/polybar/scripts/add_ws.py

[module/ncmpcpp]
type = custom/text
content = " "
click-left = exec gnome-terminal -- ncmpcpp &
click-right = exec gnome-terminal -- ncmpcpp &

[module/mpd]
type = internal/mpd
format-online = <icon-prev> <icon-stop> <toggle> <icon-next> <label-song>

icon-prev = 
icon-stop = 
icon-play = 
icon-pause = 
icon-next = 

label-song-maxlen = 50
label-song-ellipsis = true

[module/bluetooth]
type = custom/script
exec = echo "%{F#98c379}"
exec-if = echo info | bluetoothctl | grep 'Device'
interval = 10
click-left = exec blueman-manager
click-right = exec blueman-manager
format-padding = 1
format-background = ${colors.mono4}
format-foreground = ${colors.mono2}

[module/update]
type = custom/script
exec = echo "%{F#e5c07b} $(checkupdates | wc -l)"
exec-if = checkupdates | grep '\->'
interval = 3600
format-padding = 1
format-background = ${colors.mono4}
format-foreground = ${colors.mono2}

[module/network]
type = custom/script
exec = ~/.config/polybar/scripts/network.sh
interval = 10
click-left = exec gnome-terminal -- nmtui &
click-right = exec gnome-terminal -- nmtui &
format-padding = 1
format-background = ${colors.mono4}
format-foreground = ${colors.mono2}

[module/memory]
type = custom/script
exec = ~/.config/polybar/scripts/memory.sh
interval = 10
format-padding = 1
format-background = ${colors.mono4}
format-foreground = ${colors.mono2}

[module/battery]
type = custom/script
exec = ~/.config/polybar/scripts/battery.sh
interval = 20
format-padding = 1
format-background = ${colors.mono4}
format-foreground = ${colors.mono2}

[module/volume]
type = custom/script
exec = ~/.config/polybar/scripts/volume.sh
click-left = exec pactl set-sink-mute @DEFAULT_SINK@ toggle
click-right = exec pavucontrol &
interval = 1
format-padding = 1
format-background = ${colors.mono4}
format-foreground = ${colors.mono2}

[module/date]
type = custom/script
exec = date '+%H:%M'
format-prefix = " "
interval = 60
format-background = ${colors.green}
format-foreground = ${colors.mono0}
format-padding = 1

[settings]
screenchange-reload = true
;compositing-background = xor
;compositing-background = screen
;compositing-foreground = source
;compositing-border = over

[global/wm]
margin-top = 5
margin-bottom = 5

; vim:ft=dosini
```

### Scripts

i3blocks で使っていたのは省略して、新しく作ったのを紹介

ワークスペース増やすボタンのやつです、ほんとはシェルスクリプトで書ければよかったんだけど Python で書くのが簡単そうだったので逃げた

i3wm には Python モジュールがあって結構いろいろ使うことができるみたい

```python
#!/usr/bin/python
import subprocess
import i3

max_ws = 0
ws_list = [[x, 0] for x in range(11)]
# get a list of workspaces
for workspace in i3.get_workspaces():
    # get the workspace tree data
    workspace_tree = i3.filter(num=workspace.get('num'))
    ws_list[int(workspace.get('num'))][1] = 1
for i in ws_list:
    if i[0] > max_ws and not i[1]:
        subprocess.run(['i3-msg', 'workspace', str(i[0])])
        break
```

## Reference

[GitHub-tonooo71:polybar](https://github.com/tonooo71/dotfiles/tree/master/.config/polybar)
