#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const PngGenerator = require('../lib/PngGenerator.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new PngGenerator(contents).publish() )
.then( () => console.log('novel-png done.') )
.catch( (err) => console.log('novel-png failed.', err) );