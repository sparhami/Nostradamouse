module.exports = function(grunt) {

    grunt.initConfig({
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },

            unit: {

            },

            build: {
                singleRun: true,
                reporters: ['coverage'],
                preprocessors: {
                    '**/src/**/*.js': 'coverage'
                }
            }
        },

        jshint: {
            build: [
                'gruntfile.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('unit', ['karma:unit']);
    grunt.registerTask('build', ['jshint:build', 'karma:build']);
};
