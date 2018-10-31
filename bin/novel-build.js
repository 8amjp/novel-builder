#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Narou = require('../lib/Publisher/Narou.js');
const Note = require('../lib/Publisher/Note.js');
const Novelabo = require('../lib/Publisher/Novelabo.js');
const Epub = require('../lib/Publisher/Epub.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => Promise.all([
    new Narou(contents).publish(),
    new Novelabo(contents).publish(),
    new Note(contents).publish(),
    new Epub(contents).publish()
]) )
.then( () => console.log('novel-build done.') );