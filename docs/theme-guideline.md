# Guideline to create themes

`postcss-style-guide` is a PostCSS plugin that generate CSS stye guide automatically.

Developers can set theme of the style guide by option of `postcss-style-guide`.

```js
var postcss = require('postcss');
var styleGuide = require('postcss-style-guide');
var css = fs.readFileSync('input.css', 'utf-8');

var options = {
  theme: 'forest',
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

Ex. `psg-theme-forest`

## How to create themes

### Template file name

The template extension of `postcss-style-guide` must be named `template.ejs` file and stylesheet is `style.css` too.

- Template: `template.ejs`
- Stylesheet: `style.css`

### Set keyword in `package.json`

Themes of `postcss-style-guide` must have the `psg-theme` keyword in their `package.json`.

### Screenshot image for example

You should put a screenshot image for example.

like this:

![Default style guide design](../style-guide-default.png)
