var fs = require('fs')
var postcss = require('postcss')
var ejs = require('ejs')
var nano = require('cssnano')

var mdParse = require('./lib/md_parse')
var highlight = require('./lib/css_highlight')

var resourcesDir = __dirname + '/templates/'

module.exports = postcss.plugin('postcss-style-guide', function (options) {
    options = options || {}

    var maps = []
    return function (root) {
        var css = options.css !== undefined ? options.css : root.toString().trim()

        root.each(function (rule) {
            if (rule.type === 'rule' || rule.type === 'atrule') {
                var prev = rule.prev()
                if (prev.type === 'comment' && prev.parent.type === 'root') {
                    var tmplRule = rule.toString().trim()
                    maps.push({
                        'rule': highlight(tmplRule),
                        'html': mdParse(prev.text)
                    })
                }
            }
        })

        generate(maps, css, options)

        return root
    }
})

function generate (maps, css, options) {
    var file = options.file || 'styleguide'
    var project = options.name || 'Style Guide'
    var template = importTemplate(options)
    var tmplStyle = importStyle(options)
    var codeStyle = fs.readFileSync(__dirname + '/node_modules/highlight.js/styles/github.css', 'utf-8').trim()

    var obj = {
        projectName: project,
        css: nano(css),
        tmplStyle: nano(tmplStyle),
        codeStyle: nano(codeStyle),
        maps: maps
    }

    var html = ejs.render(template, obj)
    fs.writeFile(file + '.html', html, function (err) {
        if (err) {
            throw err
        }
        console.log('Successed to generate style guide')
    })
}

function importTemplate (options) {
    if (options.template) {
        var template = fs.readFileSync(options.template, 'utf-8').trim()
    }
    else {
        var template = fs.readFileSync(resourcesDir + 'docs.ejs', 'utf-8').trim()
    }
    return template
}

function importStyle (options) {
    if (options.style) {
        var style = fs.readFileSync(options.style, 'utf-8').trim()
    }
    else {
        var style = fs.readFileSync(resourcesDir + 'docs.css', 'utf-8').trim()
    }
    return style
}
