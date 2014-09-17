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
        }
    });

    grunt.loadNpmTasks('grunt-vulcanize');

    grunt.registerTask('default', ['vulcanize']);
};
