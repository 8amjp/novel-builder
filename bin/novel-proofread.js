#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Proofreader = require('../lib/Proofreader.js');

new FileReader().read()
.then(function (contents) {
    new Proofreader(contents).proofread()
})
.then(function () {
    console.log('novel-proofread done.')
})
