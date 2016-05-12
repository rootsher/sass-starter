var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');

var config = {
	__sassDirectory: './scss',
	__cssDirectory: './css',
	__sassFileMatch: '**/*.scss',
	__sassCompile: {
		options: {
			outputStyle: 'compressed'
		}
	},
	__autoPrefixer: {
		options: {
			browsers: [ 'last 2 versions' ],
			safe: true,
			cascade: false
		}
	},
	__sassMainFile: 'style.scss'
};

gulp.task('sass:compile', function () {
	return gulp.src(path.resolve(config.__sassDirectory, config.__sassMainFile), { 'base': config.__sassDirectory })
		.pipe(sourcemaps.init())
		.pipe(sass(config.__sassCompile.options).on('error', sass.logError))
		.pipe(autoprefixer(config.__autoPrefixer.options))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.__cssDirectory));
});

gulp.task('sass:watch', function () {
	gulp.watch(path.resolve(config.__sassDirectory, config.__sassFileMatch), [ 'sass:compile' ]);
});

gulp.task('default', [ 'sass:compile', 'sass:watch' ]);
