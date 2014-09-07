module.exports = function(grunt) {

    var banner = grunt.file.read('conf/banner.txt');
    var sources = grunt.file.readJSON('conf/sources.json');
    var karmaFiles = []
    .concat('bower_components/platform/platform.js')
    .concat(sources)
    .concat('test/unit/**/*.js');

    grunt.initConfig({
        karma: {
            options: {
                configFile: 'conf/karma.conf.js',
                files: karmaFiles
            },

            unit: {

            },

            build: {
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    '**/src/**/*.js': 'coverage'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            build: [
                'gruntfile.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        },

        concat: {
            options: {
                sourceMap: true
            },
            build: {
                src: sources,
                dest: 'build/nmouse.concat.js'
            }
        },

        uglify: {
            options: {
                wrap: 'nmouse',
                compress: {
                    global_defs: {
                        'DEBUG': false
                    },
                    dead_code: true
                }
            },

            build: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: 'build/nmouse.concat.js.map',
                    banner: banner
                },
                files: {
                    'nmouse.js': ['build/nmouse.concat.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('unit', ['karma:unit']);
    grunt.registerTask('bundle', ['concat:build', 'uglify:build']);
    grunt.registerTask('build', ['jshint:build', 'karma:build', 'bundle']);

    grunt.registerTask('default', ['build']);
};
