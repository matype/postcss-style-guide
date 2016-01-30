var fs = require('fs');
var path = require('path');

module.exports = function (root, opts, pluginOpts) {
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
        var from = (pluginOpts || {}).from; // for the gulp and grunt
        var output = from ? path.basename(from, '.css') : 'index.html'
        params.dest = path.resolve(cwd, 'styleguide', output);
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
