'use strict';
const PngGenerator = require('../PngGenerator.js');

module.exports = class TwitterHeader extends PngGenerator {
    constructor(contents) {
        super(contents);
        this.viewport = {
            width: 1500,
            height: 500,
        };
        this.options = {
            fullPage: false,
        };
    }
};
