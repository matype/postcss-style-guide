var ejs = require('ejs');

exports.rendering = function (maps, styles, params) {
    var project = params.project;
    var showCode = params.showCode;
    var tmpl = params.tmpl;
    var colorPalette = params.colorPalette;
    return ejs.render(tmpl, {
        projectName:  project,
        processedCSS: styles[0].css,
        tmplStyle:    styles[1].css,
        codeStyle:    styles[2].css,
        showCode:     showCode,
        colorPalette: colorPalette,
        maps:         maps
    });
}
