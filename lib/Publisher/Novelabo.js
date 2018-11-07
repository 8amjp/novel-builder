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
            .then( str => Converter.widen(str) )
            .then( str => resolve(str) )
        })
    }
};