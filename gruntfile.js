module.exports = function(grunt) {

    grunt.initConfig({
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            
            unit: {

            },
            
            build: {
                singleRun: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    
    grunt.registerTask('unit', ['karma:unit']);
}
