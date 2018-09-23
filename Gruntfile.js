const path = require( 'path' );


module.exports = function ( grunt ) {
    var root = './';
    var dest = './release/<%= pkg.name %> <%= pkg.version %>/';

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        // typescript
        ts: {
            release: {
                src: [ root + 'scripts/*.ts' ],
                dest: 'temp/code.js',
                options: {
                    target: 'es5',
                    sourceMap: false
                }
            }
        },

        // delete the destination folder
        clean: {
            release: [
                dest
            ]
        },

        // copy the images and libraries files
        copy: {
            dev: {
                expand: true,
                cwd: path.join( root, 'node_modules/easeljs/lib/' ),
                src: 'easeljs.min.js',
                dest: path.join( root, 'libraries/' )
            },
            release: {
                expand: true,
                cwd: root,
                src: [
                    'images/*.png',
                    'libraries/**',
                    'background.js',
                    'manifest.json'
                ],
                dest: dest
            }
        },

        // minimize the javascript
        uglify: {
            release: {
                files: [ {
                    src: 'temp/code.js',
                    dest: dest + 'min.js'
                } ]
            }
        },

        cssmin: {
            release: {
                files: [ {
                    expand: true,
                    cwd: root + 'css/',
                    src: '*.css',
                    dest: dest + 'css/'
                } ]
            },
            options: {
                advanced: false
            }
        },

        processhtml: {
            release: {
                files: [ {
                    expand: true,
                    cwd: root,
                    src: 'index.html',
                    dest: dest
                } ]
            }
        }
    } );

    // load the plugins
    grunt.loadNpmTasks( 'grunt-ts' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
    grunt.registerTask( 'dev', [ 'copy:dev' ] );
    grunt.registerTask( 'build', [ 'clean', 'ts', 'copy:release', 'uglify', 'cssmin', 'processhtml' ] );
};
