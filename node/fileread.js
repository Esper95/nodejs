var fs = require('fs');
const { findSourceMap } = require('module');

fs.readFile('sample.txt', 'utf8', function(err, data) {
    console.log(data);
});