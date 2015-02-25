module.exports = function(grunt) {

    grunt.initConfig({
        vulcanize: {
            dist: {
                options: {
                    excludes: {
                        imports: [
                            "polymer.html"
                        ]
                    },
                    inline: true,
                    strip: true
                },
                files: {
                    'index.html': 'index-raw.html'
                },
            },
        },

        nmouse_deps: {
            options: {
                basePath: '.',
                outputPath: './deps.html'
            },
            files: 'components/**/*.html'
        }
    });

    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-nmouse-deps');

    grunt.registerTask('default', ['nmouse_deps', 'vulcanize']);
};
