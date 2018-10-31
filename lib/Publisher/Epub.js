'use strict';
const fs = require('fs-extra');
const path = require('path');
const EpubGenerator = require('epub-gen')
const MarkdownIt = require('markdown-it')
const Publisher = require('../Publisher.js')
const md = new MarkdownIt();
md.set({
    html: true, 
    breaks: true, 
});
const cssPath = 'epub.css';

module.exports = class Epub extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'epub';
        this.distExt = '.epub';
    }

    convert (str){
        return md.render(
            str
            .replace(/｜([^《]+?)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
        );
    }

    output(contents) {
        return this.getCSS()
        .then( (css) => {
            let option = {
                content: contents,
                cover: path.resolve('./cover.jpeg'),
                output: path.join( this.distDir, `${process.env.npm_package_name}${this.distExt}` ),

                title: process.env.npm_package_config_epub_title || process.env.npm_package_name,
                author: process.env.npm_package_config_epub_author || process.env.npm_package_author,
                publisher: process.env.npm_package_config_epub_publisher || null,
                css: css || process.env.npm_package_config_epub_css || null,
                lang: process.env.npm_package_config_epub_lang || 'ja',
                tocTitle: process.env.npm_package_config_epub_tocTitle || '目次',
                appendChapterTitles: !(process.env.npm_package_config_epub_appendChapterTitles == 'false')
            }
            return new EpubGenerator(option).promise;
        })
    }

    // スタイルシート読み込み
    getCSS() {
        return new Promise( (resolve, reject) => {
            fs.readFile(cssPath, 'utf8', (err, data) => {
                if (err) resolve(null);
                resolve(data);
            })
        })
    }

};