'use strict';
const Publisher = require('./Publisher.js');

module.exports = class Note extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'note';
    }

    convert (str){
        return str
        // 行末の空白を除去
        .replace(/  $/mg, '')
        // 見出し行のマークを除去
        .replace(/^#* /mg, '')
        // ルビを括弧書きに
        .replace(/｜([^《]+?)《(.+?)》/g, '$1（$2）')
        .replace(/([一-龠々ヶ]+)《(.+?)》/g, '$1（$2）')
    }
};