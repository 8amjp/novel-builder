'use strict';
const Publisher = require('./Publisher.js');

module.exports = class Novelabo extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'novelabo';
    }

    convert (str){
        return str
        // 行末の空白を除去
        .replace(/  $/mg, '')
        // 見出し行のマークを除去
        .replace(/^#* /mg, '')
        // 英数字を全角に
        .replace(/([A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248))
    }
};