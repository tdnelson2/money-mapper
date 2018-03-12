const Handlebars = require('handlebars');
const _ = require('lodash');
const fs = require('fs-extra');
const co = require('co');
const distFolder = './dist/';
const savePath = './dist/sw.js';
const swPath = './sw.js';
const dataPath = './sw.data.json';
const ignore = ['sw.js', 'index.html'];

co(function* () {

  // `swData`: SW metadata containing the cache  
  // version number and previous state of cached files.
  let swData = { cacheVersion:0, cachePaths:[] }; 
  try {
    const swDataJSON = yield fs.readFile(dataPath, 'utf8');
    swData = JSON.parse(swDataJSON);
  } catch (e) {}

  // `swSource`: The SW template.
  // `cPaths`: A list of files in the `dist` directory. 
  const [swSource, cPaths] = yield [fs.readFile(swPath, 'utf8'),
                                    fs.readdir(distFolder)];

  // Filter out the files in the ignore list.
  const fcPaths = cPaths.filter(p => !ignore.includes(p));

  // Increment the version number if changes are found.
  const version = _.isEqual(fcPaths, swData.cachePaths) ?
                            swData.cacheVersion :
                            ++swData.cacheVersion;

  // Update the cached files list so it 
  // can be saved for future use.
  swData.cachePaths = fcPaths;

  // Populate the service worker template using data computed
  // by comparing the metadata against the current state.
  const template = Handlebars.compile(swSource);
  const swResult = template({
    "cacheVersion":version,
    "cachePaths":fcPaths
  });

  // Output to file.
  const res = yield [fs.outputFile(dataPath, JSON.stringify(swData), 'utf8'),
                     fs.outputFile(savePath, swResult, 'utf8')];

  console.log('Service Worker updated succesfully');

}).catch((err) => {
  console.log(err);
});