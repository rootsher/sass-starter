'use strict';

var path = require('path');
var _ = require('lodash');

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

/**
 *
 * @constructor
 */
function SASSStarter() {
	/**
     *
     * @type {Object}
     * @private
     */
    this._config = {};
}

/**
 *
 * @param {string} taskName
 * @param {Array} dependencies
 * @param {function} handler
 */
SASSStarter.prototype.addTask = function addTask(taskName, dependencies, handler) {
    if (!handler && _.isFunction(dependencies)) {
        handler = dependencies;
        dependencies = undefined;
    }

    dependencies = (dependencies || []);
    handler = (handler || function () {});

    if (!taskName) {
        throw new Error('Task requires a name.');
    }

    if (!_.isString(taskName)) {
        throw new Error('Task name must be a string.');
    }

    if (!_.isArray(dependencies)) {
        throw new Error('Dependencies must be an array of strings.');
    }

    if (dependencies.some(function (dependency) {
        return !_.isString(dependency);
    })) {
        throw new Error('Each dependency must be a string.');
    }

    if (!_.isFunction(handler)) {
        throw new Error('Handler must be a function.');
    }

    gulp.task(taskName, dependencies, handler.bind(this));
};

/**
 *
 * @param directory
 */
SASSStarter.prototype.setSASSDirectory = function setSASSDirectory(directory) {
    this._config.SASSDirectory = directory;
};

/**
 *
 * @param directory
 */
SASSStarter.prototype.setCSSDirectory = function setCSSDirectory(directory) {
    this._config.CSSDirectory = directory;
};

/**
 *
 * @param fileMatch
 */
SASSStarter.prototype.setSASSFileMatch = function setSASSFileMatch(fileMatch) {
    this._config.fileMatch = fileMatch;
};

/**
 *
 * @param options
 */
SASSStarter.prototype.setSASSCompileOptions = function setSASSCompileOptions(options) {
    this._config.SASSCompileOptions = options;
};

/**
 *
 * @param options
 */
SASSStarter.prototype.setAutoPrefixerOptions = function setSASSCompileOptions(options) {
    this._config.autoPrefiexerOptions = options;
};

/**
 *
 * @param fileName
 */
SASSStarter.prototype.setSASSMainFile = function setSASSMainFile(fileName) {
    this._config.SASSMainFile = fileName;
};


var SASSStarterInstance = new SASSStarter();

//NOTE: Configuration:
SASSStarterInstance.setSASSDirectory('./scss');
SASSStarterInstance.setCSSDirectory('./css');
SASSStarterInstance.setSASSFileMatch('**/*.scss');
SASSStarterInstance.setSASSCompileOptions({
    outputStyle: 'compressed'
});
SASSStarterInstance.setAutoPrefixerOptions({
    browsers: [ 'last 2 versions' ],
    safe: true,
    cascade: false
});
SASSStarterInstance.setSASSMainFile('style.scss');

SASSStarterInstance.addTask('sass:compile', function () {
    return gulp.src(path.resolve(this._config.SASSDirectory, this._config.SASSMainFile), { 'base': this._config.SASSDirectory })
        .pipe(sourcemaps.init())
        .pipe(sass(this._config.SASSCompileOptions).on('error', sass.logError))
        .pipe(autoprefixer(this._config.autoPrefiexerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(this._config.CSSDirectory));
});

SASSStarterInstance.addTask('sass:watch', function () {
    gulp.watch(path.resolve(this._config.SASSDirectory, this._config.fileMatch), [ 'sass:compile' ]);
});

SASSStarterInstance.addTask('default', [ 'sass:compile', 'sass:watch' ]);
