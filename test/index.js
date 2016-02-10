var fs = require('fs');
var path = require('path');
var test = require('tape');
var postcss = require('postcss');

var styleGuide = require('../');
var newParams = require('../lib/params');
var template = require('../lib/template');
var fileWriter = require('../lib/fileWriter');
var markdownParser = require('../lib/markdown');
var syntaxHighlighter = require('../lib/syntaxHighlight');
var analyzer = require('../lib/analyzer');
var colorPalette = require('../lib/colorPalette');

test('params: default options', function (t) {
    var src = 'test/input.css';
    var actual = newParams({}, {
        src: src
    });
    var cwd = process.cwd();
    var themePath = path.resolve('node_modules', 'psg-theme-default');
    var templateFile = path.resolve(themePath, 'template.ejs');
    var templateStyle = path.resolve(themePath, 'style.css');
    var expected = {
        src: fs.readFileSync(src, 'utf8'),
        dest: path.resolve(cwd, 'styleguide/index.html'),
        project: 'Style Guide',
        showCode: true,
        template: fs.readFileSync(templateFile, 'utf-8'),
        style: fs.readFileSync(templateStyle, 'utf-8')
    };
    t.deepEqual(actual, expected)
    t.end()
});

test('params: custom options', function (t) {
    var cwd = process.cwd();
    var src = path.resolve(cwd, 'test/input.css');
    var dest = path.resolve(cwd, 'test/dest/index.html');
    var project = 'custom style guide';
    var themePath = path.resolve('node_modules', 'psg-theme-default');
    var actual = newParams({}, {
        src: src,
        dest: dest,
        project: project,
        showCode: false,
        themePath: themePath
    });
    var templateFile = path.resolve(themePath, 'template.ejs');
    var templateStyle = path.resolve(themePath, 'style.css');
    var expected = {
        src: fs.readFileSync(src, 'utf8'),
        dest: dest,
        project: project,
        showCode: false,
        template: fs.readFileSync(templateFile, 'utf-8'),
        style: fs.readFileSync(templateStyle, 'utf-8'),
    };
    t.deepEqual(actual, expected);
    t.end();
});

test('template: render html', function (t) {
    var themePath = path.resolve('node_modules', 'psg-theme-default');
    var templateFile = path.resolve(themePath, 'template.ejs');
    var params = {
        project: 'project',
        tmpl: fs.readFileSync(templateFile, 'utf8'),
        params: false
    };
    var actual = template.rendering([], ['', '', ''], params);
    // FIXME: Generate dynamic code that is not desirable
    var expected = '<!doctype html>\n<html class="psg-theme" lang="en">\n    <head>\n        <meta charset="UTF-8">\n        <title>project</title>\n        <style></style>\n    </head>\n\n    <body>\n      <div class="psg-wrapper">\n        <nav class="psg-menu">\n          <a href="" class="psg-logo">\n            <img\n              title="Philosopher’s stone, logo of PostCSS"\n              src="http://postcss.github.io/postcss/logo-leftp.svg">\n          </a>\n\n          <ul class="psg-ComponentList">\n            \n            \n          </ul>\n\n        </nav>\n\n        <div class="psg-main">\n          <header class="psg-title">\n            <h1>project</h1>\n          </header>\n\n          <div class="psg-container">\n            \n            \n          </div>\n        </div>\n\n      </div>\n\n    </body>\n</html>\n';
    t.same(actual, expected);
    t.end();
});

test('fileWriter: write file', function (t) {
    var filePath = 'test/dest/write'
    var str = '';
    fileWriter.write(filePath, str);
    var cwd = process.cwd();
    var dest = path.resolve(cwd, filePath + '.html');
    var actual = fs.existsSync(dest);
    var expected = true;
    t.same(actual, expected);
    t.end();
});

test('fileWriter: confirm wrote item', function (t) {
    var filePath = 'test/dest/write'
    var str = 'Hello, World!';
    fileWriter.write(filePath, str);
    var cwd = process.cwd();
    var dest = path.resolve(cwd, filePath + '.html');
    var actual = fs.readFileSync(dest, 'utf8');
    var expected = str;
    t.same(actual, expected);
    t.end();
});

test('analyzer: analyze root node', function (t) {
    analyzer.setModules(syntaxHighlighter, markdownParser);
    var cwd = process.cwd();
    var filePath = path.resolve(cwd, 'test/input.css');
    var css = fs.readFileSync(filePath, 'utf8');
    var root = postcss.parse(css);
    var actual = analyzer.analyze(root);
    var expected = [{
        rule: '<span class="hljs-class">.class</span> <span class="hljs-rules">{\n  <span class="hljs-rule"><span class="hljs-attribute">color</span>:<span class="hljs-value"> blue</span></span>;\n}</span>',
        html: '<h1 id="h1">h1</h1>',
        link: {
            id: 'psg-link-0',
            title: 'input sample'
        }
    },
    {
        rule: '<span class="hljs-class">.class</span> <span class="hljs-rules">{\n  <span class="hljs-rule"><span class="hljs-attribute">color</span>:<span class="hljs-value"> red</span></span>;\n}</span>',
        html: '<h2 id="h2">h2</h2>',
        link: {
            id: 'psg-link-1',
            title: null
        }
    }];
    t.same(actual, expected);
    t.end();
});

test('colorPalette: generate color palette from custom properties', function (t) {
    var cwd = process.cwd();
    var filePath = path.resolve(cwd, 'test/color.css');
    var css = fs.readFileSync(filePath, 'utf8');
    colorPalette.parse(css)
    var actual = colorPalette.parse(css);
    var expected = [
        { name: 'red', color: '#ff0000' },
        { name: 'green', color: '#00ff00' },
        { name: 'blue', color: '#0000ff' }
    ];
    t.same(actual, expected);
    t.end();
});

test('integration test: exist output', function (t) {
    var opts = {
        name: 'Default theme',
        src: 'test/input.css',
        dest: 'test/dest/exist/index.html',
    };
    var cwd = process.cwd();
    var src = path.resolve(cwd, 'test/input.css');
    var css = fs.readFileSync(src, 'utf-8');
    postcss([styleGuide(opts)])
      .process(css)
      .then(function () {
        var dest = path.resolve(cwd, 'test/dest/exist/index.html');
        var actual = fs.existsSync(dest);
        var expected = true;
        t.same(actual, expected);
        t.end();
      })
      .catch(function (err) {
        t.error(err)
        t.end();
      });
});

test('integration test: confirm output', function (t) {
    var opts = {
        name: 'Default theme',
        src: 'test/input.css',
        dest: 'test/dest/confirm/index.html',
    };
    var cwd = process.cwd();
    var src = path.resolve(cwd, 'test/input.css');
    var css = fs.readFileSync(src, 'utf-8');
    postcss([styleGuide(opts)])
      .process(css)
      .then(function () {
        var dest = path.resolve(cwd, 'test/dest/confirm/index.html');
        var actual = fs.readFileSync(dest, 'utf8');
        var expectedPath = path.resolve(cwd, 'test/output.html');
        var expected = fs.readFileSync(expectedPath, 'utf8');
        t.same(actual, expected);
        t.end();
      })
      .catch(function (err) {
        t.error(err)
        t.end();
      });
});

test('async plugin test', function (t) {
    var starts = 0;
    var finish = 0;
    var asyncFunc = function (css) {
        return new Promise(function (resolve) {
            starts += 1;
            setTimeout(function () {
                finish += 1;
                css.append('a {}');
                resolve();
            }, 100);
        });
    };
    postcss([asyncFunc, styleGuide, asyncFunc]).process('').then(function (result) {
        t.same(starts, 2);
        t.same(finish, 2);
        t.same(result.css, 'a {}\na {}');
        t.end()
    }).catch(function (err) {
        t.error(err)
        t.end();
    });
});

/*
test.onFinish(function () {
    var cwd = process.cwd();
    var dest = path.resolve(cwd, 'test/dest');
    var recursiveDeleteDir = function(dest) {
        if(fs.existsSync(dest)) {
            fs.readdirSync(dest).forEach(function(file, index){
                var filePath = path.resolve(dest, file);
                if(fs.lstatSync(filePath).isDirectory()) {
                    recursiveDeleteDir(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            });
            fs.rmdirSync(dest);
        }
    };
    recursiveDeleteDir(dest);
});
*/
