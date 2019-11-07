#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Note = require('../lib/Publisher/Note.js');

new Publisher()
    .initDistDir()
    .then(() => new FileReader().read())
    .then(contents => new Note(contents).publish())
    .then(() => console.log('novel-build-note done.'))
    .catch(() => console.log('novel-build-note failed.'));
