#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const Alphapolis = require('../lib/Publisher/Alphapolis.js');
const Hameln = require('../lib/Publisher/Hameln.js');
const Kakuyomu = require('../lib/Publisher/Kakuyomu.js');
const Narou = require('../lib/Publisher/Narou.js');
const Note = require('../lib/Publisher/Note.js');
const Novelabo = require('../lib/Publisher/Novelabo.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => Promise.all([
    new Alphapolis(contents).publish(),
    new Hameln(contents).publish(),
    new Kakuyomu(contents).publish(),
    new Narou(contents).publish(),
    new Novelabo(contents).publish(),
    new Note(contents).publish(),
]) )
.then( () => console.log('novel-build done.') );