#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Paperback = require('../lib/PngGenerator/Paperback.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new Paperback(contents).publish() )
.then( () => console.log('novel-png-paperback done.') )
.catch( (err) => console.log('novel-png-paperback failed.', err) );