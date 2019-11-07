#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Narou = require('../lib/Publisher/Narou.js');

new Publisher()
    .initDistDir()
    .then(() => new FileReader().read())
    .then(contents => new Narou(contents).publish())
    .then(() => console.log('novel-build-narou done.'))
    .catch(() => console.log('novel-build-narou failed.'));
