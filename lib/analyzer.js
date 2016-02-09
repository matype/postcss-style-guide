var annotation = require('css-annotation');

exports.setModules = function (syntaxHighlighter, markdownParser) {
  this.syntaxHighlighter = syntaxHighlighter;
  this.markdownParser = markdownParser;
}

exports.analyze = function (root) {
    var list = [];
    var linkId = 0;
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
        while (rule && rule.type !== 'comment') {
            if (rule.type === 'rule' || rule.type === 'atrule') {
                rules.push(rule.toString());
            }
            rule = rule.next();
        }
        var joined = rules.join('\n\n');
        var md = comment.text.replace(/(@document|@doc|@docs|@styleguide)\s*\n/, '');
        md = md.replace(/@title\s.*\n/, '');
        list.push({
            rule: this.syntaxHighlighter.highlight(joined),
            html: this.markdownParser(md),
            link: {
                id: 'psg-link-' + linkId,
                title: meta.title || null
            }
        });
        linkId++;
    }.bind(this));
    return list;
}

