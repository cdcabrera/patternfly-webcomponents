
/*
const gulp              = require('gulp'),
      browserSync       = require('browser-sync').create(),
      browserSyncPort   = 3000,
      baseUrl           = 'http://localhost:' + browserSyncPort,
      eslint            = require('gulp-eslint'),
      gettext           = require("gulp-gettext-parser"),
      ignore            = require('gulp-ignore'),
        Karma = require('karma').Server,
  path = require('path'),
  rename = require("gulp-rename"),
  sass = require('gulp-sass'),
  $ = require('gulp-load-plugins')(),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  runSequence = require('run-sequence'),
  sitespeedio = require('gulp-sitespeedio'),
  runBundleAnalyzer = false,
  jsdoc = require('gulp-jsdoc3'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
*/

const packageJson   = require('./package.json'),

      browserSync   = require('browser-sync'),

      del           = require('del'),
      gulp          = require('gulp'),
      sass          = require('gulp-sass'),
    //less            = require('gulp-less'),
    //concat          = require('gulp-concat'),
      jshint        = require('gulp-jshint'),
    //jsonLint        = require("gulp-jsonlint"),
    //wrap            = require('gulp-wrap'),
    //insert          = require('gulp-insert'),
    //ts              = require('gulp-typescript'),
    //rollup          = require('gulp-rollup'),
    //rollupBabel     = require("rollup-plugin-babel"),

    //babel           = require("gulp-babel"),
    //babelExtHelpers = require("babel-plugin-external-helpers"),
    //browserify      = require("browserify"),

    //gettext         = require("gulp-gettext-parser"),

    //acorn           = require('acorn'),
    //acornDynamic    = require('acorn-dynamic-import'),

      karma         = require('karma').Server;



const settings = {
    version:        (packageJson.version || ''),
    servePath:      './src',
    serveRoutes: {

        '/node_modules': './node_modules',
        '/local': './.cache'
    },

    genericMatch:   ['./src/**/*.md'],
    graphicMatch:   ['./src/**/*.png','./src/**/*.jpg','./src/**/*.gif'],
    jsonMatch:      ['./src/data/**/*.json'],

    //tsMatch:        ['./src/**/*.ts', '!src/**/*.dev.ts', '!src/**/*spec.ts', '!src/bower_components/**/*.ts'],
    jsMatch:        ['./src/**/*.js', '!src/**/*.dev.js', '!src/**/*spec.js', '!src/bower_components/**/*.js'],
    jsVendor:       [
        //'./node_modules/@webcomponents/custom-elements/src/native-shim.js'
        //'./node_modules/requirejs/require.js'
        //'./node_modules/webcomponents.js/custom-elements-es5-adapter.js',
        //'./node_modules/webcomponents.js/webcomponents-hi-sd-ce.js',
        //'./node_modules/webcomponents.js/webcomponents-lite.js',
        //'./node_modules/webcomponents.js/webcomponents-loader.js',
        //'./node_modules/systemjs/dist/system-production.js'
    ],

    //jsHintMatch:    ['./src/**/*.js', 'src/**/*.dev.js',  '!src/**/*spec.js', '!src/bower_components/**/*.js'],

    imgMatch:       ['./src/images/**/*'],
    cssMatch:       ['./src/styles/**/*.css', './src/styles/.cache/**/*.css'],

    htmlMatch:      ['./src/**/*.html','!src/**/*.dev.html'],
    indexMatch:     ['./src/index.html'],
    partialMatch:   ['./src/components/**/*.html'],

    scssMain:       ['./src/styles/patternfly-webcomponents.scss'],
    scssMatch:      ['./src/**/*.scss'],

    lessMain:       ['./src/styles/less/app.less'],
    lessMatch:      ['./src/styles/**/*.less'],
    //lessCache:      './src/styles/.cache',

    cache:              './.cache',
    distCssFile:        './dist/css',
    distJsFile:         'pf-wc.js',
    distJsVendorFile:   'vendor.js',
    dist:               './dist'



};


/**
 * Clean up the distribution directory
 */
gulp.task('clean', function () {

    return del([settings.dist+'/**/*']);
});


/**
 * Copy markdown, HTML, partials and CSS over to dist
 */
gulp.task('copy', function () {

    //gulp.src(settings.htmlMatch, { base: settings.servePath })
    //    .pipe(gulp.dest(settings.dist));

    //gulp.src(settings.imgMatch, { base: settings.servePath })
    //    .pipe(gulp.dest(settings.dist));
});


/**
 * Compile SCSS into CSS
 */
gulp.task('scss', function () {

    return gulp.src(settings.scssMain)
        //.pipe($.plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(settings.distCssFile));
    /*
     return gulp.src(settings.lessMain)
     .pipe(less())
     .pipe(gulp.dest(settings.cache))
     .pipe(browserSync.reload({ stream: true }));*/
});


/**
 * Run unit test
 */
gulp.task('unit-test', function (done) {

    new karma({

        configFile: __dirname + '/karma.conf.js',
        singleRun: true

    }, done).start();
});


/**
 * JSHint JS files
 */
gulp.task('js-hint', function () {

    return gulp.src(settings.jsMatch)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('js', ['js-hint'], function () {


});

gulp.task('build', ['js-hint', 'copy', 'clean', 'less'], function () {

});



/**
 * Launch local file serve and api spoof from api-blueprint.
 */
gulp.task('browser-sync', ['scss', 'js'], function () {

    browserSync({
        server: {
            middleware: [],
            baseDir:    settings.servePath,
            routes:     settings.serveRoutes || {},
            directory:  true
        }
    });

    gulp.watch(settings.scssMatch, ['scss']);

    gulp.watch(settings.jsMatch, ['js', 'unit-test']);

    gulp.watch([settings.servePath+'/**/*']).on('change', browserSync.reload);
});


/**
 * Serve files
 */
gulp.task('serve', ['scss', 'js-hint'], function () {

    browserSync({
        server: {
            baseDir:    settings.servePath,
            routes:     settings.serveRoutes,
            directory:  true
        }
    });

    gulp.watch(settings.lessMatch, ['less']);

    gulp.watch(settings.jsMatch, ['js-hint', 'unit-test']);

    gulp.watch([settings.servePath+'/**/*']).on('change', browserSync.reload);
});


/**
 * Serve files from dist.
 */
gulp.task('serve-dist', ['scss', 'js-hint'], function () {

    browserSync({
        server: {
            baseDir:    settings.dist,
            routes:     settings.serveRoutes,
            directory:  true
        }
    });

    gulp.watch([settings.dist+'/**/*']).on('change', browserSync.reload);
});