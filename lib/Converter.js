'use strict';
const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    breaks: true,
});
const kansuji = require("kansuji");
const patterns = {
    alphabet: /([A-Za-z&,.])/g,
    ruby1: /｜([^《]+?)《(.+?)》/g,
    ruby2: /([一-龠々ヶ]+)《(.+?)》/g,
    emphasis: /(\*\*|__)([^\*_]+?)(\*\*|__)/g
}

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
            case 'alphapolis':
                return this.ruby2Alphapolis(str);
            case 'hameln':
                return this.ruby2Hameln(str);
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
            .replace(patterns.ruby1, '<ruby>$1<rt>$2</rt></ruby>')
            .replace(patterns.ruby2, '<ruby>$1<rt>$2</rt></ruby>')
        )
    }

    // ルビを括弧書きに変換
    static ruby2Parentheses(str) {
        return Promise.resolve(
            str
            .replace(patterns.ruby1, '$1（$2）')
            .replace(patterns.ruby2, '$1（$2）')
        )
    }

    // ルビをアルファポリス書式に変換
    static ruby2Alphapolis(str) {
        return Promise.resolve(
            str
            .replace(patterns.ruby1, '#$1__$2__#')
            .replace(patterns.ruby2, '#$1__$2__#')
        )
    }

    // ルビをハーメルン書式に変換
    static ruby2Hameln(str) {
        return Promise.resolve(
            str
            .replace(patterns.ruby1, '|$1《$2》')
            .replace(patterns.ruby2, '|$1《$2》')
            .replace(/\|{2}/g, '|')
        )
    }

    // ルビを除去
    static removeRuby(str) {
        return Promise.resolve(
            str
            .replace(patterns.ruby1, '$1')
            .replace(patterns.ruby2, '$1')
        )
    }

    //
    // 傍点関連
    //

    // 傍点を変換
    static convertEmphasis(str, param = null) {
        switch (param) {
            case 'bracket':
                return this.emphasis2Bracket(str);
            case 'sesame':
                return this.emphasis2HTML(str, 'em-sesame');
            case 'none':
                return this.removeEmphasis(str);
            default:
                return Promise.resolve(str);
        }
    }

    // 傍点を二重山括弧に変換
    static emphasis2Bracket(str) {
        return Promise.resolve(
            str.replace(patterns.emphasis, '《《$2》》')
        )
    }

    // 傍点をHTMLに変換
    static emphasis2HTML(str, style = 'em-sesame') {
        return Promise.resolve(
            str.replace(patterns.emphasis, (match, p1, p2, p3) => `<span class="${style}">${p2}</span>`)
        )
    }

    // 傍点を除去
    static removeEmphasis(str) {
        return Promise.resolve(
            str.replace(patterns.emphasis, '$2')
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
            str.replace(patterns.alphabet, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
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
    static convertSymbol(str, param = null) {
        return Promise.resolve(
            param ? str.replace(new RegExp(`[${param}]`, 'g'), match => String.fromCharCode(match.charCodeAt(0) + 65248)) : str
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