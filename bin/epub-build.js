#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Epub = require('../lib/Publisher/Epub.js');

new Publisher().initDistDir()
.then(function () {
    return  new FileReader().read()
})
.then(function (contents) {
    new Epub(contents).publish()
})
.then(function () {
    console.log('epub-build done.')
})
