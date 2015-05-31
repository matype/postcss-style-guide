# Guideline to create themes

`postcss-style-guide` is a PostCSS plugin that generate CSS stye guide automaticaly.

Developers can set theme of the style guide by option of `postcss-style-guide`.

```js
var postcss = require('postcss');
var styleGuide = require('postcss-style-guide');
var css = fs.readFileSync('input.css', 'utf-8');

var options = {
    theme: 'twbs',
    name: 'project name'
};

postcss()
  .use(styleGuide(options))
  .process(css)
  .css;
```

## Package name

The name of `postcss-style-guide` theme is must be prefix `psg-theme-`.
The prefix, `psg-` means `postcss-style-guide-`.

Ex. `psg-theme-twbs`

## How to create themes

### Template file name

The template extension of `postcss-style-guide` must be named `template.ejs` file and stylesheet is `style.css` too.

- Template: `template.ejs`
- Stylesheet: `style.css`


