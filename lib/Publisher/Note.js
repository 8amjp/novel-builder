'use strict';
const Publisher = require('../Publisher.js');
const Converter = require('../Converter.js');

module.exports = class Note extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'note';
    }

    convert (str){
        return new Promise( (resolve) => {
            Converter.md2Text(str)
            .then( str => Converter.ruby2Parentheses(str) )
            .then( str => resolve(str) )
        })
    }
};