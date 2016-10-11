var gulp    = require('gulp'),
    install = require('gulp-install'),
    less    = require('gulp-less'),
    concat  = require('gulp-concat'),
    minify  = require('gulp-minify-css'),
    watch   = require('gulp-watch'),
    jshint  = require('gulp-jshint'),
    del     = require('del'),
    nodemon = require('gulp-nodemon');

var browserSync = require('browser-sync').create();
var runSequence = require('gulp-run-sequence');

var PATHS = {
    LESS: './client/stylesheets/less/**/*.less',
    LESSIMPORT: './client/stylesheets/less/imports.less',
    CSS: './client/stylesheets',
    JS: './client/**/*.js',
    BOWER_COMPONENTS: './client/bower_components'
}

gulp.task('install', function(){
    return gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});

gulp.task('clean', function(){
    del(['./client/stylesheets/style.css']);
});

gulp.task('js', function() {
    return gulp.src([PATHS.JS, '!' + PATHS.BOWER_COMPONENTS])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost:3000'
    });
});

gulp.task('less', function() {
    return gulp.src(PATHS.LESSIMPORT)
            .pipe(less())
            .pipe(concat('style.css'))
            .pipe(minify())
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

gulp.task('default', ['dev'], function(){
    var watcher = gulp.watch(PATHS.LESS, ['less']);
    gulp.watch(PATHS.JS, ['js'])
    nodemon({
        script: 'server.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });
    watcher.on('chdange', function(event){
        console.log('File ' + event.path + ' was ' + event.type);
    });
});
