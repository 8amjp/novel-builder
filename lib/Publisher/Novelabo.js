'use strict';
const Publisher = require('../Publisher.js');
const Converter = require('../Converter.js');

module.exports = class Novelabo extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'novelabo';
        let argv = process.argv;
        this.numberStyle = argv.includes('tcy') ? 'tcy' : argv.includes('kan') ? 'kan' : null;
    }

    convert (str){
        return new Promise( (resolve) => {
            Converter.md2Text(str)
            .then( str => Converter.widenAlphabet(str) )
            .then( str => Converter.convertNumber(str, this.numberStyle) )
            .then( str => resolve(str) )
        })
    }
};