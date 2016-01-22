var fs = require('fs');
var path = require('path');

module.exports = function (opts) {
    if (!opts.src) {
        throw new Error('src file is not found');
    }
    var params = {};
    var cwd = process.cwd();
    var src = path.resolve(cwd, opts.src);
    try {
        params.src = fs.readFileSync(src, 'utf8');
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
