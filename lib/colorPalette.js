var annotationBlock = require('css-annotation-block');
var isColor = require('is-color');
var fs = require('fs')

exports.parse = function (css) {
    var results = annotationBlock(css);

    var colorRoot = []
    var colorPalette = []

    results.forEach(function (result) {
        if (result.name === 'color') {
            result.nodes.forEach(function (node) {
                colorRoot.push(node);
            });
        }
    });

    colorRoot.forEach(function (color) {
        color.walkDecls(function (decl) {
            if (isColor(decl.value)) {
                colorPalette.push({
                    name: decl.prop.replace(/^--/, ''),
                    color: decl.value
                });
            }
        });
    });

    return colorPalette;
}

