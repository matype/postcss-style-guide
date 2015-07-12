var styleGuide = require('../')
var fs = require('fs')
var postcss = require('postcss')
var cssnext = require('cssnext')
var test = require('tape')

var css = fs.readFileSync('test/fixture.css', 'utf-8')
var options = {
    name: 'Default theme',
}

postcss()
    .use(styleGuide(css, options))
    .use(cssnext())
    .process(css)
    .css.trim()

test('exist styleguide.html', function (t) {
    var actual = fs.existsSync('styleguide.html')

    t.same(actual, true)
    t.end()
})

var mdParse = require('../lib/md_parse')
test('md_parse', function (t) {
    var expected = '<p>/*</p>\n<h1 id="h1">h1</h1>\n<p>*/</p>\n<p>a {\n  color: blue;\n}</p>'
    var actual = mdParse(css);
    t.same(actual, expected)
    t.end()
})

var highlight = require('../lib/css_highlight')
test('css_highlight', function (t) {
    var expected = '<span class="hljs-comment">/*\n# h1\n*/</span>\n\n<span class="hljs-tag">a</span> <span class="hljs-rules">{\n  <span class="hljs-rule"><span class="hljs-attribute">color</span>:<span class="hljs-value"> blue</span></span>;\n}</span>\n'
    var actual = highlight(css)
    t.same(actual, expected)
    t.end()
})
