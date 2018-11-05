#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const TwitterHeader = require('../lib/PngGenerator/TwitterHeader.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new TwitterHeader(contents).publish() )
.then( () => console.log('novel-png-twitter-header done.') )
.catch( (err) => console.log('novel-png-twitter-header failed.', err) );