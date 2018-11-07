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
        return Promise.all( this.contents.map( (content) =>
            this.convert(content.data)
            .then((data) => Promise.resolve(Object.assign( {}, content, {data: data})))
        ))
        .then( (newContents) => this.output(newContents) )
        .then( () => Promise.resolve() )
        .catch( (err) => Promise.reject(err) );
    }

    // 出力先ディレクトリを作成
    initDistDir() {
        return fs.ensureDir(this.distDir)
    }

    // テキスト変換
    convert (str){
        return Promise.resolve(str);
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