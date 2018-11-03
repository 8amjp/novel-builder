#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Epub = require('../lib/Publisher/Epub.js');
const VerticalEpub = require('../lib/Publisher/VerticalEpub.js');

new Epub().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => Promise.all([
    new Epub(contents).publish(),
    new VerticalEpub(contents).publish()
]) )
.then( () => console.log('novel-publish done.') )
.catch( (err) => console.log('novel-publish failed.', err) );