#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Novelabo = require('../lib/Publisher/Novelabo.js');

new Publisher()
    .initDistDir()
    .then(() => new FileReader().read())
    .then(contents => new Novelabo(contents).publish())
    .then(() => console.log('novel-build-novelabo done.'))
    .catch(() => console.log('novel-build-novelabo failed.'));
