/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */ \n',
    // Task configuration.
    concat: {
      'dist': {
        files: {
          'dist/resources/js/investr-game.js': ['<banner:meta.banner>', 'resources/js/investr/*.js'],
          'dist/admin/resources/js/investr-admin.js': ['<banner:meta.banner>', 'admin/resources/js/*.js'],
          'dist/index.html': ['html/head_dist.html', 'html/body.html'],
          'dist/pwreset.html': ['html/pwreset_dist.html', 'html/pwreset_body.html'],
          'dist/admin/index.html': ['html/admin_head_dist.html', 'html/admin_body.html']
        }
      },
      'devel': {
        files: [
          {dest: 'index.html', src: ['html/head_devel.html', 'html/body.html']},
          {dest: 'pwreset.html', src: ['html/pwreset_devel.html', 'html/pwreset_body.html']},
          {dest: 'admin/index.html', src: ['html/admin_head_devel.html', 'html/admin_body.html']}
        ]
      }
    },
    copy: {
      dist: {
        files: {
          "dist/": [
            "api/admin/**",
            "api/controllers/**",
            "api/db/**",
            "api/etc/config.ini.sample",
            "api/lib/**",
            "api/models/**",
            "api/index.php",
            "api/sample.htaccess",
            "epiphany/src/**",
            "resources/bootstrap/js/bootstrap.min.js",
            "resources/bootstrap/css/*.min.css",
            "resources/bootstrap/img/*",
            "resources/bootstrap/fonts/*",
            "resources/bootstrap-growl/*.min.js",
            "resources/js/accounting.js",
            "resources/js/bootbox.min.js", 
            "resources/js/jquery.1.7.2.min.js", 
            "resources/js/jquery.validate.min.js",
            "resources/js/json2.js",
            "resources/js/knockout.js", 
            "resources/js/sammy-latest.min.js",
            "resources/js/log4javascript.js", 
            "resources/js/mylogger.js",
            "resources/images/*"
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: [
          {src: 'dist/resources/js/investr-game.js', dest: 'dist/resources/js/<%= pkg.name %>.min.js'},
          {src: 'dist/admin/resources/js/investr-admin.js', dest: 'dist/admin/resources/js/investr-admin.min.js'}
        ]
      }
    },
    less: {
      'default': {
        files: [
          { "dist/resources/css/<%= pkg.name %>.css": "resources/css/investr.less" },
          { "dist/admin/resources/css/investr-admin.css": "admin/resources/css/investr-admin.less" }
        ]
      }
    },
    jshint: {
      files: ['grunt.js', 'resources/js/investr/*.js', 'resources/js/pwreset/*.js', 'admin/resources/js/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          $: false,
          jQuery: false,
          ko: false,
          accounting: false,
          log: false,
          bootbox: false
      //    jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['resources/js/investr/*.js', 'resources/js/pwreset/*.js', 'admin/js/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      },
      concat: {
        files: 'html/*.html',
        tasks: ['concat']
      }
    },
    clean: {
      options: { 'no-write': false },
      //src: ['<%= pkg.name %>.*.tgz']
      src: ['*.tgz', 'index.html', 'pwreset.html', 'admin/index.html']
    },
		compress: {
      main: {
        options: {
          archive: "<%= pkg.name %>-<%= pkg.version %>.tgz",
          mode: 'tgz'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ["**"],
          dest: 'investr-game/'
        }]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'copy', 'less', 'uglify', 'compress']);
	grunt.registerTask('devel', ['jshint', 'qunit', 'concat:devel']);

};
