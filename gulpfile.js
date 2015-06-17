var _ = require("lodash");
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var exec = require('child_process').exec;

var THEMES = require("./list.json");
var pkg = require("./package.json");

// Folder
var buildOut = path.resolve(__dirname, 'build');

// Filters
var filterLess = ['**/*.less', '!node_modules/**/*.less'];
var filterHtml = ['**/*.html', '!node_modules/**/*.html'];

// Test server
var testServer;
process.on('exit', function(code) {
    if (testServer) testServer.kill(code);
});
process.on('uncaughtException', function() {
    if (testServer) testServer.kill(1);
});

// Copy themes to output
gulp.task('themes-copy', function() {
    return gulp.src([
        '**/*',
        '!**/*.less',
        '!node_modules/**/*',
        '!*.js',
        '!*.md'
    ]).pipe(gulp.dest(buildOut));
});

// Compile less for themes
gulp.task('themes-css', function() {
    return gulp.src(filterLess)
    .pipe(less({}))
    .pipe(gulp.dest(buildOut));
});


// Build themes
gulp.task('themes-build', function(cb) {
    return runSequence('themes-clean', 'themes-copy', ['themes-css', 'themes-packagejson'], cb);
});

// Clean themes output
gulp.task('themes-clean', function(cb) {
    del([
        path.join(buildOut, '**')
    ], cb);
});

// Write release-ready package.json
gulp.task('themes-packagejson', function(cb) {
    var _pkg = _.omit(pkg,
        'devDependencies',
        'scripts'
    );

    fs.writeFile(path.resolve(buildOut, 'package.json'), JSON.stringify(_pkg, null, 4), cb);
});

// Release a new version
gulp.task('release', ['themes-build'], function(cb) {
    exec('npm publish', {
        cwd: buildOut
    }, function(err) {
        if (err) return cb(err);
        cb();
    });
});

// Compile less for themes
gulp.task('test', ['themes-build'], function(cb) {
    testServer = exec('node server.js', function(err) {
        if (err) return cb(err);
        cb();
    });
    testServer.stdout.pipe(process.stdout);
    testServer.stderr.pipe(process.stderr);

    gulp.watch(filterLess, ['themes-css']);
    gulp.watch(filterHtml, ['themes-copy']);
});

// Default task
gulp.task('default', []);
