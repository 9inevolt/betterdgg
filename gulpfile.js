var gulp    = require('gulp');
var clean   = require('gulp-clean');
var concat  = require('gulp-concat');
var run     = require('gulp-run');
var zip     = require('gulp-zip');
var merge   = require('merge-stream');

gulp.task('default', [ 'chrome:zip', 'firefox:xpi', 'safari' ], function() {
});

gulp.task('clean', function() {
    return gulp.src([ './build', './dist' ], { read: false })
        .pipe(clean());
});

gulp.task('chrome', function() {
    var assets = gulp.src([ './chrome/**/*', '!./chrome/inject.js' ])
        .pipe(gulp.dest('./build/chrome/'));
    var js = gulp.src([ './betterdgg/betterdgg.js', './chrome/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./build/chrome/'));
    return merge(assets, js);
});

gulp.task('chrome:zip', [ 'chrome' ], function() {
    gulp.src('./build/chrome/**/*')
        .pipe(zip('betterdgg-chrome.zip'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('firefox', function() {
    var assets = gulp.src([ './firefox/**/*', '!./firefox/data/inject.js' ])
        .pipe(gulp.dest('./build/firefox/'));
    var js = gulp.src([ './betterdgg/betterdgg.js', './firefox/data/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./build/firefox/data/'));
    return merge(assets, js);
});

gulp.task('firefox:xpi', [ 'firefox' ], function() {
    run('mkdir -p ./dist && cd ./build/firefox && cfx xpi --output-file=../../dist/betterdgg.xpi').exec();
});

gulp.task('safari', function() {
    var assets = gulp.src([ './safari/**/*', '!./safari/inject.js' ])
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    var js = gulp.src([ './betterdgg/betterdgg.js', './safari/inject.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    merge(assets, js).on('end', function() {
        console.log('Open ./dist/betterdgg.safariextension in Safari Extension Builder'
            + ' to dist Safari extension');
    });
});
