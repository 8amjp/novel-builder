'use strict';
const Epub = require('./Epub.js')
const Converter = require('../Converter.js');

module.exports = class VerticalEpub extends Epub {

    constructor (contents) {
        super(contents);
        this.distfilename = `${process.env.npm_package_name}-v.epub`;
        this.tempDir = 'tmp/epub/vertical';
        this.direction = 'rtl'; // rtl or ltr
        this.mode = 'vrtl'; // vrtl or hltr
        let argv = process.argv;
        this.numberStyle = argv.includes('tcy') ? 'tcy' : argv.includes('kan') ? 'kan' : null;
    }

    convert (str){
        return new Promise( (resolve) => {
            Converter.widenAlphabet(str)
            .then( str => Converter.convertNumber(str, this.numberStyle) )
            .then( str => Converter.ruby2HTML(str) )
            .then( str => Converter.escapeIndent(str) )
            .then( str => Converter.md2HTML(str) )
            .then( str => Converter.unescapeIndent(str) )
            .then( str => resolve(str) )
        })
    }

    convertTitle(str) {
        return str.replace(/([0-9A-Za-z&,.])/g, (match, p1) =>  String.fromCharCode(p1.charCodeAt(0) + 65248));
    }

};