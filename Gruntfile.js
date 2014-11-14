var THEMES = require("./list.json");
var _ = require("lodash");
var pkg = require("./package.json");

module.exports = function (grunt) {
    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-file-creator');

    // Init GRUNT configuraton
    grunt.initConfig({
        'pkg': pkg,
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
                        'list.json'
                    ])
                    .value(),
                dest: 'build/',
            },
        },
        'clean': {
            'build': ["./build"]
        },
        'file-creator': {
            'package': {
                "build/package.json": function(fs, fd, done) {
                    fs.writeSync(fd, JSON.stringify({
                        name: pkg.name,
                        version: pkg.version,
                        author: pkg.author,
                        main: pkg.main
                    }, null, 4));
                    done();
                }
            }
        }
    });

    grunt.registerTask('build', [
        'bower-install-simple',
        'clean',
        'copy:themes',
        'file-creator:package',
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