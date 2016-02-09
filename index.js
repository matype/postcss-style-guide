var postcss = require('postcss');

var analyzer = require('./lib/analyzer');
var newParams = require('./lib/params');
var template = require('./lib/template');
var fileWriter = require('./lib/fileWriter');
var markdownParser = require('./lib/markdown');
var syntaxHighlighter = require('./lib/syntaxHighlight');
var colorPalette = require('./lib/colorPalette');

module.exports = postcss.plugin('postcss-style-guide', function (opts) {
    opts = opts || {};
    analyzer.setModules(syntaxHighlighter, markdownParser);
    var func = function (root, result) {
        var resultOpts = result.opts || {};
        try {
            var params = newParams(root, opts, resultOpts);
        } catch (err) {
            throw err;
        }
        var maps = analyzer.analyze(root);
        var palette = colorPalette.parse(root.toString());
        var promise = syntaxHighlighter.execute({
            src: params.src,
            tmplStyle: params.style,
            stylePath: require.resolve('highlight.js/styles/github.css')
          }).then(function (styles) {
            var html = template.rendering(maps, styles, {
                project: params.project,
                showCode: params.showCode,
                tmpl: params.template,
                colorPalette: palette
            });
            fileWriter.write(params.dest, html);
          }).then(function () {
            console.log('Successfully created style guide!');
            return root;
          }).catch(function (err) {
            console.error('generate err:', err);
            return root;
          });
        return promise;
    };
    return func;
});

