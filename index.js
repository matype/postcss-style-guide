var fs = require('fs')
var ejs = require('ejs')
var nano = require('cssnano')

var marked = require('marked')
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
})

var resourcesDir = __dirname + '/templates/'

module.exports = function plugin (options) {
    options = options || {}

    var maps = []
    return function (root) {
        var css = options.css !== undefined ? options.css : root.toString().trim()

        root.each(function (rule) {
            if (rule.type === 'rule' || rule.type === 'atrule') {
                var prev = rule.prev()
                if (prev.type === 'comment' && prev.parent.type === 'root') {
                    var html = marked(prev.text)
                    var tmplRule = rule.toString().trim()
                    maps.push({
                        'rule': tmplRule,
                        'html': html.trim()
                    })
                }
            }
        })

        generate(maps, css, options)

        return root
    }
}

function generate (maps, css, options) {
    var file = options.file || 'styleguide'
    var template = importTemplate(options)
    var style = importStyle(options)
    var obj = {
        maps: maps,
        css: nano(css)
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
