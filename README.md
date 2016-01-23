# postcss-style-guide [![Build Status](https://travis-ci.org/morishitter/postcss-style-guide.svg)](https://travis-ci.org/morishitter/postcss-style-guide)

[PostCSS](https://github.com/postcss/postcss) plugin to generate a style guide automatically.

CSS comments will be parsed through Markdown and displayed in a generated HTML document.

## Install

```shell
$ npm install postcss-style-guide
```

## Example

Node.js:

```js
var fs = require('fs');
var postcss = require('postcss');
var styleGuide = require('postcss-style-guide');

var opts = {
    name: 'Default theme',
    src: 'input.css',
    dest: 'index.html'
};
postcss([styleGuide(opts)])
  .process(css)
  .then(function () {
    var dest = path.resolve(process.cwd(), 'index.html');
    var result = fs.readFileSync(dest, 'utf8');
    console.log(reuslt); // show result
  });
```

in [Gulp](https://github.com/gulpjs/gulp):

```js
var gulp = require('gulp');

gulp.task('default', function () {
    var postcss = require('gulp-postcss');
    var processedCSS = fs.readFileSync('output.css', 'utf-8');
    return gulp.src('src/*.css')
        .pipe(postcss([
            require('postcss-style-guide')({
                name: "Project name",
                processedCSS: processedCSS
            })
        ]))
        .pipe(gulp.dest('build/'));
});
```

in [Grunt](http://gruntjs.com/):  
Use together with [nDmitry/grunt-postcss](https://github.com/nDmitry/grunt-postcss)

```js
module.exports = function(grunt) {

  grunt.initConfig({
    postcss: {
      src: 'input.css',
      options: {
        map: true, // inline sourcemaps

        // or
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'dist/css/maps/' // ...to the specified directory
        },

        processors: [
          require('postcss-style-guide')({
            // options :)
            name: 'Project name'
          }),
        ]
      },
      dist: {
        src: 'output.css',
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.registerTask('default', ['postcss']);

};
```


postcss-style-guide generate style guide from CSS comments that have special annotation(`@styleguide`).

Using this `input.css`:

```css
/*
@styleguide

# I love Twitter Bootstrap

Use the button classes on an `<a>`, `<button>`, `<input>` element.

<button class="btn">Button</button>

    <button class="btn">Button</button>

*/
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

.btn:hover,
.btn:focus,
.btn.focus {
  color: #333;
  text-decoration: none;
}

```

You will get `styleguide.html` for the style guide.

![Default style guide design](./style-guide-default.png)

Default template design is inspired by [http://codeguide.co/](http://codeguide.co/).

## Options

- `options.src`: The path to the source CSS file. You should always set src.
- `options.dest`: The path to style guide file. (default: `docs/index.html`)
- `options.project`: Project name. (default: `Style Guide`)
- `options.showCode`: The flag to show CSS code (default: `true`)
- `options.theme`: Theme name. (default: `psg-theme-default`)
- `options.themePath`: The path to theme file. (default: `node_modules/psg-theme-default`)

## Themes

You can select a theme of style guide with `options.theme`.
And you can also create original themes.
When you create themes, please read [theme guideline](https://github.com/morishitter/postcss-style-guide/blob/master/docs/theme-guideline.md)

All of postcss-style-guide themes that can be used are [here](https://www.npmjs.com/search?q=psg-theme).

### Themes list

- [default](https://github.com/morishitter/psg-theme-default)
- [sassline](https://github.com/sotayamashita/psg-theme-sassline)
- [1column](https://github.com/seka/psg-theme-1column)
- [forest](https://github.com/morishitter/psg-theme-forest)

### How to develop postcss-style-guide theme

- [Yeoman Generator](https://github.com/sotayamashita/generator-psg-theme)

## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
