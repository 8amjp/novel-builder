'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');
const md = require('markdown-it')({
    html: true,
    xhtmlOut: true,
    breaks: true,
});
const Publisher = require('./Publisher.js');
const Converter = require('./Converter.js');
const templatePath = '../templates/png/png.xhtml';
const customCssPath = 'png/png.css';

module.exports = class PngGenerator extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'png';
        this.distExt = '.png';
        this.viewport = {
            width: 1,
            height: 1080
        };
        this.options = {
            fullPage: true
        };
    }

    convert (str){
        return new Promise( (resolve) => {
            Converter.convertAlphabet(str, this.params.alphabet || 'full')
            .then( str => Converter.convertNumber(str, this.params.number || 'full') )
            .then( str => Converter.convertRuby(str, this.params.ruby || 'html') )
            .then( str => Converter.convertEmphasis(str, this.params.emphasis || 'sesame') )
            .then( str => Converter.escapeIndent(str) )
            .then( str => Converter.md2HTML(str) )
            .then( str => Converter.unescapeIndent(str) )
            .then( str => Converter.convertSymbol(str, this.params.symbol) )
            .then( str => resolve(str) )
        })
    }

    output(contents) {
        return fs.emptyDir( path.join(this.distDir, this.type ) )
        .then( () => {
            return Promise.all([
                new Promise( (resolve, reject) => {
                    fs.readFile(path.join( __dirname, templatePath ), 'utf8', (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    })
                }),
                new Promise( (resolve) => {
                    fs.readFile(customCssPath, 'utf8', (err, data) => {
                        if (err) resolve('');
                        resolve(data);
                    })
                })
            ])
        })
        .then( ([template, css]) => {
            return Promise.all( contents.map( (content) => {
                return this.generate({
                    id: path.basename(content.name, this.srcExt),
                    data: mustache.render( template, content ),
                    css: { content: css }
                })
            }))
        })
        .then( () => Promise.resolve() )
        .catch( (err) => Promise.reject(err) );
    }

    // 画像変換
    async generate(content) {
        return puppeteer.launch()
        .then(async browser => {
            const page = await browser.newPage();
            await page.setContent(content.data);
            await page.setViewport(this.viewport);
            await page.addStyleTag(content.css)
            await page.screenshot(
                Object.assign( {}, this.options , { path: path.join(this.distDir, this.type, `${content.id}${this.distExt}`) })
            );
            await browser.close();
        })
    }

};