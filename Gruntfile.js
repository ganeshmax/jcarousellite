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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build', ['uglify']);
};

