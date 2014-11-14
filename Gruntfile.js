var THEMES = require("./list.json");
var _ = require("lodash");

module.exports = function (grunt) {
    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Init GRUNT configuraton
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'bower-install-simple': {
            options: {
                color:       true,
                production:  false,
                directory:   "vendors"
            }
        },
        'less': {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: _.chain(THEMES)
                    .map(function(theme) {
                        return [
                            "build/"+theme.id+"/style.css",
                            theme.id+"/style.less"
                        ];
                    })
                    .object()
                    .value()
            }
        },
        'gh-pages': {
            'builds': {
                options: {
                    base: './build'
                },
                src: "**"
            }
        },
        'copy': {
            'themes': {
                src: _.chain(THEMES)
                    .map(function(theme) {
                        return theme.id+"/**";
                    })
                    .concat([
                        'macros/**',
                        '!**/*.less',
                        'list.json',
                        'package.json'
                    ])
                    .value(),
                dest: 'build/',
            },
        },
        'clean': {
            'build': ["./build"]
        }
    });

    grunt.registerTask('build', [
        'bower-install-simple',
        'clean',
        'copy:themes',
        'less'
    ]);

    grunt.registerTask('publish', [
        'build',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};