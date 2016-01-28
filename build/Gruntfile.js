var PATH = require( 'path' );

module.exports = function( grunt )
{
var dest = '../release/<%= pkg.name %> <%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

            // delete the destination folder
        clean: {
            options: {
                force: true
            },
            release: [
                dest
            ]
        },

            // copy the images and libraries files
        copy: {
            release: {
                expand: true,
                cwd: '../',
                src: [
                    'images/orange_10px.png',
                    'images/red_apple_10px.png',
                    'libraries/**',
                    'manifest.json'
                ],
                dest: dest
            }
        },

        uglify: {
            release: {
                files: {
                    '../release/<%= pkg.name %> <%= pkg.version %>/min.js': [
                            // the order matters, since some classes inherit from others, so the base ones need to be defined first
                            // this is based on the order in index.html
                        '../scripts/utilities.js',
                        '../scripts/main.js',
                        '../scripts/snake.js',
                        '../scripts/tail.js',
                        '../scripts/food.js',
                        '../scripts/double_food.js',
                        '../scripts/wall.js',
                        '../scripts/game.js',
                        '../scripts/main_menu.js',
                        '../scripts/options.js',
                        '../scripts/timer.js',
                        '../scripts/interval.js',
                        '../scripts/message.js',
                        '../scripts/high_score.js'
                    ]
                }
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: '../css/',
                    src: 'style.css',
                    dest: PATH.join( dest, 'css' )
                }]
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: '../',
                    src: 'index.html',
                    dest: dest
                }]
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'clean', 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};
