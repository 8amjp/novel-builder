#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Epub = require('../lib/Publisher/Epub.js');

new Epub().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new Epub(contents).publish() )
.then( () => console.log('novel-publish-horizontal done.') )
.catch( (err) => console.log('novel-publish-horizontal failed.', err) );