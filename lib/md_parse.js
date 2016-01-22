var hl = require('highlight.js');

var marked = require('marked');
marked.setOptions({
    highlight: function (code) {
        return hl.highlightAuto(code).value;
    }
});

module.exports = function (md) {
    return marked(md).trim();
}
