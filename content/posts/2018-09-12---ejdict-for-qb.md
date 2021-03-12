---
date: "2018-09-12T21:59:44+09:00"
title: "qutebrowserで英和辞書を使う"
slug: ejdict-for-qb
description: "スクリプトで対応させる"
tags:
  - "Linux"
template: "post"
socialImage: "/media/2018-09-12-screenshot_ejdict.jpg"
draft: false
category: "Article"
redirect_from:
  - /2018/180912_ejdict_for_qb/180912_ejdict_for_qb/
---

qutebrowser はアドオンが自由に追加できないのがあれだけど、`spawn`コマンドで簡単なものなら割とスクリプトで対応できるのが良い点  
今回は[この記事](https://qiita.com/wtetsu/items/c43232c6c44918e977c9)読んでそういえばポップアップの辞書ほしいな、と思ったので作ってみた  
とはいってもポップアップの仕方とか Javascript とかわからないし、ものすごく単純なものだけど

## 用意するもの

先程の記事にもあったように ejdic-hand を使わせていただきます  
まああんまり詳細なものだと表示しきれるか怪しいし、こんなもんでいいかなって...  
ejdic-hand は(ワード)(タブ)(説明)のように 1 行で 1 つのワードが書かれた txt ファイルです  
なので python で読み込んでそのまま検索させます

```python
import os
import sys


word = sys.argv[1].lower()
us_dir = os.environ['HOME']+'/.local/share/qutebrowser/userscripts'

with open(us_dir+'/ejdict/EJDict/src/ejdic-hand-utf8.txt') as lines:
    for line in lines:
        if line.startswith(word+'\t'):
            print(line)
            sys.exit(0)
```

これだけだと少し使いづらいので、さらに追記します

```python
with open(us_dir+'/ejdict/EJDict/src/ejdic-hand-utf8.txt') as lines:
    for line in lines:
        # 複数形, 三人称単数形
        if word[-1] == 's':
            if line.startswith(word[:-1]+'\t'):
                print(line)
                break
        if word[-2:] == 'es':
            if line.startswith(word[:-2]+'\t'):
                print(line)
                break
        # 進行形
        if word[-3:] == 'ing':
            if line.startswith(word[:-3]+'\t'):
                print(line)
                break
        # 過去形
        if word[-1] == 'd':
            if line.startswith(word[:-1]+'\t'):
                print(line)
                break
        if word[-2:] == 'ed':
            if line.startswith(word[:-2]+'\t'):
                print(line)
                break
    else:
        sys.exit(1)
```

まあ全てはカバーできないですが、基本的な変化をするワードについてはカバーできているはずです

そしてこれをシェルスクリプトを通して実行します  
シェルスクリプトを通す理由は、qutebrowser で userscript を実行した際に使用できる[変数](https://github.com/qutebrowser/qutebrowser/blob/master/doc/userscripts.asciidoc)を python スクリプト内から利用する方法がわからなかったからです...

```bash
#!/bin/bash

us_dir="$HOME/.local/share/qutebrowser/userscripts"

if [ $1 = "ejdict" ]; then
    word='"'$(python $us_dir/ejdict/ejdict.py $QUTE_SELECTED_TEXT)'"'
    if [ $? -eq 0 ]; then
        echo "message-info $word" >> "$QUTE_FIFO"
    else
        echo "message-error 'Cannot find \"$QUTE_SELECTED_TEXT\" in a dictionary'" >> "$QUTE_FIFO"
    fi
fi
```

`$QUTE_SELECTED_TEXT`は選択したテキストを指します  
これで選択したワードを python スクリプトに渡し、返り値を qutebrowser の`message-info`を通して表示させます  
こんな感じに表示されます

![Screenshot ejdict](/media/2018-09-12-screenshot_ejdict.jpg)

`message-info`で表示する都合上、デフォルトの 2000ms では早すぎるはずなので 5000ms に変更しました  
あとはバインドで e かなにかに設定すると、テキスト選択してキー押すだけで写真のように日本語訳が下に表示されるようになります

使った感想としては、オフラインだからかかなり高速ですが辞書が弱いからかヒットしない語句もちらほら見受けられるのがちょっと気になりました

## Refference

[tonooo71/qutebrowser-scripts](https://github.com/tonooo71/qutebrowser-scripts)
