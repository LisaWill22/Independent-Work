var gulp    = require('gulp'),
    install = require('gulp-install'),
    less    = require('gulp-less'),
    concat  = require('gulp-concat'),
    minify  = require('gulp-minify-css'),
    watch   = require('gulp-watch'),
    del     = require('del');

gulp.task('install', function(){
    return gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});

gulp.task('clean', function(){
    del(['./client/stylesheets/style.css']);
});

gulp.task('less', function(){
    return gulp.src('./client/stylesheets/less/**/*.less')
            .pipe(less())
            .pipe(concat('style.css'))
            .pipe(minify())
            .pipe(gulp.dest('./client/stylesheets'));
});

gulp.task('default', ['less'], function(){
    var watcher = gulp.watch('./client/stylesheets/less/**/*.less', ['less']);
    watcher.on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type);
    });
});