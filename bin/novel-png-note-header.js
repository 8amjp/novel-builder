#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Publisher = require('../lib/Publisher.js');
const NoteHeader = require('../lib/PngGenerator/NoteHeader.js');

new Publisher().initDistDir()
.then( () => new FileReader().read() )
.then( (contents) => new NoteHeader(contents).publish() )
.then( () => console.log('novel-png-note-header done.') )
.catch( (err) => console.log('novel-png-note-header failed.', err) );