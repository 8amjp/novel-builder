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

    //
    // ルビ関連
    //

    // ルビを変換
    static convertRuby(str, param = null) {
        switch (param) {
            case 'html':
                return this.ruby2HTML(str);
            case 'paren':
                return this.ruby2Parentheses(str);
            case 'none':
                return this.removeRuby(str);
            default:
                return Promise.resolve(str);
        }
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

    // ルビを除去
    static removeRuby(str) {
        return Promise.resolve(
            str
            .replace(/｜([^《]+?)《(.+?)》/g, '$1')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '$1')
        )
    }

    //
    // 英字関連
    //

    // 半角英字を変換
    static convertAlphabet(str, param = null) {
        switch (param) {
            case 'full':
                return this.widenAlphabet(str);
            default:
                return Promise.resolve(str);
        }
    }

    // 半角英字を全角英字に変換
    static widenAlphabet(str) {
        return Promise.resolve(
            str.replace(/([A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
        )
    }

    //
    // 数字関連
    //

    // 半角数字を変換
    static convertNumber(str, param = null) {
        switch (param) {
            case 'tcy':
                return this.numberToTcy(str);
            case 'kan':
                return this.numberstring(str);
            case 'full':
                return this.widenNumber(str);
            default:
                return Promise.resolve(str);
        }
    }

    // 3桁までの数字は縦中横、それ以上は全角数字に変換
    static numberToTcy(str) {
        return Promise.resolve(
            str.replace(/(\D)(\d{1,3})(\D)/g, '$1<span class="tcy">$2</span>$3')
        )
        .then( (str) => this.widenNumber(str, /(\d{4,})/g) )

    }

    // 半角数字を漢数字に変換
    static numberstring(str) {
        return Promise.resolve(
            str.replace(/(\d+)/g, (match, p1) =>  kansuji(p1))
        )
    }

    // 半角数字を全角数字に変換
    static widenNumber(str, pattern = /(\d+)/g) {
        return Promise.resolve(
            str.replace(pattern, (match, p1) => p1.split('').map( n => String.fromCharCode(n.charCodeAt(0) + 65248)).join(''))
        )
    }

    //
    // 記号関連
    //

    // 指定されたすべての半角記号（非単語構成文字）を全角に変換
    static convertSymbol(str, param) {
        return Promise.resolve(
            str.replace(new RegExp(`[${param}]`, 'g'), match => String.fromCharCode(match.charCodeAt(0) + 65248))
        )
    }

    //
    // markdown関連
    //

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

};