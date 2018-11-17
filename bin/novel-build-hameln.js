#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Hameln = require('../lib/Publisher/Hameln.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new Hameln(contents).publish() )
.then( () => console.log('novel-build-hameln done.') )
.catch( () => console.log('novel-build-hameln failed.') );