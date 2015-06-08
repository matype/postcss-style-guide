var styleGuide = require('../')
var fs = require('fs')
var postcss = require('postcss')
var test = require('tape')

var css = fs.readFileSync('test/fixture.css', 'utf-8')
var options = {
    name: 'Default theme',
}


test('exist styleguide.html', function (t) {
    postcss().use(styleGuide(options)).process(css).css.trim()
    var actual = fs.existsSync('styleguide.html')

    t.same(actual, true)
    t.end()
})

var mdParse = require('../lib/md_parse')
test('md_parse', function (t) {
    var expected = '<p>/*</p>\n<h1 id="write-the-explanatory-text-of-the-bellow-rule-set-">Write the explanatory text of the bellow rule set.</h1>\n<p>Basic blue button.</p>\n<pre><code><span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"btn-blue"</span>&gt;</span>Button<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>\n</code></pre><p>*/</p>\n<p>.button-blue {\n  color: white;\n  background-color: var(--blue);\n  border-radius: var(--border-radius);\n}</p>'
    var actual = mdParse(css);
    t.same(actual, expected)
    t.end()
})

var highlight = require('../lib/css_highlight')
test('css_highlight', function (t) {
    var expected = '<span class="hljs-comment">/*\n# Write the explanatory text of the bellow rule set.\n\nBasic blue button.\n\n    &lt;button class="btn-blue"&gt;Button&lt;/button&gt;\n*/</span>\n\n<span class="hljs-class">.button-blue</span> <span class="hljs-rules">{\n  <span class="hljs-rule"><span class="hljs-attribute">color</span>:<span class="hljs-value"> white</span></span>;\n  <span class="hljs-rule"><span class="hljs-attribute">background-color</span>:<span class="hljs-value"> <span class="hljs-function">var</span>(--blue)</span></span>;\n  <span class="hljs-rule"><span class="hljs-attribute">border-radius</span>:<span class="hljs-value"> <span class="hljs-function">var</span>(--border-radius)</span></span>;\n}</span>\n'
    var actual = highlight(css)
    t.same(actual, expected)
    t.end()
})
