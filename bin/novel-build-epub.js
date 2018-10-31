#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Epub = require('../lib/Publisher/Epub.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new Epub(contents).publish() )
.then( () => console.log('novel-build-epub done.') )
.catch( () => console.log('novel-build-epub failed.') );