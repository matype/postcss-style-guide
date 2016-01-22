var annotation = require('css-annotation');

exports.setModules = function (syntaxHighlighter, markdownParser) {
  this.syntaxHighlighter = syntaxHighlighter;
  this.markdownParser = markdownParser;
}

exports.analyze = function (root) {
    var list = [];
    root.walkComments(function (comment) {
        var meta = annotation.read(comment.text);
        if (!meta.documents && !meta.document && !meta.docs && !meta.doc && !meta.styleguide) {
            return;
        }
        if (comment.parent.type !== 'root') {
            return;
        }
        var rules = [];
        var rule = comment.next();
        while ((rule || {}).next) {
            if (rule.type === 'rule' || rule.type === 'atrule') {
                rules.push(rule.toString());
            }
            rule = rule.next();
        }
        var joined = rules.join('\n');
        var md = comment.text.replace(/(@document|@doc|@docs|@styleguide)\s*\n/, '');
        list.push({
            rule: this.syntaxHighlighter.highlight(joined),
            html: this.markdownParser(md)
        });
    }.bind(this));
    return list;
}

