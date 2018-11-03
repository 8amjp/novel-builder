'use strict';
const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    breaks: true,
});
const Epub = require('./Epub.js')

module.exports = class VerticalEpub extends Epub {

    constructor (contents) {
        super(contents);
        this.distfilename = `${process.env.npm_package_name}-v.epub`;
        this.tempDir = 'tmp/epub/vertical';
        this.direction = 'rtl'; // rtl or ltr
        this.mode = 'vrtl'; // vrtl or hltr
    }

    convert (str){
        return md.render(
            str
            // 英数字を全角に
            .replace(/([0-9A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
            // ルビ変換
            .replace(/｜([^《]+?)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            // 全角インデントが消える問題の対応
            .replace(/^　/mg, '＿')
        )
        // 全角インデントが消える問題の対応
        .replace(/＿/g, '　');
    }

    // タイトル(#で始まる最初の行)を取得
    getTitle (str){
        return new RegExp(/^#.*/, 'm').exec(str)[0].replace(/^#* /, '').replace(/([0-9A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248));
    }

};