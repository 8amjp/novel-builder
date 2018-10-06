'use strict';
const fs = require('fs-extra');
const path = require('path');

module.exports = class Publisher {

    constructor (contents) {
        this.contents = contents;
        this.type = '';
        this.distDir = 'dist';
        this.srcExt = '.md';
        this.distExt = '.txt';
    }

    publish () {
        return Promise.all( this.contents.map( (content) =>{
            return Promise.resolve({
                name: content.name,     // ファイル名
                title: this.getTitle(content.data),  // タイトル
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

    // 出力先ディレクトリを作成
    initDistDir() {
        return fs.remove(this.distDir)
    }

    // テキスト変換
    convert (str){
        return str;
    }

    // タイトル(#で始まる最初の行)を取得
    getTitle (str){
        return new RegExp(/^#.*/, 'm').exec(str)[0].replace(/^#* /, '');
    }

    // 出力
    output(contents) {
        return Promise.all( contents.map( (content) => {
            return fs.outputFile(
                path.join(this.distDir, this.type, `${path.basename(content.name, this.srcExt)}${this.distExt}`),
                content.data
            )
        }))
    }
};