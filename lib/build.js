'use strict';
const FileReader = require('./classes/FileReader.js');
const Publisher = require('./classes/Publisher.js');
const Narou = require('./classes/Publisher/Narou.js');
const Novelabo = require('./classes/Publisher/Novelabo.js');
const Note = require('./classes/Publisher/Note.js');
const Epub = require('./classes/Publisher/Epub.js');

module.exports = {
    build: function () {
        new Publisher().initDistDir()
        .then(function () {
            return  new FileReader().read()
        })
        .then(function (contents) {
            return Promise.all([
                new Narou(contents).publish(),
                new Novelabo(contents).publish(),
                new Note(contents).publish(),
                new Epub(contents).publish()
            ])
        })
        .then(function () {
            console.log('completed.')
        })
    }
};