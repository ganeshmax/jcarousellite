module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/*!<%= "\\n" %>' +
                ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
                '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %><%= "\\n" %>' +
                ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' +
                ' (<%= _.pluck(pkg.licenses, "url").join(", ") %>)<%= "\\n" %>' +
                '*/' +
                '<%= "\\n\\n" %>'
        },

        uglify: {
            all: {
                files: {
                    'src/jquery.jcarousellite.min.js': ['src/jquery.jcarousellite.js']
                }
            },
            options: {
                preserveComments: false,
                banner: '<%= meta.banner %>',
                compress: {
                    drop_console: true
                }
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'jcarousellite-demo.zip'
                },
                files: [{
                    expand: true,   // Set this to enable CWD below
                    cwd: 'demo/',   // Change directory to demo/
                    src: ['**/*'],  // Take all files and folders and sub-folders from the CWD
                    dest: '/'       // Create ZIP file in /
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('demo', ['compress']);
};

