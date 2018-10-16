#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Narou = require('../lib/Publisher/Narou.js');

new Publisher().initDistDir()
.then(function () {
    return  new FileReader().read()
})
.then(function (contents) {
    new Narou(contents).publish()
})
.then(function () {
    console.log('novel-build-narou done.')
})
