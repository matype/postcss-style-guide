var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

exports.write = function (filePath, str) {
    var dest = filePath;
    if (path.extname(filePath) !== '.html') {
        dest += '.html';
    }
    var dir = path.dirname(dest);
    try {
        mkdirp.sync(dir);
    } catch (err) {
        throw err;
    }
    try {
        fs.writeFileSync(dest, str, 'utf8');
    } catch (err) {
        throw err;
    }
}
