const path = require( 'path' );


module.exports = function ( grunt ) {
    var root = './';
    var dest = './release/<%= pkg.name %> <%= pkg.version %>/';

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        // typescript
        ts: {
            release: {
                tsconfig: './tsconfig.json',
                passThrough: true,
                options: {
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
                    'css/**',
                    'images/*.png',
                    'libraries/**',
                    'scripts/*.js',
                    'index.html'
                ],
                dest: dest
            }
        },
    } );

    // load the plugins
    grunt.loadNpmTasks( 'grunt-ts' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );

    // tasks
    grunt.registerTask( 'dev', [ 'copy:dev' ] );
    grunt.registerTask( 'build', [ 'clean', 'ts', 'copy:dev', 'copy:release' ] );
};
