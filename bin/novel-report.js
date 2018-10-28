#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Reporter = require('../lib/Reporter.js');

new FileReader().read()
.then(function (contents) {
    new Reporter(contents).report()
})
.then(function () {
    console.log('novel-report done.')
})
