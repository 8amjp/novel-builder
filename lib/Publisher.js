'use strict';
const fs = require('fs-extra');
const path = require('path');

module.exports = class Publisher {
    constructor(contents) {
        this.contents = contents;
        this.type = '';
        this.distDir = 'dist';
        this.srcExt = '.md';
        this.distExt = '.txt';
        let argv = process.argv.join(' ');
        this.params = {
            ruby: /ruby=\w+/.test(argv)
                ? argv.replace(/.*ruby=(\w+).*/, '$1')
                : null,
            emphasis: /emphasis=\w+/.test(argv)
                ? argv.replace(/.*emphasis=(\w+).*/, '$1')
                : null,
            alphabet: /alphabet=\w+/.test(argv)
                ? argv.replace(/.*alphabet=(\w+).*/, '$1')
                : null,
            number: /number=\w+/.test(argv)
                ? argv.replace(/.*number=(\w+).*/, '$1')
                : null,
            symbol: /symbol=\W+/.test(argv)
                ? argv.replace(/.*symbol=(\W+).*/, '$1')
                : null,
        };
    }

    publish() {
        return Promise.all(
            this.contents.map(content =>
                this.convert(content.data).then(data =>
                    Promise.resolve(Object.assign({}, content, { data: data }))
                )
            )
        )
            .then(newContents => this.output(newContents))
            .then(() => Promise.resolve())
            .catch(err => Promise.reject(err));
    }

    // 出力先ディレクトリを作成
    initDistDir() {
        return fs.ensureDir(this.distDir);
    }

    // テキスト変換
    convert(str) {
        return Promise.resolve(str);
    }

    // 出力
    output(contents) {
        return Promise.all(
            contents.map(content => {
                return fs.outputFile(
                    path.join(
                        this.distDir,
                        this.type,
                        `${path.basename(content.name, this.srcExt)}${
                            this.distExt
                        }`
                    ),
                    content.data
                );
            })
        );
    }
};
