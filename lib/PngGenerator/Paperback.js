'use strict';
const PngGenerator = require('../PngGenerator.js');

module.exports = class Paperback extends PngGenerator {

    constructor (contents) {
        super(contents);
        this.type = 'paperback';
        this.tempDir = 'tmp/png/paperback';
        this.viewport = {
            width: 766,
            height: 1080
        };
        this.options = {
            fullPage: false
        };
    }

};