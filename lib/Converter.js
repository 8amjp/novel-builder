'use strict';
const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    breaks: true,
});
const kansuji = require("kansuji");

module.exports = class Converter {

    constructor () {
    }

    // 半角数字を変換
    static convertNumber(str, param = null) {
        if (param == 'tcy'){
            return this.numberToTcy(str);
        } else if (param == 'kan'){
            return this.numberstring(str);
        } else {
            return this.widenNumber(str);
        }
    }

    // 半角英数字を全角英数字に変換
    static widen(str) {
        return Promise.resolve(
            str
            .replace(/([0-9A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
        )
    }

    // 半角英字を全角英字に変換
    static widenAlphabet(str) {
        return Promise.resolve(
            str
            .replace(/([A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
        )
    }

    // 半角数字を全角数字に変換
    static widenNumber(str) {
        return Promise.resolve(
            str
            .replace(/([0-9])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
        )
    }

    // 半角記号を全角記号に変換
    static widenPunctuation(str) {
        return Promise.resolve(
            str
            .replace(/([!?])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
        )
    }
    
    // 3桁までの数字は縦中横、それ以上は全角数字に変換
    static numberToTcy(str) {
        return Promise.resolve(
            str
            .replace(/(\D)(\d{1,3})(\D)/g, '$1<span class="tcy">$2</span>$3')
            .replace(/(\d{4,})/g, (match, p1) => p1.split("").map( n => String.fromCharCode(n.charCodeAt(0) + 65248)).join('') )
        )
    }

    // 半角数字を漢数字に変換
    static numberstring(str) {
        return Promise.resolve(
            str
            .replace(/(\d+)/g, (match, p1) =>  kansuji(p1))
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