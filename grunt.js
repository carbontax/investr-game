/*global module:false*/
module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-contrib');

	// Project configuration.
	grunt.initConfig({
	pkg: '<json:package.json>',
	meta: {
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
	},
	lint: {
		files: ['grunt.js', 'resources/js/investr/*.js', 'test/**/*.js']
	},
	qunit: {
		files: ['test/**/*.html']
	},
	concat: {
		dist: {
			// src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
			src: ['<banner:meta.banner>', 'resources/js/investr/*.js'],
			dest: 'dist/resources/js/<%= pkg.name %>.js'
		}
	},
	clean: {
		dist: 'dist'
	},
	copy: {
		dist: {
			files: {
				"dist/api/": [
					"api/admin/**",
					"api/controllers/**",
					"api/db/**",
					"api/etc/config.ini.sample",
					"api/lib/**",
					"api/models/**",
					"api/index.php",
					"api/sample.htaccess"],
				"dist/epiphany/src/": "epiphany/src/**",
				"dist/resources/bootstrap/js/": "resources/bootstrap/js/bootstrap.min.js",
				"dist/resources/bootstrap/css/": "resources/bootstrap/css/*.min.css",
				"dist/resources/bootstrap/img/": "resources/bootstrap/img/*",
				"dist/resources/bootstrap-growl/": "resources/bootstrap-growl/*.min.js",
				"dist/resources/js/": [
					"resources/js/accounting.js",
					"resources/js/bootbox.min.js", 
					"resources/js/jquery.1.7.2.min.js", 
					"resources/js/jquery.validate.min.js",
					"resources/js/json2.js",
					"resources/js/knockout-2.1.0.js", 
					"resources/js/log4javascript.js", 
					"resources/js/mylogger.js"],
				"dist/resources/images/": "resources/images/*"
			}
		}
	},
	less: {
		'default': {
			files: {
				"dist/resources/css/<%= pkg.name %>.css": "resources/css/investr.less"
			}
		}
	},
	min: {
		dist: {
			src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
			dest: 'dist/resources/js/<%= pkg.name %>.min.js'
		}
	},
	watch: {
		files: '<config:lint.files>',
//		tasks: 'lint qunit'
		tasks: 'devel'
	},
	jshint: {
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
			browser: true
		},
		globals: {
			$: false,
			jQuery: false,
			ko: false,
			accounting: false,
			log: false,
			bootbox: false
		}
	},
	targethtml: {
		'default': {
			src: 'index-src.html',
			dest: 'dist/index.html'
		},
		'devel': {
			src: 'index-src.html',
			dest: 'index.html'
		}
	},
	uglify: {},
		compress: {
			options: {
				rootDir: "investr-game"
			},
			tgz: {
				files: {
					"<%= pkg.name %>-<%= pkg.version %>.tgz": "dist/**"
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'clean lint qunit concat min targethtml copy less compress');
	grunt.registerTask('devel', 'lint qunit targethtml');

};
