'use strict';
const PngGenerator = require('../PngGenerator.js');

module.exports = class NoteHeader extends PngGenerator {

    constructor (contents) {
        super(contents);
        this.type = 'note-header';
        this.tempDir = 'tmp/png/note-header';
        this.viewport = {
            width: 1280,
            height: 670
        };
        this.options = {
            fullPage: false
        };
    }

};