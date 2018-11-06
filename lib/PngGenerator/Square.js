'use strict';
const PngGenerator = require('../PngGenerator.js');

module.exports = class Square extends PngGenerator {

    constructor (contents) {
        super(contents);
        this.viewport = {
            width: 1080,
            height: 1080
        };
        this.options = {
            fullPage: false
        };
    }

};