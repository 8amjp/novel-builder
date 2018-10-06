'use strict';
const fs = require('fs-extra');
const path = require('path');
const Publisher = require('./Publisher.js')
const EpubGenerator = require('epub-gen')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt();
md.set({
    html: true, 
    breaks: true, 
});

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
        fs.ensureDir( path.join( this.distDir, this.type ) )
        .then( () => {
            new EpubGenerator({
                content: contents,
                cover: path.resolve('./cover.jpeg'),
                output: path.join( this.distDir, this.type, `${process.env.npm_package_name}${this.distExt}` ),
                title: process.env.npm_package_config_epub_title || '',
                author: process.env.npm_package_config_epub_author || '',
                publisher: process.env.npm_package_config_epub_publisher || '',
                lang: process.env.npm_package_config_epub_lang || '',
                tocTitle: process.env.npm_package_config_epub_tocTitle || '',
                appendChapterTitles: process.env.npm_package_config_epub_appendChapterTitles || ''
            });
        })
    }
};