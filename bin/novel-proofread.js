#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Proofreader = require('../lib/Proofreader.js');

new FileReader().read()
.then( (contents) => new Proofreader(contents).proofread() )
.then( () => console.log('novel-proofread done.') );