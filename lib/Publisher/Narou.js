'use strict';
const Publisher = require('../Publisher.js');
const Converter = require('../Converter.js');

module.exports = class Narou extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'narou';
    }

    convert (str){
        return new Promise( (resolve) => {
            Converter.md2Text(str)
            .then( str => resolve(str) )
        })
    }
};