#!/usr/bin/env node

'use strict';

const FileReader = require('../lib/FileReader.js');
const Reporter = require('../lib/Reporter.js');

new FileReader().read()
.then( (contents) => new Reporter(contents).report() )
.then( () => console.log('novel-report done.') );