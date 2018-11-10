'use strict';
const Publisher = require('../Publisher.js');
const Converter = require('../Converter.js');

module.exports = class Novelabo extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'novelabo';
    }

    convert (str){
        return new Promise( (resolve) => {
            Converter.md2Text(str)
            .then( str => Converter.convertAlphabet(str, this.params.alphabet || 'full') )
            .then( str => Converter.convertNumber(str, this.params.number || 'full') )
            .then( str => Converter.convertRuby(str, this.params.ruby) )
            .then( str => Converter.convertSymbol(str, this.params.symbol) )
            .then( str => resolve(str) )
        })
    }
};