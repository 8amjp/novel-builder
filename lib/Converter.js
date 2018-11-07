'use strict';
const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    breaks: true,
});

module.exports = class Converter {

    constructor () {
    }

    // 英数字を全角に
    static widen(str) {
        return Promise.resolve(
            str
            .replace(/([0-9A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
        )
    }

    // markdownをHTMLに変換
    static md2HTML(str) {
        return Promise.resolve(
            md.render(str)
        )
    }

    // markdownをプレーンテキストに変換
    static md2Text(str) {
        return Promise.resolve(
            str
            .replace(/  $/mg, '')   // 行末の空白を除去
            .replace(/^#* /mg, '')  // 見出し行のマークを除去
        )
    }

    // 行頭の全角スペースをアンダーバーに置換(markdown-it対応)
    static escapeIndent(str) {
        return Promise.resolve(
            str.replace(/^　/mg, '＿')
        )
    }

    // アンダーバーを全角スペースに置換(markdown-it対応)
    static unescapeIndent(str) {
        return Promise.resolve(
            str.replace(/＿/g, '　')
        )
    }

    // ルビをHTMLに変換
    static ruby2HTML(str) {
        return Promise.resolve(
            str
            .replace(/｜([^《]+?)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
        )
    }

    // ルビを括弧書きに変換
    static ruby2Parentheses(str) {
        return Promise.resolve(
            str
            .replace(/｜([^《]+?)《(.+?)》/g, '$1（$2）')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '$1（$2）')
        )
    }

};