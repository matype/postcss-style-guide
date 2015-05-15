var hl = require('highlight.js')

module.exports = function (css) {
     return hl.highlight('css', css).value
}
