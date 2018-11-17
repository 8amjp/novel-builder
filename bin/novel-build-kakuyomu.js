#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Kakuyomu = require('../lib/Publisher/Kakuyomu.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new Kakuyomu(contents).publish() )
.then( () => console.log('novel-build-kakuyomu done.') )
.catch( () => console.log('novel-build-kakuyomu failed.') );