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

// Copy themes to output
gulp.task('themes-copy', function() {
    return gulp.src([
        '**/*',
        '!**/*.less',
        '!node_modules/**/*'
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
    return runSequence('themes-clean', 'themes-copy', 'themes-css', cb);
});

// Clean themes output
gulp.task('themes-clean', function(cb) {
    del([
        path.join(buildOut, '**')
    ], cb);
});

// Compile less for themes
gulp.task('test', ['themes-build'], function() {
    exec('node server.js', function(err) {
        if (err) return cb(err);
        cb();
    });

    gulp.watch(filterLess, ['themes-css']);
    gulp.watch(filterHtml, ['themes-copy']);
});

// Default task
gulp.task('default', []);
