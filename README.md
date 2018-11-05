novel-builder.js
================

篠宮樹里「絵子よ、Web小説の執筆を補助するツールをNode.jsで作ってみたぞ」  
瀬尾絵子「何でもJavaScriptでやりたいんだねー……」

## Description

このツールは、小説の執筆を補助する下記のような機能を追加します。

* 小説の原稿を各種小説投稿サイト向けの原稿に変換する機能
* [電書協 EPUB 3 制作ガイド](http://ebpaj.jp/counsel/guide)に準拠したEPUBを作成する機能
* 小説をPNG画像で出力する機能
* 行頭に全角スペースを挿入する等の校正機能
* レポート出力機能

また、このツールは、次のような方々を主なターゲットにしています。

* 小説もNode.jsプロジェクトとして執筆(開発)したい！
* 開発で使い慣れたエディタを執筆にも使いたい！
* 原稿はMarkdown形式で書きたい！
* node.jsやnpmに抵抗がない。むしろ好き！

それでもよろしければ、続きをお読みください。

## Demo

このツールを組み込んだWeb小説をGitHubに公開しています。

* [Redmineで始める異世界人心掌握術](https://github.com/8novels/redmine-fantasy)
* [福音のマーメイド 〜福井ロコドル活動記〜](https://github.com/8novels/evangelical-mermaids)

## Usage

樹里「ではさっそく、このツールの使い方……というか、Node.jsプロジェクトとして小説を執筆する方法について解説していこう」  
絵子「お願いします」

### 準備

#### Node.jsをインストールする

樹里「まず最初にやるべき事は、[Node.js](https://nodejs.org/ja/)のインストールだ」  
絵子「そりゃ、これがないと動かないからねー」

#### Node.jsプロジェクトを作成する

樹里「次に、Node.jsプロジェクトを作成しよう」  
絵子「お、難しそうだね」  
樹里「そんな事はない。ディレクトリをひとつ作るだけだ」  
絵子「それだけ？」  
樹里「ああ。その代わり、ディレクトリ名は半角英数字、ハイフン、アンダーバーのみを使用したほうがいい」  
絵子「日本語は使わないほうがいいのね」  
樹里「ちなみに、私達の活躍を書いたWeb小説『[恋に落ちるコード.js](https://github.com/8novels/jk-meets-js)』の
プロジェクト名は`jk-meets-js`だ」  
絵子「あ、そんな名前だったんだ」

#### package.jsonを作成する

樹里「続いて、これがNode.jsプロジェクトであることを宣言するファイル、`package.json`を作成しよう」  
絵子「ここをNode.jsプロジェクトとする！」  
樹里「ちゃんと専用のコマンドが用意されている。ターミナルで作成したディレクトリに移動し、次のコマンドを入力しよう」

```
npm init
```

絵子「英文が表示されたね」  
樹里「必要なプロパティを対話形式で入力していくのだが、とりあえずエンターキーを押していけば完了する」  
絵子「それでいいの？」  
樹里「もちろん、それぞれの意味は理解しておいたほうがいい。特にライセンスの部分などはな。だが、最初はそれでいいだろう」  
絵子「はーい」

#### ツールをインストールする

樹里「さて、プロジェクトが作成できたところで、いよいよ主役の登場だ」  
絵子「いよっ、待ってました！」  
樹里「本ツール『novel-builder』をインストールするためのコマンドがこれだ」

```
npm install novel-builder --save
```

樹里「ちなみに`--save`オプションをつけることで`package.json`に必要な情報を追記してくれる」  
絵子「なるほど」

#### package.jsonを編集する(`scripts`プロパティ)

樹里「では、出来上がった`package.json`を開いてみよう」  
絵子「おーぷん！」  
樹里「先程`npm init`で指定した各種設定がJSON形式で記述されている」  
絵子「ほんとだ。`name`とか`version`とか書いてあるね」  
樹里「ちなみにインストールしたnovel-builderの情報は`dependencies`に書かれている」  
絵子「おー、あるある」  
樹里「この`package.json`の任意の場所に、下記の情報を手動で追加する必要がある」

```
  "scripts": {
    "novel-build": "novel-build",
    "novel-build-narou": "novel-build-narou",
    "novel-build-note": "novel-build-note",
    "novel-build-novelabo": "novel-build-novelabo",
    "novel-png": "novel-png",
    "novel-png-square": "novel-png-square",
    "novel-png-paperback": "novel-png-paperback",
    "novel-png-note-header": "novel-png-note-header",
    "novel-png-twitter-header": "novel-png-twitter-header",
    "novel-proofread": "novel-proofread",
    "novel-publish": "novel-publish",
    "novel-publish-horizontal": "novel-publish-horizontal",
    "novel-publish-vertical": "novel-publish-vertical",
    "novel-report": "novel-report"
  },
```

樹里「`scripts`の部分は、コマンド名と実行されるコマンドとを対比したものだ。今から順番に説明する」  
絵子「はーい」

#### 必要なツールを追加インストールする

樹里「さて、準備の仕上げとして、次のコマンドで必要なツールを追加インストールしよう」

```
npm install
```

樹里「`node_modules`ディレクトリ内に、動作に必要なパッケージ群が追加インストールされる」  
絵子「ほんとだ。サブディレクトリがたくさんできてる」  
樹里「これで環境は整った。次は……」

### 原稿を書く

絵子「ま、これが一番大事だよね。当たり前だけど」  
樹里「そうなんだが、いくつかルールがある」

* すべての原稿は、`episodes`ディレクトリ内に保存する。
* 原稿は、Markdown形式で記述し、「001.md」「002.md」…のように連番となるよう保存する。
* ルビの記法は[青空文庫注記形式](https://www.aozora.gr.jp/aozora-manual/index-input.html#markup)とする。

----

### 校正機能を使用する(`novel-proofread`)

樹里「さて、原稿は書けたか？」  
絵子「書けたよー。いやー、苦労した」  
樹里「なお、とりあえず機能を試してみたい方は、GitHubの『[恋に落ちるコード.js](https://github.com/8novels/jk-meets-js)』の
リポジトリを`git clone`で取得してみよう。ディレクトリ構成や`package.json`の記述の参考になるだろう」  
絵子「それを先に言いなさいよ」  
樹里「では、まずは校正機能を使ってみよう」

```
npm run novel-proofread
```

樹里「コマンドを入力すると、原稿を自動で校正する」  
絵子「おー、すごい」  
樹里「ちなみに、この`novel-proofread`の部分が、先程`package.json`の`scripts`の記述と対応している。つまり……」

```
"p": "novel-proofread"
```

樹里「……と書けば、`npm run p`と入力するだけで`novel-proofread`コマンドが実行されるわけだ」  
絵子「ほほう」  
樹里「では、実際にどう校正されるのか説明しよう」

#### `novel-proofread`

下記のルールに基づいて文書を修正し、上書き保存します。

* 行頭に全角スペースを挿入します。ただし、下記と一致する行を除きます。
  - 鉤括弧(「、『)で始まる行
  - Markdownの見出し記号(#)で始まる行
  - 既に全角スペースが挿入されている行
  - 空行
* 全角の感嘆符(！)、疑問符(？)のあとに全角スペースを挿入します。ただし、下記と一致する場合を除きます。
  - 直後が感嘆符(！)、疑問符(？)、鉤括弧(」、』)、半角スペースの場合
  - 既に全角スペースが挿入されている場合

つまり、

> 「樹里！貴女はなんて素敵なの！？それにひきかえ私は……」  
> 絵子の表情が曇る。

これが

> 「樹里！　貴女はなんて素敵なの！？　それにひきかえ私は……」  
> 　絵子の表情が曇る。

というように校正されます。

絵子「……何なのよこの例文」  

----

### ファイル変換機能を使用する(`novel-build`)

樹里「次は、原稿を変換して出力する機能だ」

```
npm run novel-build
```

樹里「コマンドを入力すると、`dist`ディレクトリが作成され、変換された原稿が出力される」  
絵子「おー、すごい」  
樹里「これも同じく……」

```
"b": "novel-build"
```

樹里「……と書けば、`npm run b`で`novel-build`コマンドが実行される」  
絵子「短いコマンドは正義だね」  
樹里「では、このコマンドによって、実際に何が出力されるのか説明しよう」

#### `novel-build`

下記全てのファイルを一度に出力します。

#### `novel-build-narou`

`dist/narou`ディレクトリに、小説家になろう向けの原稿をプレーンテキストで出力します。  
カクヨム・エブリスタにも対応しています。

* ルビ記法はそのまま出力します。

#### `novel-build-note`

`dist/note`ディレクトリに、note向けの原稿をプレーンテキストで出力します。  

* ルビ記法を括弧書きに変換します。

#### `novel-build-novelabo`

`dist/novelabo`ディレクトリに、ノベラボ向けの原稿をプレーンテキストで出力します。  

* 縦書き表示で見栄えがいいように、英数字を全角に変換します。
* ルビ記法はそのまま出力します。

----

### EPUB出力機能を使用する(`novel-publish`)

樹里「次は、EPUBを出力する機能だ」  
絵子「EPUBって、電子書籍のフォーマットだよね。そんなのもできるんだねー」  
樹里「それも、[電書協 EPUB 3 制作ガイド](http://ebpaj.jp/counsel/guide)に準拠したEPUBが……」

```
npm run novel-publish
```

樹里「のコマンド一つで出来上がる」  
絵子「ほえー。こりゃ便利だ」

#### `novel-publish`

下記全てのファイルを一度に出力します。

#### `novel-publish-horizontal`

`dist`ディレクトリに、横書きレイアウトのEPUBファイルを出力します。ファイル名は『(パッケージ名)-h.epub』となります。

#### `novel-publish-vertical`

`dist`ディレクトリに、縦書きレイアウトEPUBファイルを出力します。ファイル名は『(パッケージ名)-v.epub』となります。

#### 必要なファイル

樹里「EPUBファイルを作成するためには、原稿以外にいくつかのファイルを準備する必要がある」  
絵子「一冊の本を作るわけだからね。準備は大事だね」  
樹里「すべてのファイルは、プロジェクトディレクトリ直下に**epub**というディレクトリを作り、そこに保存する」  
絵子「おっけー」

**cover.jpg** (表紙画像)  
樹里「表紙に使用する画像ファイルを、`cover.jpg`というファイル名でepubディレクトリに保存する」  
絵子「ちなみに、[Amazon KDP](https://kdp.amazon.co.jp/ja_JP/help/topic/G200645690)だと、
縦2,560 x 横1,600 ピクセルというサイズが推奨されているよ」

**fmatter.md** (前付)  
樹里「書籍の前付にあたる文章をMarkdown形式で記述し、`fmatter.md`というファイル名でepubディレクトリに保存する」  
絵子「目次より前に書いてある、序文とか謝辞とかのことだね。『支えてくれた妻と娘に捧げる。』とか書いてあるやつ」  
樹里「なお、このファイルがない場合、前付部分は作成しない」

**titlepage.md** (本扉ページ)  
樹里「書籍の本扉にあたる文章をMarkdown形式で記述する」  
絵子「タイトルや著者名が書いてあるページだね」  
樹里「これも、ファイルがない場合は作成しない」

**caution.md** (注意書きページ)  
樹里「書籍の注意書きにあたる文章をMarkdown形式で記述する」  
絵子「無断転載はダメだぞ！とか」  
樹里「これも同じく、ファイルがなければ作成しない」

**colophon.md** (奥付ページ)  
樹里「書籍の奥付にあたる文章をMarkdown形式で記述する」  
絵子「最後の部分だね。出版社名とか発行日とか書いてあるページ」  
樹里「これもファイルがない場合は作成しないぞ」

#### package.jsonを編集する(`config`プロパティ)

樹里「それから、`package.json`の`config`プロパティを作成し、必要な項目を追加する必要がある」

```
  "config": {
    "epub_title": "恋に落ちるコード.js",
    "epub_title_file_as": "こいにおちるこーどどっとじぇいえす",
    "epub_author": "足羽川永都",
    "epub_author_file_as": "あすわがわえいと",
    "epub_publisher": "8novels",
    "epub_publisher_file_as": "えいとのべるず"
  },
```

絵子「こんな感じで書いてね！」

**`epub_title`**  
書籍のタイトルを記述します。

**`epub_title_file_as`**  
書籍のタイトルの読みがなを記述します。

**`epub_author`**  
著者名を記述します。

**`epub_author_file_as`**  
著者名の読みがなを記述します。

**`epub_publisher`**  
出版社名を記述します。

**`epub_publisher_file_as`**  
出版社名の読みがなを記述します。

----

### PNG出力機能を使用する(`novel-png`)

樹里「小説をPNG画像として出力する機能もあるぞ」  
絵子「どういう時に使うの？」  
樹里「例えば、Instagramなどに掌編小説を公開したい時に使う」  
絵子「あー、なるほど」

```
npm run novel-png
```

樹里「というコマンドで出力できるぞ」  

#### `novel-png`

PNG画像を出力します。高さは1,080px固定で、幅は文章の長さによって変わります。

#### `novel-png-square`

正方形のPNG画像を出力します。  
幅・高さともに1,080pxとなります。はみ出した文章は表示されません(以下同じ)。

#### `novel-png-paperback`

文庫本と同じ比率のPNG画像を出力します。  
幅が766px、高さが1,080pxとなります。

#### `novel-png-note-header`

noteのヘッダに適したPNG画像を出力します。  
幅が1,280px、高さが670pxとなります。

#### `novel-png-twitter-header`

Twitterのヘッダに適したPNG画像を出力します。  
幅が1,500px、高さが500pxとなります。

#### スタイルシートを適用する

樹里「プロジェクトディレクトリ直下に**png**というディレクトリを作り、その中に**png.css**という名前でスタイルシートを保存すれば、独自のスタイルを適用させることもできる」  
絵子「どんな風に書いたらいいのかな？」  
樹里「既定のスタイルは300文字前後の掌編を出力するのに適しているが、それより長い文章の場合は`font-size`を調整したほうが読みやすい。大体**20〜21px**くらいで1行40文字くらいになる」  
絵子「へー」  
樹里「あとは、行間(`line-height`)、文字間(`letter-spacing`)、余白(`padding`)、背景色(`background-color`)あたりかな、調整するとしたら。もちろん他にも色々調整できるぞ」  

----

### レポート機能を使用する(novel-report)

樹里「最後に、原稿を分析してレポートを出力する機能だ」  
絵子「そんな機能まで付けたんだ」

```
npm run novel-report
```

樹里「コマンドを入力すると、`report.html`ファイルに分析した内容が出力される」  
絵子「ほー」

#### `novel-report`

原稿の文字数、原稿用紙に換算した場合の枚数、台詞や地の文の割合、使用されているルビ文字の一覧などを出力します。

----

樹里「以上で説明は終了だ。わずらわしい事はすべてプログラムに任せ、執筆に集中しようじゃないか」  
絵子「よーし、やるぞー！」

## Requirement

このツールは、下記のライブラリを使用しています。

* [archiver](https://www.npmjs.com/package/archiver)
  - EPUB作成時のZIP圧縮
* [fs-extra](https://www.npmjs.com/package/fs-extra)
  - ファイル読み書き
* [jp-wrap](https://www.npmjs.com/package/jp-wrap)
  - 原稿用紙換算での文字数計算
* [markdown-it](https://www.npmjs.com/package/markdown-it)
  - MarkdownをHTMLに変換
* [mustache](https://www.npmjs.com/package/mustache)
  - レポート用HTMLを出力
* [puppeteer](https://www.npmjs.com/package/puppeteer)
  - キャプチャ画像を出力

## Todo

- [ ] 対応する形式を増やす(ハーメルン、アルファポリス、etc)
- [x] EPUB変換時に全角スペースが消失する問題の対応
- [x] 自動フォーマット機能(全角インデント挿入等)の実装
- [x] 画像出力機能の実装
- [ ] READMEに「`package.json`に記述するライセンス表記について」を追記
- [ ] READMEに「.gitignoreの書き方」を追記
- [ ] READMEにmarkdown-itのオプション指定方法を追記
- [ ] 縦書き原稿への変換時、数字を漢数字や縦中横に変換できるオプションを追加

## Author

[8amjp](https://github.com/8amjp)

このツールは Xubuntu 18.04 上で Visual Studio Code で開発しています。
