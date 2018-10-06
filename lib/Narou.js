'use strict';
const Publisher = require('./Publisher.js');

module.exports = class Narou extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'narou';
    }

    convert (str){
        return str
        // 行末の空白を除去
        .replace(/  $/mg, '')
        // 見出し行のマークを除去
        .replace(/^#* /mg, '')
    }
};