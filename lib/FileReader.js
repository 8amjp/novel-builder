'use strict';
const fs = require('fs-extra');
const path = require('path');
const episodesDir = 'episodes';

module.exports = class FileReader {

    constructor () {
    }

    read() {
        return this.getEpisodes()
        .then( (episodes) => {
            return this.getContents(episodes);
        })
    }

    // ファイル一覧を取得
    getEpisodes() {
        return new Promise( (resolve) => {
            fs.readdir(episodesDir, (err, files) => {
                if (err) reject(err);
                resolve(files);
            })
        })
    }

    // すべてのファイルを読み込み
    getContents(episodes) {
        return Promise.all( episodes.map( (name) => {
            return this.getContent(name)
        }))
    }

    // ファイル読み込み
    getContent(name) {
        return new Promise( (resolve, reject) => {
            fs.readFile(path.join(episodesDir, name), 'utf8', (err, data) => {
                if (err) reject(err);
                resolve({
                    name: name, // ファイル名
                    title: new RegExp(/^#.*/, 'm').exec(data)[0].replace(/^#* /, ''),  // タイトル(最初の見出し行)
                    data: data  // すべてのテキスト
                });
            })
        })
    }

};