var fs = require('fs')
var marked = require('marked')
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
})
var ejs = require('ejs')

var inspect = require('obj-inspector')
var options

module.exports = function plugin (options) {
    options = options || {}

    var maps = []
    return function (root) {
        root.each(function (rule) {
            if (rule.type === 'rule' || rule.type === 'atrule') {
                var prev = rule.prev()
                if (prev.type === 'comment' && prev.parent.type === 'root') {
                    var html = marked(prev.text)
                    maps.push({
                        'rule': rule,
                        'html': html
                    })
                }
            }
        })

        generate(maps)

        return root
    }
}

function generate (maps) {
    var template = importTemplate(options)
    var style = importStyle(options)
    var obj = {
        maps: maps
    }
    var html = ejs.render(template, obj)
    fs.writeFile('styleguide.html', html, function (err) {
        if (err) {
            throw err
        }
        console.log('Successed to generate style guide')
    })
}

function importTemplate (options) {
    if (options) {
        var template = fs.readFileSync(options.template, 'utf-8').trim()
    }
    else {
        // var template = fs.readFileSync('./node_modules/postcss-style-guide/template.ejs', 'utf-8').trim()
        var template = fs.readFileSync('./template.ejs', 'utf-8').trim()
    }
    return template
}

function importStyle (options) {
    if (options) {
        var style = fs.readFileSync(options.style, 'utf-8').trim()
    }
    else {
        // var template = fs.readFileSync('./node_modules/postcss-style-guide/default.css', 'utf-8').trim()
        var style = fs.readFileSync('./default.css', 'utf-8').trim()
    }
    return style
}
