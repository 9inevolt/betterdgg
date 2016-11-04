var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
var gulp    = require('gulp');
var clean   = require('gulp-clean');
var concat  = require('gulp-concat');
var run     = require('gulp-run');
var zip     = require('gulp-zip');
var merge   = require('merge-stream');
var map     = require('vinyl-map');
var source  = require('vinyl-source-stream');
var plist   = require('plist');
var webpack = require('webpack');
var jeditor = require('gulp-json-editor');

var package = require('./package.json');

var env = {
    dev: {
        webpack: './webpack.config',
        manifest: {
            version: package.version,
            version_name: 'development'
        }
    },
    prod: {
        webpack: './webpack.prod.config',
        manifest: {
            version: package.version
        }
    }
};

var config = env.dev;

gulp.task('env:prod', function() {
    config = env.prod;
});

gulp.task('default', [ 'chrome', 'firefox' ], function() {
});

gulp.task('prod', [ 'env:prod', 'chrome', 'firefox' ], function() {
});

gulp.task('dist', [ 'env:prod', 'chrome:zip', 'firefox:xpi' ], function() {
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

var extPath = function(scheme) {
    return map(function(code) {
        code = code.toString();
        return code.replace(rImages, '$1' + scheme + '://__MSG_@@extension_id__/$2');
    });
};

gulp.task('css', [ 'webpack' ], function() {
    var src = gulp.src('./build/betterdgg.css');
    var chrome = src.pipe(extPath('chrome-extension'))
        .pipe(gulp.dest('./build/chrome'));
    var firefox = src.pipe(extPath('moz-extension'))
        .pipe(gulp.dest('./build/firefox'));
    return merge(chrome, firefox);
});

gulp.task('safari:css', function() {
    return gulp.src('./betterdgg/*.css')
        .pipe(encode64)
        .pipe(concat('betterdgg.css'))
        .pipe(gulp.dest('./dist/betterdgg.safariextension/'));
});

gulp.task('webpack', function(done) {
    webpack(require(config.webpack)).run(function(err, stats) {
        if (err) {
            return done(err);
        } else if (stats.hasErrors()) {
            return done(stats.toString('errors-only'));
        }

        console.log(stats.toString());
        done();
    });
});

gulp.task('chrome:manifest', function() {
    return gulp.src('./chrome/manifest.json')
        .pipe(jeditor(config.manifest))
        .pipe(gulp.dest('./build/chrome/'));
});

gulp.task('firefox:manifest', [ 'chrome:manifest' ], function() {
    return gulp.src('./build/chrome/manifest.json')
        .pipe(jeditor(require('./firefox/manifest.json')))
        .pipe(gulp.dest('./build/firefox/'));
});

gulp.task('chrome', [ 'css', 'chrome:manifest', 'webpack' ], function() {
    var assets = gulp.src([ './chrome/**/*', '!./chrome/manifest.json', '!./chrome/**/*.js' ])
        .pipe(gulp.dest('./build/chrome/'));
    var images = gulp.src('./build/images/**/*.{gif,png,svg}')
        .pipe(gulp.dest('./build/chrome/images/'));
    var js = gulp.src([ './build/betterdgg.js', './build/injected.js' ])
        .pipe(gulp.dest('./build/chrome/'));
    var bg = gulp.src('./build/background.js')
        .pipe(gulp.dest('./build/chrome/lib/'));
    return merge(assets, images, js, bg);
});

gulp.task('chrome:zip', [ 'chrome' ], function() {
    gulp.src('./build/chrome/**/*')
        .pipe(zip('betterdgg-chrome.zip'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('firefox', [ 'chrome', 'firefox:manifest' ], function() {
    return gulp.src([ './build/chrome/**/*',
            '!./build/chrome/betterdgg.css',
            '!./build/chrome/manifest.json' ])
        .pipe(gulp.dest('./build/firefox/'));
});

gulp.task('firefox:xpi', [ 'firefox' ], function() {
    return run('mkdir -p ./dist && $(npm bin)/web-ext sign'
        + ' --source-dir ./build/firefox'
        + ' --artifacts-dir ./dist').exec();
});

gulp.task('safari:plist', function() {
    return gulp.src('./safari/Info.plist')
        .pipe(map(function(code) {
            var obj = plist.parse(code.toString());
            obj.CFBundleVersion = config.manifest.version;
            obj.CFBundleShortVersionString = config.manifest.version.replace(/^(\d+\.\d+)\..*/, '$1');
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
