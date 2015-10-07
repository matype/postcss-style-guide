var styleGuide = require('../')
var fs = require('fs')
var postcss = require('postcss')
var test = require('tape')

var css = fs.readFileSync('test/fixture.css', 'utf-8')
var options = {
    name: 'Default theme',
    dir: 'styleguide',
    file: 'index.html',
    processedCSS: css
}

postcss()
    .use(styleGuide(options))
    .process(css)
    .css.trim()

test('exist styleguide.html', function (t) {
    var actual = fs.existsSync('styleguide/index.html')

    t.same(actual, true)
    t.end()
})

