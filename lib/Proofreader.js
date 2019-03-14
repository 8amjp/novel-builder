'use strict';
const fs = require('fs-extra');
const path = require('path');
const episodesDir = process.env.npm_package_config_episodes_dir || 'episodes';

module.exports = class Proofreader {

    constructor (contents) {
        this.contents = contents;
    }

    proofread () {
        return Promise.all( this.contents.map( (content) => 
            this.convert(content.data)
            .then((data) => Promise.resolve(Object.assign( {}, content, {data: data})))
        ))
        .then( (newContents) => this.output(newContents))
        .then( () => Promise.resolve() )
        .catch( (err) => Promise.reject(err) );
    }

    // テキスト変換
    convert (str){
        return Promise.resolve(
            str
            // 閉じ鉤括弧直前の全角スペースおよび句読点を削除
            .replace(/[　、。]([」』])/mg, '$1')
            // 全角の感嘆符(！)、疑問符(？)のあとに全角スペースを挿入
            // - 直後が感嘆符(！)、疑問符(？)、鉤括弧(」』)、半角スペースの場合、既に全角スペースが挿入されている場合を除く
            .replace(/([？！](?![\s？！」』]))/mg, '$1　')
            // 行頭に全角スペースを挿入
            // - 鉤括弧(「、『)・Markdownの見出し記号(#)で始まる行、既に全角スペースが挿入されている行、空行を除く
            .replace(/^(?![「『#\s])(.*)$/mg, '　$1')
            // 三点リーダー（…）の連続回数が奇数の場合もう一つ追加
            .replace(/(…+)/g, match => (match.length % 2 == 0) ? match : match + '…')
            // ダッシュ（―）の連続回数が奇数の場合もう一つ追加
            .replace(/(―+)/g, match => (match.length % 2 == 0) ? match : match + '―')
            // 鉤括弧の開きと閉じが異なる場合、開きの鉤括弧に統一
            .replace(/「(.*)』/mg, '「$1」')
            .replace(/『(.*)」/mg, '『$1』')
        );
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