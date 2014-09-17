var fs      = require('fs');
var path    = require('path');
var gulp    = require('gulp');
var clean   = require('gulp-clean');
var concat  = require('gulp-concat');
var footer  = require('gulp-footer');
var header  = require('gulp-header');
var jade    = require('gulp-jade');
var run     = require('gulp-run');
var zip     = require('gulp-zip');
var merge   = require('merge-stream');
var map     = require('vinyl-map');

gulp.task('default', [ 'chrome:zip', 'firefox:xpi', 'safari' ], function() {
});

gulp.task('clean', function() {
    return gulp.src([ './build', './dist' ], { read: false })
        .pipe(clean());
});

gulp.task('chrome:css', function() {
    var rImages = /(url\(['|"]?)([^:]*)(?=['|"]?\))/ig;
    var extPath = map(function(code) {
        code = code.toString();
        return code.replace(rImages, '$1chrome-extension://__MSG_@@extension_id__/$2');
    });
    return gulp.src('./betterdgg/*.css')
        .pipe(extPath)
        .pipe(concat('betterdgg.css'))
        .pipe(gulp.dest('./build/chrome/'));
});

gulp.task('js', [ 'templates' ], function() {
    return gulp.src([ './node_modules/gulp-jade/node_modules/jade/runtime.js',
            './betterdgg/modules/*.js', './build/templates.js',
            './betterdgg/*.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(header('var injectedBetterDGG = function() {\n'))
        .pipe(footer('\n};'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('templates', function() {
    var nameTemplate = map(function(code, filename) {
        code = code.toString();
        var declaration = 'window.BetterDGG.templates.' + path.basename(filename, '.js') + ' = function(';
        return code.replace(/^function template\(/, declaration);
    });

    return gulp.src([ './betterdgg/templates/**/*.jade' ])
        .pipe(jade({ client: true }))
        .pipe(nameTemplate)
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('chrome', [ 'chrome:css', 'js' ], function() {
    var assets = gulp.src([ './betterdgg/**/*.png',
            './chrome/**/*', '!./chrome/inject.js' ])
        .pipe(gulp.dest('./build/chrome/'));
    var js = gulp.src([ './build/betterdgg.js', './chrome/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./build/chrome/'));
    return merge(assets, js);
});

gulp.task('chrome:zip', [ 'chrome' ], function() {
    gulp.src('./build/chrome/**/*')
        .pipe(zip('betterdgg-chrome.zip'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('firefox', [ 'js' ], function() {
    var assets = gulp.src([ './firefox/**/*', '!./firefox/data/inject.js' ])
        .pipe(gulp.dest('./build/firefox/'));
    var js = gulp.src([ './build/betterdgg.js', './firefox/data/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./build/firefox/data/'));
    return merge(assets, js);
});

gulp.task('firefox:xpi', [ 'firefox' ], function() {
    run('mkdir -p ./dist && cd ./build/firefox && cfx xpi --output-file=../../dist/betterdgg.xpi').exec();
});

gulp.task('safari', [ 'js' ], function() {
    var assets = gulp.src([ './betterdgg/betterdgg.css', './betterdgg/**/*.png',
            './safari/**/*', '!./safari/inject.js' ])
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    var js = gulp.src([ './build/betterdgg.js', './safari/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    merge(assets, js).on('end', function() {
        console.log('Open ./dist/betterdgg.safariextension in Safari Extension Builder'
            + ' to dist Safari extension');
    });
});
