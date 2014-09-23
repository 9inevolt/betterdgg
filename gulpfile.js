var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
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

var rImages = /(url\(['|"]?)([^:'"]*)(?=['|"]?\))/ig;

gulp.task('chrome:css', function() {
    var extPath = map(function(code) {
        code = code.toString();
        return code.replace(rImages, '$1chrome-extension://__MSG_@@extension_id__/$2');
    });
    return gulp.src('./betterdgg/*.css')
        .pipe(extPath)
        .pipe(concat('betterdgg.css'))
        .pipe(gulp.dest('./build/chrome/'));
});

gulp.task('firefox:css', function() {
    var encode64 = map(function(code, filename) {
        code = code.toString();
        var dir = path.dirname(filename);
        return code.replace(rImages, function(match, p1, url) {
            var imgPath = path.join(dir, url);
            if (fs.existsSync(imgPath)) {
                var img = fs.readFileSync(imgPath);
                url = 'data:' + mime.lookup(imgPath) + ';base64,' + img.toString('base64');
                match = p1 + url;
            } else {
                console.error('Could not find image: ' + imgPath);
            }
            return match;
        });
    });
    return gulp.src('./betterdgg/*.css')
        .pipe(encode64)
        .pipe(concat('betterdgg.css'))
        .pipe(gulp.dest('./build/firefox/data/'));
});

gulp.task('safari:css', function() {
    return gulp.src('./betterdgg/*.css')
        .pipe(concat('betterdgg.css'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
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

gulp.task('firefox', [ 'firefox:css', 'js' ], function() {
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

gulp.task('safari', [ 'safari:css', 'js' ], function() {
    var assets = gulp.src([ './betterdgg/**/*.png',
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
