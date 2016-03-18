/*global describe, it */
'use strict';

var assert = require('yeoman-assert');
var helper = require('./helper');

function pkgContainsDevDependencies(dependency) {
  var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return pkg.devDependencies[dependency] !== undefined;
}

describe('Generator test', function () {
  it('creates configuration files', function (done) {
    helper.run({}, {
      'uiAction': 'No'
    }, function () {
      assert.file([
        '.editorconfig',
        '.bowerrc',
        '.gitignore',
        '.gitattributes',
        'package.json',
        'bower.json',
        'app/manifest.json',
      ]);

      done();
    });
  });

  it('creates expected files with babel', function (done) {
    helper.run({
      babel: true
    }, {
      'uiAction': 'No'
    }, function () {
      assert.file([
        '.babelrc',
        'gulpfile.babel.js',
        'app/scripts.babel/background.js',
        'app/scripts.babel/chromereload.js',
      ]);

      assert.fileContent([
        ['app/scripts.babel/background.js', /details =>/],
        ['app/scripts.babel/chromereload.js', /const\sLIVERELOAD_HOST\s=/],
        ['gulpfile.babel.js', /gulp.task\('babel'/],
        ['package.json', /babel-core/],
        ['package.json', /gulp-babel/],
      ]);

      done();
    });
  });

  it('creates expected files with --no-babel', function (done) {
    helper.run({
      babel: false
    }, {
      'uiAction': 'No'
    }, function () {
      assert.file([
        'gulpfile.js',
        'app/scripts/background.js',
        'app/scripts/chromereload.js',
      ]);

      assert.noFile([
        '.babelrc',
        'gulpfile.babel.js',
        'app/scripts.babel',
      ]);

      assert.fileContent([
        ['app/scripts/background.js', /details =>/],
        ['app/scripts/chromereload.js', /const\sLIVERELOAD_HOST\s=/],
      ]);

      assert.noFileContent([
        ['gulpfile.js', /gulp.task\('babel'/],
        ['package.json', /babel-core/],
        ['package.json', /gulp-babel/],
      ]);

      done();
    });
  });

  it('creates expected files with sass', function (done) {
    helper.run({
      sass: true
    }, {
      'uiAction': 'browserAction'
    }, function () {
      assert.file([
        'app/styles.scss/main.scss',
      ]);

      assert.fileContent([
        ['gulpfile.js', /gulp.task\('styles'/],
        ['package.json', /gulp-sass/],
      ]);

      done();
    });
  });
});
