const Handlebars = require('handlebars');
const _ = require('lodash');
const fs = require('fs-extra');
const distFolder = './dist/';
const savePath = './dist/sw.js';
const swPath = './sw.js';
const swDataPath = './sw.data.json';
const ignore = ['sw.js', 'index.html'];

let swSource;
let swResult;
let swData;

fs.readFile(swPath, 'utf8')

  // Open the service worker template.
  .then(swSource => {
    this.swSource = swSource;
    return fs.readFile(swDataPath, 'utf8')
  }, err => {
    console.log('service worker template could not be found');
  })

  // Open the service worker metadata file containing data about
  // the previous state of cached files and cache version number.
  .then(swData => {
    this.swData = JSON.parse(swData);
    return fs.readdir(distFolder);
  }, err => {

    // Create the metadata if it doesn't already exist.
    this.swData = {
      cacheVersion:0,
      cachePaths:[]
    };
    return fs.readdir(distFolder);
  })

  // Get a list of files in the `dist` directory.
  // We'll use this list to populate the list of files
  // that the service worker will need to cache. 
  .then(cPaths => {
    const fcPaths = cPaths.filter(p => !ignore.includes(p));

    // If contents of the directory have 
    // changed, bump the version number.
    const version = _.isEqual(fcPaths, this.swData.cachePaths) ?
                              this.swData.cacheVersion :
                              ++this.swData.cacheVersion;

    // Update the cached files list so it can be saved
    // for future use.
    this.swData.cachePaths = fcPaths;

    // Populate the service worker template file using data computed
    // by comparing the metadata file against the current state.
    const template = Handlebars.compile(this.swSource);
    this.swResult = template({
      "cacheVersion":version,
      "cachePaths":fcPaths
    });

    // Write the metadata file.
    return fs.outputFile(swDataPath, JSON.stringify(this.swData), 'utf8');
  })
  .then(() => {
    console.log('Service worker metadata written succesfully')

    // Write the new service worker file.
    return fs.outputFile(savePath, this.swResult, 'utf8');
  }, err => {
    console.log('There was an error writting the service worker metadata: ', err);
  })
  .then(() => {
    console.log('Service worker written succesfully')
  })
  .catch(err => {
    console.log('There was an error:', err);
  });