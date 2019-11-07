'use strict';
const Publisher = require('../Publisher.js');
const Converter = require('../Converter.js');

module.exports = class Alphapolis extends Publisher {
    constructor(contents) {
        super(contents);
        this.type = 'alphapolis';
    }

    convert(str) {
        return new Promise(resolve => {
            Converter.md2Text(str)
                .then(str =>
                    Converter.convertAlphabet(str, this.params.alphabet)
                )
                .then(str => Converter.convertNumber(str, this.params.number))
                .then(str =>
                    Converter.convertEmphasis(
                        str,
                        this.params.emphasis || 'none'
                    )
                )
                .then(str =>
                    Converter.convertRuby(str, this.params.ruby || 'alphapolis')
                )
                .then(str => Converter.convertSymbol(str, this.params.symbol))
                .then(str => resolve(str));
        });
    }
};
