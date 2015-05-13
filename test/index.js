var styleGuide = require('../')
var fs = require('fs')
var postcss = require('postcss')
var test = require('tape')

function fixture (name) {
    return fs.readFileSync('test/fixtures/' + name + '.css', 'utf-8').trim()
}

var css = fs.readFileSync('test/fixture.css', 'utf-8')
var res = postcss().use(styleGuide()).process(css).css.trim()
