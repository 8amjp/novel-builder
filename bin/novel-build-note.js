#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Note = require('../lib/Publisher/Note.js');

new Publisher().initDistDir()
.then(function () {
    return  new FileReader().read()
})
.then(function (contents) {
    new Note(contents).publish()
})
.then(function () {
    console.log('novel-build done.')
})
