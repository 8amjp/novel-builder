'use strict';
const fs = require('fs-extra');
const path = require('path');
const episodesDir = 'episodes';

module.exports = class Proofreader {

    constructor (contents) {
        this.contents = contents;
    }

    proofread () {
        return Promise.all( this.contents.map( (content) =>{
            return Promise.resolve({
                name: content.name,     // ファイル名
                data: this.convert(content.data)    // すべてのテキスト
            })
        }))
        .then( (newContents) => {
            this.output(newContents)
        })
        .then( () => {
            return Promise.resolve()
        })
        .catch( (err) => {
            console.dir(err)
        });
    }

    // テキスト変換
    convert (str){
        return str
        // 全角の感嘆符(！)、疑問符(？)のあとに全角スペースを挿入
        // - 直後が感嘆符(！)、疑問符(？)、鉤括弧(」、』)、半角スペースの場合、既に全角スペースが挿入されている場合を除く
        .replace(/([？！](?![\s？！」』]))/mg, '$1　')
        // 行頭に全角スペースを挿入
        // - 鉤括弧(「、『)・Markdownの見出し記号(#)で始まる行、既に全角スペースが挿入されている行、空行を除く
        .replace(/^(?![「『#\s])(.*)$/mg, '　$1')
    }

    // 出力
    output(contents) {
        return Promise.all(contents.map( (content) => {
            return fs.outputFile(
                path.join(episodesDir, content.name),
                content.data
            )
        }))
    }
};