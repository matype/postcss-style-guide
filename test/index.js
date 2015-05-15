var styleGuide = require('../')
var fs = require('fs')
var postcss = require('postcss')
var test = require('tape')

var css = fs.readFileSync('test/fixture.css', 'utf-8')
var res = postcss().use(styleGuide()).process(css).css.trim()

var mdParse = require('../lib/md_parse')
test('md_parse', function (t) {
    var expected = '<p>/*</p>\n<h1 id="atrules">atrules</h1>\n<p>hogehoge</p>\n<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"btn btn-primary"</span>&gt;</span>Button<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>\n</code></pre>\n<p>*/</p>\n<p>.btn {\n  padding: 5px 10px;\n}</p>'
    var actual = mdParse(css);
    t.same(actual, expected)
    t.end()
})

var highlight = require('../lib/css_highlight')
test('css_highlight', function (t) {
    var expected = '<span class="hljs-comment">/*\n# atrules\n\nhogehoge\n\n```html\n&lt;button class="btn btn-primary"&gt;Button&lt;/button&gt;\n```\n*/</span>\n\n<span class="hljs-class">.btn</span> <span class="hljs-rules">{\n  <span class="hljs-rule"><span class="hljs-attribute">padding</span>:<span class="hljs-value"> <span class="hljs-number">5px</span> <span class="hljs-number">10px</span></span></span>;\n}</span>\n'
    var actual = highlight(css)
    t.same(actual, expected)
    t.end()
})
