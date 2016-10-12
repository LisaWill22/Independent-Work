var gulp    = require('gulp'),
    install = require('gulp-install'),
    less    = require('gulp-less'),
    concat  = require('gulp-concat'),
    minify  = require('gulp-minify-css'),
    watch   = require('gulp-watch'),
    jshint  = require('gulp-jshint'),
    del     = require('del'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber');
    runSequence = require('gulp-run-sequence');

var browserSync = require('browser-sync').create();

var PATHS = {
    HTML: './client/**/*.html',
    LESS: './client/stylesheets/less/**/*.less',
    LESSIMPORT: './client/stylesheets/less/imports.less',
    CSS: './client/stylesheets',
    JS: './client/js/**/*.js',
    BOWER_COMPONENTS: '!./client/bower_components'
}

gulp.task('install', function(){
    return gulp.src(['./bower.json', './package.json'])
        .pipe(plumber())
        .pipe(install());
});

gulp.task('clean', function(){
    del(['./client/stylesheets/style.css']);
});

gulp.task('js', function() {
    return gulp.src([PATHS.JS])
            .pipe(plumber())
            .pipe(jshint('.jshintrc'))
            .pipe(plumber.stop())
            .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost:3000',
        files: [ PATHS.JS ]
    });
});

gulp.task('less', function() {
    return gulp.src(PATHS.LESSIMPORT)
            .pipe(plumber())
            .pipe(less())
            .pipe(concat('style.css'))
            .pipe(minify())
            .pipe(plumber.stop())
            .pipe(gulp.dest('./client/stylesheets'));
});

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('dev', function() {
    runSequence(
        'less',
        'js',
        'browser-sync'
    );
});

function logFileChange(event) {
    console.log('File ' + event.path + ' was ' + event.type);
}

gulp.task('default', ['dev'], function(){
    // Set up some basic watchers and log file changes
    gulp.watch(PATHS.LESS, ['less']).on('change', logFileChange);
    gulp.watch(PATHS.JS, ['js']).on('change', logFileChange);
    gulp.watch(PATHS.HTML, ['reload']).on('change', logFileChange);
    // Set up nodemon to watch server.js files
    nodemon({
        script: 'server.js',
        ignore: 'client',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });
});
