# postcss-style-guide [![Build Status](https://travis-ci.org/morishitter/postcss-style-guide.svg)](https://travis-ci.org/morishitter/postcss-style-guide)

PostCSS plugin to generate a style guide automatically.

CSS comments will be parsed through Markdown and displayed in a generated HTML document.

## Install

```shell
$ npm install postcss-style-guide
```

## Example

```js
var fs = require('fs');
var postcss = require('postcss');
var styleGuide = require('postcss-style-guide');

var css = fs.readFileSync('input.css', 'utf-8');
var options = {
    name: "Project name"
};

var output = postcss()
    .use(styleGuide(options))
    .process(css)
    .css;
```

Using this `input.css`:

```css

/*
# Write the explanatory text of the bellow rule set.

Basic blue button.

    <button class="btn-blue">Button</button>
*/

.btn-blue {
  color: white;
  background-color: var(--blue);
  border-radius: var(--border-radius);
}
```

You will get `styleguide.html` for the style guide.

![Default style guide design](./style-guide-default.png)

Inspired by [http://codeguide.co/](http://codeguide.co/)

## Options

- `options.name`: Project name
- `options.file`: CSS file name
- `options.template`: Custom template file (`.ejs`)
- `options.style`: Custom stylesheet file (`.css`)

## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
