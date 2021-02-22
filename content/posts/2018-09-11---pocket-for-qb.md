---
date: "2018-09-11T10:04:51+09:00"
title: "qutebrowser上でpocketへ保存する"
description: 
tags: 
  - "Linux"
template: "post"
draft: false
category: "Tech memo"
---

最近使い始めたqutebrowser、結構使いやすいのもあってメインブラウザがこっちになりつつある  
問題点としてはFirefoxだったりChromeで使っていたアドオンが基本的に使えないってのがあったけど、個人的にはlastpassとadblock程度しか使っていなかったからそこまで問題はなく使えてる(lastpassは公式でスクリプトが用意されているし)  
また、`spawn`コマンドでターミナル上でスクリプトを実行できるので簡単なアドオンなら追加できる  
そこで後で読むサービスの1つであるpocketに表示している記事を保存するスクリプトなら簡単にかけそうだったので書いてみた  
いろいろ調べるとpocketのpythonモジュール、ラッパーが結構存在している気がするが、記事を追加するだけであれば必要ないので使っていない  

そして書いたものがこれ  

```python
#!/usr/bin/python
import requests
import sys

url = sys.argv[1]
consumer_key = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
access_token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

requests.post('https://getpocket.com/v3/add', {'url': url, 'consumer_key': consumer_key, 'access_token': access_token})
```
  
consumer keyとaccess tokenを事前に取得しておく必要がある  
実行権限を与えたあとで、`config.py`に次のようにでも書けば良い  

```
c.aliases = {'pocket': 'spawn ~/.config/qutebrowser/scripts/pocket.py {url}'}
```

これで`:pocket`と打つだけで記事が保存される  
改善したい点としては、保存した際になにかメッセージを表示させたいかな、ってぐらい

### 追記

保存メッセージはdunst使おうかなとも思ったけど、message-infoとしてqutebrowserに表示させることにした  
けどqutebrowserの環境変数?みたいなのはPythonスクリプト内でどう利用したら良いかわからなかったので、一旦シェルスクリプトを経由させるようにした  

### Refference

[GitHub: tonooo71 - qutebrowser-scripts](https://github.com/tonooo71/qutebrowser-scripts)
