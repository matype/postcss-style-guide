var fs = require('fs');
var path = require('path');

module.exports = function (root, opts) {
    var params = {};
    var cwd = process.cwd();
    if (!opts.src) {
        params.src = root.toString();
    } else {
        var src = path.resolve(cwd, opts.src);
        params.src = fs.readFileSync(src, 'utf8');
    }
    if (opts.dest) {
        params.dest = path.resolve(cwd, opts.dest);
    } else {
        params.dest = path.resolve(cwd, 'styleguide/index.html');
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
    var themePath;
    if (opts.themePath) {
      themePath = opts.themePath;
    } else {
      var module = require.resolve(theme);
      themePath = path.dirname(module)
    }
    try {
      var templateFile = path.resolve(themePath, 'template.ejs');
      params.template = fs.readFileSync(templateFile, 'utf-8');
    } catch (err) {
      throw err;
    }
    try {
      var templateStyle = path.resolve(themePath, 'style.css');
      params.style = fs.readFileSync(templateStyle, 'utf-8');
    } catch (err) {
      throw err;
    }
    return params;
}
