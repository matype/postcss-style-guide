var fs = require('fs');
var hl = require('highlight.js');
var csso = require('csso');

exports.highlight = function (css) {
    return hl.highlight('css', css).value;
}

exports.execute = function (params) {
    var src = params.src;
    var tmplStyle = params.tmplStyle;
    var codeStyle = fs.readFileSync(params.stylePath, 'utf-8');
    return Promise.all([
        csso.minify(src),
        csso.minify(tmplStyle),
        csso.minify(codeStyle)
    ]);
}

