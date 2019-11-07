'use strict';
const Epub = require('./Epub.js');
const Converter = require('../Converter.js');

module.exports = class VerticalEpub extends Epub {
    constructor(contents) {
        super(contents);
        this.distfilename = `${process.env.npm_package_name}-v.epub`;
        this.tempDir = 'tmp/epub/vertical';
        this.direction = 'rtl'; // rtl or ltr
        this.mode = 'vrtl'; // vrtl or hltr
    }

    convert(str) {
        return new Promise(resolve => {
            Converter.convertAlphabet(str, this.params.alphabet || 'full')
                .then(str =>
                    Converter.convertNumber(str, this.params.number || 'full')
                )
                .then(str =>
                    Converter.convertEmphasis(
                        str,
                        this.params.emphasis || 'sesame'
                    )
                )
                .then(str =>
                    Converter.convertRuby(str, this.params.ruby || 'html')
                )
                .then(str => Converter.escapeIndent(str))
                .then(str => Converter.md2HTML(str))
                .then(str => Converter.unescapeIndent(str))
                .then(str => Converter.convertSymbol(str, this.params.symbol))
                .then(str => resolve(str));
        });
    }

    convertTitle(str) {
        return str.replace(/([0-9A-Za-z&,.])/g, (match, p1) =>
            String.fromCharCode(p1.charCodeAt(0) + 65248)
        );
    }
};
