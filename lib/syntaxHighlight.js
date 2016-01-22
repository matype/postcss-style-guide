var fs = require('fs');
var hl = require('highlight.js');
var nano = require('cssnano');

exports.highlight = function (css) {
    return hl.highlight('css', css).value;
}

exports.execute = function (params) {
    var src = params.src;
    var tmplStyle = params.tmplStyle;
    var codeStyle = fs.readFileSync(params.stylePath, 'utf-8');
    return Promise.all([
        nano.process(src),
        nano.process(tmplStyle),
        nano.process(codeStyle)
    ]);
}

