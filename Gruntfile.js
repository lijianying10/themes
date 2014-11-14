var THEMES = require("./list.json");
var _ = require("lodash");

module.exports = function (grunt) {
    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');

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
        'watch': {
            'less': {
                files: ['**/*.less'],
                tasks: [
                    'build'
                ],
                options: {
                    spawn: false
                },
            },
        },
        'gh-pages': {
            'builds': {
                options: {
                    base: './themes'
                },
                src: "**"
            }
        },
        'copy': {
            'themes': {
                src: _.map(THEMES, function(theme) {
                    return theme.id+"/**";
                }),
                dest: 'build/',
            },
        }
    });

    grunt.registerTask('build', [
        'bower-install-simple',
        'copy:themes',
        'less'
    ]);

    grunt.registerTask('publish', [
        'build',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'build',
        'watch'
    ]);
};