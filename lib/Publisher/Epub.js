'use strict';
const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');
const archiver = require('archiver');
const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    breaks: true,
});
const Publisher = require('../Publisher.js')
const templatesDir = '../../templates/epub';

module.exports = class Epub extends Publisher {

    constructor (contents) {
        super(contents);
        this.distfilename = `${process.env.npm_package_name}-h.epub`;
        this.tempDir = 'tmp/epub/horizontal';
        this.direction = 'ltr'; // rtl or ltr
        this.mode = 'hltr'; // vrtl or hltr
    }

    convert (str){
        return md.render(
            str
            // ルビ変換
            .replace(/｜([^《]+?)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            // 全角インデントが消える問題の対応
            .replace(/^　/mg, '＿')
        )
        // 全角インデントが消える問題の対応
        .replace(/＿/g, '　');
    }

    output(contents) {
        fs.emptyDir( this.tempDir )
        .then( () => {
            return Promise.all([
                this.outputContents(contents),
                this.outputToc(contents),
                this.outputCover(),
                this.outputPage('fmatter'),     // 前付
                this.outputPage('titlepage'),   // 本扉
                this.outputPage('caution'),     // 注意書き
                this.outputPage('colophon'),    // 奥付
            ])
        })
        .then( (results) => this.outputOpf(contents, results) )
        .then( () => this.archive() )
        .then( () => Promise.resolve() )
        .catch( (err) => Promise.reject(err) );
    }

    archive() {
        return new Promise( (resolve, reject) => {
            var output = fs.createWriteStream( path.join( this.distDir, this.distfilename ) );
            var archive = archiver('zip', { zlib: { level: 9 } });
            output.on('close', function() {
                resolve();
            });
            archive.on('error', function(err) {
                reject(err);
            });
            archive.append('application/epub+zip', { name: 'mimetype', store: true });
            archive.directory(path.join( __dirname, templatesDir, 'META-INF' ), 'META-INF');
            archive.directory(path.join( __dirname, templatesDir, 'item/style' ), 'item/style');
            archive.directory(path.join( this.tempDir, 'item/xhtml' ), 'item/xhtml');
            archive.file(path.join( this.tempDir, 'item/standard.opf' ), { name: 'item/standard.opf' });
            archive.file(path.join( __dirname, templatesDir, 'item/navigation-documents.xhtml' ), { name: 'item/navigation-documents.xhtml' });
            archive.file('epub/cover.jpg', { name: 'item/image/cover.jpg' });
            archive.pipe(output);
            archive.finalize();
        })
    }

    // 本文ページ
    outputContents(contents) {
        let file = 'item/xhtml/p-text.xhtml';
        return new Promise( (resolve, reject) => {
            fs.readFile(path.join( __dirname, templatesDir, file ), 'utf8', (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
        .then( (template) => {
            Promise.all( contents.map( (content) => {
                content.mode = this.mode; // vrtl or hltr
                let id = path.basename(content.name, this.srcExt);
                let h1 = `<h1 class="oo-midashi" id="toc-${id}">`;
                content.data = content.data.replace(/\<h1\>/g, h1);
                fs.outputFile(
                    path.join( this.tempDir, `item/xhtml/p-${id}.xhtml` ),
                    mustache.render( template, content )
                )
            }))
        })
        .catch( err => reject(err) );
    }

    // 目次
    outputToc(contents) {
        let file = 'item/xhtml/p-toc.xhtml';
        return new Promise( (resolve, reject) => {
            fs.readFile(path.join( __dirname, templatesDir, file ), 'utf8', (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
        .then( (data) => {
            let view = {
                content: contents.map( (content) => {
                    return {
                        id: path.basename(content.name, this.srcExt),
                        title: content.title
                    }
                }),
                mode: this.mode // vrtl or hltr
            }
            return fs.outputFile( path.join( this.tempDir, file ), mustache.render( data, view ) )
        } )
        .catch( (err) => Promise.reject(err) );
    }

    // カバーページ
    outputCover() {
        let file = 'item/xhtml/p-cover.xhtml';
        return new Promise( (resolve, reject) => {
            fs.readFile(path.join( __dirname, templatesDir, file ), 'utf8', (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
        .then( (data) => {
            let view = {
                title: process.env.npm_package_config_epub_title || process.env.npm_package_name,
            }
           return fs.outputFile( path.join( this.tempDir, file ), mustache.render( data, view ) )
        })
        .catch( (err) => Promise.reject(err) );
    }

    // 本文・目次・カバー以外のページ
    outputPage(type) {
        let file = `item/xhtml/p-${type}.xhtml`;
        return Promise.all([
            new Promise( (resolve, reject) => {
                fs.readFile(path.join( __dirname, templatesDir, file ), 'utf8', (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                })
            }),
            new Promise( (resolve, reject) => {
                fs.readFile(path.join( 'epub', `${type}.md` ), 'utf8', (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                })
            })
        ])
        .then( ([template, content]) => {
            let view = {
                content: md.render(content),
                title: process.env.npm_package_config_epub_title || process.env.npm_package_name,
                author: process.env.npm_package_config_epub_author || process.env.npm_package_author,
                mode: this.mode // vrtl or hltr
            }
            return fs.outputFile( path.join( this.tempDir, file ), mustache.render( template, view ) )
        } )
        .then( () => Promise.resolve(true) )
        .catch( (err) => Promise.resolve(false) );
    }

    // OPF
    outputOpf(contents, results) {
        let file = 'item/standard.opf';
        return new Promise( (resolve, reject) => {
            fs.readFile(path.join( __dirname, templatesDir, file ), 'utf8', (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
        .then( (data) => {
            let view = {
                content: contents.map( (content) => {
                    return { id: path.basename(content.name, this.srcExt) }
                }),
                direction: this.direction,
                title: process.env.npm_package_config_epub_title || process.env.npm_package_name,
                titleFileAs: process.env.npm_package_config_epub_title_file_as || '',
                author: process.env.npm_package_config_epub_author || process.env.npm_package_author,
                authorFileAs: process.env.npm_package_config_epub_author_file_as || '',
                publisher: process.env.npm_package_config_epub_publisher || '',
                publisherFileAs: process.env.npm_package_config_epub_publisher_file_as || '',
                identifier: process.env.npm_package_repository_url || process.env.npm_package_homepage,
                modified: new Date().toISOString(),
                fmatter: results[3],     // 前付
                titlepage: results[4],   // 本扉
                caution: results[5],     // 注意書き
                colophon: results[6],    // 奥付
            }
            return fs.outputFile( path.join( this.tempDir, file ), mustache.render( data, view ) )
        } )
        .catch( (err) => Promise.reject(err) );
    }
    
};