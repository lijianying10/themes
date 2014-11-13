
module.exports = function (grunt) {
    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Init GRUNT configuraton
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'less': {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "templates/default/theme.css": "src/less/default.less"
                }
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
                    base: './templates'
                },
                src: "**"
            }
        }
    });

    grunt.registerTask('build', [
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