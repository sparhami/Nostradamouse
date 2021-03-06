module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var sources = grunt.file.readJSON('conf/sources.json');
    var karmaFiles = []
    .concat('bower_components/platform/platform.js')
    .concat(sources)
    .concat('test/unit/**/*.js');

    grunt.initConfig({
        pkg: pkg,

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
                    banner: grunt.file.read('conf/banner.txt')
                },
                files: {
                    'build/nmouse.js': ['build/nmouse.concat.js']
                }
            }
        },

        copy: {
            dist: {
                nonull: true,
                expand: true,
                cwd: 'build/',
                src: ['nmouse.js', 'nmouse.js.map'],
                dest: 'dist/'
            }
        },

        connect: {
            all: {
                options: {
                    port: 9001,
                    base: '.'
                }
            }
        },

        mochaSelenium: {
            options: {
                useChaining: true
            },
            all: {
                src: ['test/functional/spec/**/*.js'],
                options: {
                    browserName: 'chrome'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-selenium');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('unit', ['karma:unit']);
    grunt.registerTask('functional', ['connect', 'mochaSelenium']);
    grunt.registerTask('bundle', ['concat:build', 'uglify:build']);
    grunt.registerTask('build', ['jshint:build', 'karma:build', 'bundle']);
    grunt.registerTask('dist', ['build', 'functional', 'copy:dist']);

    grunt.registerTask('default', ['build']);
};
