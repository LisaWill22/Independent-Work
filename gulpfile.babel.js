'use strict';

const gulp    = require('gulp');
const install = require('gulp-install');
const less    = require('gulp-less');
const concat  = require('gulp-concat');
const minify  = require('gulp-minify-css');
const watch   = require('gulp-watch');
const jshint  = require('gulp-jshint');
const del     = require('del');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const runSequence = require('gulp-run-sequence');
const bable   = require('gulp-babel');
const csscomb = require('gulp-csscomb');
const changedInPlace = require('gulp-changed-in-place');
const beautify = require('gulp-beautify');
const autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();

var PATHS = {
    HTML: './client/**/*.html',
    LESS: './client/stylesheets/less/**/*.less',
    LESSIMPORT: './client/stylesheets/less/imports.less',
    CSS: './client/stylesheets',
    JS: './client/js/**/*.js',
    BOWER_COMPONENTS: '!./client/bower_components',
    DIST: './client/dist'
}

gulp.task('install', () => {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(plumber())
        .pipe(install());
});

gulp.task('clean', () => {
    del(['./client/stylesheets/style.css']);
});

gulp.task('clean-build', () => {
    del([PATHS.DIST]);
});

gulp.task('js', () => {
    return gulp.src([PATHS.JS])
            .pipe(plumber())
            .pipe(changedInPlace({ firstPass: true }))
            .pipe(beautify({ lookup: true }))
            .pipe(jshint('.jshintrc'))
            .pipe(plumber.stop())
            .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:3000',
        files: [ PATHS.JS ]
    });
});

gulp.task('csscomb', () => {
    return gulp.src(PATHS.LESS)
        .pipe(plumber())
        .pipe(changedInPlace())
        .pipe(csscomb())
        .pipe(plumber.stop())
        .pipe(browserSync.stream());
});

// TODO: Get this working
gulp.task('beautify', () => {
    return gulp.src(PATHS.JS)
        .pipe(plumber())
        .pipe(changedInPlace())
        .pipe(beautify())
        .pipe(gulp.dest(PATHS.JS))
        .pipe(plumber.stop())
});

gulp.task('less', () => {
    return gulp.src(PATHS.LESSIMPORT)
            .pipe(plumber())
            .pipe(less())
            .pipe(concat('style.css'))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(minify())
            .pipe(plumber.stop())
            .pipe(gulp.dest('./client/stylesheets'))
            .pipe(browserSync.stream());
});

gulp.task('reload', () => {
    browserSync.reload();
});

gulp.task('dev', () => {
    runSequence(
        'less',
        'js',
        'browser-sync'
    );
});

gulp.task('build', () => {
    runSequence(
        'clean-build',
        'less-build',
        'js-build',
        'templates-build',
        'copy-assets',
    )
});

function logFileChange(event) {
    console.log('File ' + event.path + ' was ' + event.type);
}

gulp.task('default', ['dev'], () => {

    // Set up some basic watchers and log file changes
    gulp.watch(PATHS.LESS, ['less', 'csscomb']).on('change', logFileChange);
    gulp.watch(PATHS.JS, ['js', 'beautify']).on('change', logFileChange);
    gulp.watch(PATHS.HTML, ['reload']).on('change', logFileChange);

    // Set up nodemon to watch server.js files
    nodemon({
        script: 'server.js',
        ignore: 'client',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });
});
