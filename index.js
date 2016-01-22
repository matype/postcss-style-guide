var fs = require('fs');
var path = require('path');
var postcss = require('postcss');
var ejs = require('ejs');
var nano = require('cssnano');
var mkdirp = require('mkdirp');
var annotation = require('css-annotation');

var mdParse = require('./lib/md_parse');
var highlight = require('./lib/css_highlight');

module.exports = postcss.plugin('postcss-style-guide', function (opts) {
    var func = function (root) {
        if (typeof(opts) === 'object' && !opts.src) {
            opts.src = root.toString();
        }
        var params = newParams(opts);
        var maps = walkComments(root);
        var promise = generate(maps, params)
          .then(function (styles) {
            var html = render(maps, styles, params);
            writeFile(html, params);
          })
          .then(function () {
            console.log('Successfully created style guide!');
          }).catch(function (err) {
            console.error('generate err:', err);
          });
        return promise;
    };
    return func;
});

function newParams (opts) {
    if (!opts.src) {
        throw new Error('src file is not found')
    }
    var params = {};
    var cwd = process.cwd();
    try {
        params.src = fs.readFileSync(opts.src, 'utf8');
    } catch (err) {
        throw err;
    }
    if (opts.dest) {
        params.dest = path.resolve(cwd, opts.dest);
    } else {
        params.dest = path.resolve(cwd, 'docs/index.html');
    }
    params.project = opts.project || 'Style Guide';
    if (opts.showCode === undefined) {
        params.showCode = true;
    } else {
        params.showCode = false;
    }
    var theme;
    if (opts.theme) {
        theme = 'psg-theme-' + opts.theme;
    } else {
        theme = 'psg-theme-default';
    }
    var themePath = opts.themePath || path.resolve('node_modules', theme);
    try {
        var templateFile = path.resolve(themePath, 'template.ejs');
        params.template = fs.readFileSync(templateFile, 'utf-8');
    } catch (err) {
        throw err;
    }
    try {
        var templateStyle = path.resolve(themePath, 'style.css');
        params.style = fs.readFileSync(templateStyle, 'utf-8');
    } catch (e) {
        throw err;
    }
    return params;
}

function walkComments (root) {
    var list = [];
    root.walkComments(function (comment) {
        var meta = annotation.read(comment.text);
        if (!meta.documents && !meta.document && !meta.docs && !meta.doc && !meta.styleguide) {
            return;
        }
        if (comment.parent.type !== 'root') {
            return;
        }
        var rules = [];
        var rule = comment.next();
        while ((rule || {}).next) {
            if (rule.type === 'rule' || rule.type === 'atrule') {
                rules.push(rule.toString());
            }
            rule = rule.next();
        }
        var joined = rules.join('\n');
        var html = comment.text.replace(/(@document|@doc|@docs|@styleguide)\s*\n/, '');
        list.push({
            rule: highlight(joined),
            html: mdParse(html)
        });
    });
    return list;
}

function generate (maps, params) {
    var src = params.src;
    var style = params.style;
    var p = require.resolve('highlight.js/styles/github.css');
    var codeStyle = fs.readFileSync(p, 'utf-8');
    return Promise.all([
        nano.process(src),
        nano.process(style),
        nano.process(codeStyle)
    ]);
}

function render (maps, styles, params) {
    var project = params.project;
    var showCode = params.showCode;
    var template = params.template;
    return ejs.render(template, {
        projectName:  project,
        processedCSS: styles[0].css,
        tmplStyle:    styles[1].css,
        codeStyle:    styles[2].css,
        showCode:     showCode,
        maps:         maps
    });
}

function writeFile (html, params) {
    var dest = params.dest;
    if (!path.extname(dest)) {
        dest += '.html';
    }
    try {
        var dir = path.dirname(dest);
        mkdirp.sync(dir);
    } catch (err) {
        throw err;
    }
    try {
        fs.writeFileSync(dest, html, 'utf8');
    } catch (err) {
        throw err;
    }
}

