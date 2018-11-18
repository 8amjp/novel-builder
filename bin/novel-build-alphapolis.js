#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Alphapolis = require('../lib/Publisher/Alphapolis.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new Alphapolis(contents).publish() )
.then( () => console.log('novel-build-alphapolis done.') )
.catch( () => console.log('novel-build-alphapolis failed.') );