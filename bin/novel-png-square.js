#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Square = require('../lib/PngGenerator/Square.js');

new Publisher()
    .initDistDir()
    .then(() => new FileReader().read())
    .then(contents => new Square(contents).publish())
    .then(() => console.log('novel-png-square done.'))
    .catch(err => console.log('novel-png-square failed.', err));
