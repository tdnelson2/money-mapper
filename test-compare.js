const _ = require('lodash');

let swData = {cachePaths:['path1','path2'], cacheVersion:0};
let filterFilePaths = ['path1','path2', 'path3'];

let version = _.isEqual(filterFilePaths, swData.cachePaths) ? swData.cacheVersion : ++swData.cacheVersion;
console.log(version);
console.log(swData.cacheVersion);