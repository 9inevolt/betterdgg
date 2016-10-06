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
var source  = require('vinyl-source-stream');
var plist   = require('plist');
var webpack = require('webpack');

var package = require('./package.json');

gulp.task('default', [ 'chrome:zip', 'firefox:xpi' ], function() {
});

gulp.task('clean', function() {
    return gulp.src([ './build', './dist' ], { read: false })
        .pipe(clean());
});

var rImages = /(url\(['|"]?)([^:'"]*)(?=['|"]?\))/ig;

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

gulp.task('chrome:css', [ 'webpack' ], function() {
    var extPath = map(function(code) {
        code = code.toString();
        return code.replace(rImages, '$1chrome-extension://__MSG_@@extension_id__/$2');
    });
    return gulp.src('./build/betterdgg.css')
        .pipe(extPath)
        .pipe(gulp.dest('./build/chrome/'));
});

gulp.task('firefox:css', [ 'chrome:css' ], function() {
    return gulp.src('./build/chrome/betterdgg.css')
        .pipe(map(function(code) {
            code = code.toString();
            return code.replace(/chrome-extension:/g, 'moz-extension:');
        }))
        .pipe(gulp.dest('./build/firefox/'));
});

gulp.task('safari:css', function() {
    return gulp.src('./betterdgg/*.css')
        .pipe(encode64)
        .pipe(concat('betterdgg.css'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
});

gulp.task('webpack', [ 'templates', 'version' ], function(done) {
    webpack(require('./webpack.config')).run(function(err, stats) {
        if (err) {
            return done(err);
        } else if (stats.hasErrors()) {
            return done(stats.toString('errors-only'));
        }

        console.log(stats.toString());
        done();
    });
});

//TODO: rearrange file structure for this and version
gulp.task('templates', function() {
    var nameTemplate = map(function(code, filename) {
        code = code.toString();
        var declaration = path.basename(filename, '.js') + ': function(';
        return code.replace(/^function template\(/, declaration) + ',';
    });

    return gulp.src([ './betterdgg/templates/**/*.jade' ])
        .pipe(jade({ client: true }))
        .pipe(nameTemplate)
        .pipe(concat('templates.js'))
        .pipe(header('let templates = {\n'))
        .pipe(header('import jade from "jade/lib/runtime";\n'))
        .pipe(footer('\n};\n'))
        .pipe(footer('\nexport default templates'))
        .pipe(gulp.dest('./betterdgg/modules/'));
});

gulp.task('version', function() {
    var stream = source('version.js');
    stream.write('const VERSION = "' + package.version + '";');
    stream.write('export default VERSION');

    return gulp.src('version.js')
        .pipe(stream)
        .pipe(gulp.dest('./betterdgg/modules/'));
});

gulp.task('chrome:manifest', function() {
    return gulp.src('./chrome/manifest.json')
        .pipe(map(function(code) {
            var obj = JSON.parse(code.toString());
            obj.version = package.version;
            return JSON.stringify(obj);
        }))
        .pipe(gulp.dest('./build/chrome/'));
});

gulp.task('chrome', [ 'chrome:css', 'chrome:manifest', 'webpack' ], function() {
    var assets = gulp.src([ './betterdgg/**/*.{gif,png}',
            './chrome/**/*', '!./chrome/manifest.json' ])
        .pipe(gulp.dest('./build/chrome/'));
    var js = gulp.src([ './build/betterdgg.js', './build/injected.js' ])
        .pipe(gulp.dest('./build/chrome/'));
    return merge(assets, js);
});

gulp.task('chrome:zip', [ 'chrome' ], function() {
    gulp.src('./build/chrome/**/*')
        .pipe(zip('betterdgg-chrome.zip'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('firefox:manifest', [ 'chrome:manifest' ], function() {
    return gulp.src('./build/chrome/manifest.json')
        .pipe(gulp.dest('./build/firefox/'));
});

gulp.task('firefox', [ 'firefox:css', 'chrome' ], function() {
    return gulp.src([ './build/chrome/**/*', '!./build/chrome/betterdgg.css' ])
        .pipe(gulp.dest('./build/firefox/'));
});

gulp.task('firefox:xpi', [ 'firefox' ], function() {
    gulp.src('./build/firefox/**/*')
        .pipe(zip('betterdgg-firefox.xpi'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('safari:plist', function() {
    return gulp.src('./safari/Info.plist')
        .pipe(map(function(code) {
            var obj = plist.parse(code.toString());
            obj.CFBundleVersion = package.version;
            obj.CFBundleShortVersionString = package.version.replace(/^(\d+\.\d+)\..*/, '$1');
            return plist.build(obj);
        }))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
});

gulp.task('safari', [ 'safari:css', 'safari:plist', 'webpack' ], function() {
    var assets = gulp.src([ './betterdgg/**/*.{gif,png}',
            './safari/**/*', '!./safari/inject.js', '!./safari/Info.plist' ])
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    var js = gulp.src([ './build/betterdgg.js', './safari/inject.js', './build/content.js' ])
        .pipe(concat('betterdgg.js'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
    merge(assets, js).on('end', function() {
        console.log('Open ./dist/betterdgg.safariextension in Safari Extension Builder'
            + ' to dist Safari extension');
    });
});
