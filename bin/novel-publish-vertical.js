#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const VerticalEpub = require('../lib/Publisher/VerticalEpub.js');

new VerticalEpub()
    .initDistDir()
    .then(() => new FileReader().read())
    .then(contents => new VerticalEpub(contents).publish())
    .then(() => console.log('novel-publish-vertical done.'))
    .catch(err => console.log('novel-publish-vertical failed.', err));
