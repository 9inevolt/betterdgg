var gulp    = require('gulp');
var clean   = require('gulp-clean');
var concat  = require('gulp-concat');
var footer  = require('gulp-footer');
var header  = require('gulp-header');
var run     = require('gulp-run');
var zip     = require('gulp-zip');
var merge   = require('merge-stream');

gulp.task('default', [ 'chrome:zip', 'firefox:xpi', 'safari' ], function() {
});

gulp.task('clean', function() {
    return gulp.src([ './build', './dist' ], { read: false })
        .pipe(clean());
});

gulp.task('js', function() {
    return gulp.src('./betterdgg/*.js')
        .pipe(concat('betterdgg.js'))
        .pipe(header('var injectedBetterDGG = function() {'))
        .pipe(footer('};'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('chrome', [ 'js' ], function() {
    var assets = gulp.src([ './chrome/**/*', '!./chrome/inject.js' ])
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
    var assets = gulp.src([ './safari/**/*', '!./safari/inject.js' ])
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    var js = gulp.src([ './build/betterdgg.js', './safari/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    merge(assets, js).on('end', function() {
        console.log('Open ./dist/betterdgg.safariextension in Safari Extension Builder'
            + ' to dist Safari extension');
    });
});
