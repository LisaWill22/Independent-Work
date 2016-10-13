// We all need to be a littler morer stricter
'use strict';

// Bring in all our gulp deps, one day these will line up
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
const templateCache = require('gulp-angular-templatecache');
const minifyHtml = require('gulp-minify-html');
const ngAnnotate = require('gulp-ng-annotate');

// Create an instance of browserSync
const browserSync = require('browser-sync').create();

// Definte the paths to our source files
const PATHS = {
    TEMPLATE_FILE: './client/templates.js',
    HTML: ['./client/js/**/*.html', './client/partials/**/*.html'],
    LESS: './client/stylesheets/less/**/*.less',
    LESSIMPORT: './client/stylesheets/less/imports.less',
    CSS: './client/stylesheets',
    JS: './client/js/**/*.js',
    BOWER_COMPONENTS: '!./client/bower_components',
    DIST: './client/dist'
}

// Installs dependencies. Not sure why is a thing, bu ok
gulp.task('install', () => {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(plumber())
        .pipe(install());
});

// Cleans out build folder ( ./client/dist )
gulp.task('clean-build', () => {
    del([PATHS.DIST]);
});

// Lints, and Reports our JS - only hits the file that changed
gulp.task('js', () => {
    return gulp.src([PATHS.JS])
            .pipe(plumber())
            .pipe(changedInPlace({ firstPass: true }))
            .pipe(jshint('.jshintrc'))
            .pipe(plumber.stop())
            .pipe(jshint.reporter('jshint-stylish'));
});

// Instantiates a browserSync server for us
gulp.task('browser-sync', () => {
    browserSync.init({
        notify: false,
        proxy: 'localhost:3000'
    });
});

// Cleans up our CSS by doing some auto format
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

// Compiles less, autoprefixes, thebn minifies and dumps into CSS
// - causes style injection via browserSync (what .stream() is for)
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

// Build out our angular template cache for better performance
gulp.task('templates', () => {
    return gulp.src(PATHS.HTML)
        .pipe(plumber())
        .pipe(minifyHtml())
        .pipe(templateCache('templates.js', {
            standalone: true,
            module: 'app.templates'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./client'));
});

// Reloads the instance of our browserSync server
gulp.task('reload', () => {
    browserSync.reload();
});

// Basic dev task that runs before default gulp task - `gulp`
gulp.task('dev', () => {
    runSequence(
        'less',
        'js',
        'browser-sync'
    );
});

// NOTE: NOT READY FOR USE
// Build task that runs before `serve-build` or `build`
/*
gulp.task('build', () => {
    runSequence(
        'clean-build',
        'less-build',
        'js-build',
        'templates-build',
        'copy-assets',
    )
});
*/

gulp.task('default', ['dev'], () => {

    // Set up some basic watchers and log file changes
    gulp.watch(PATHS.LESS, ['less', 'csscomb']).on('change', logFileChange);
    gulp.watch(PATHS.JS, ['js', 'beautify', 'reload']).on('change', logFileChange);
    gulp.watch(PATHS.HTML, ['templates']).on('change', logFileChange);
    gulp.watch(PATHS.TEMPLATE_FILE, ['reload']).on('change', logFileChange);

    // Set up nodemon to watch server.js files
    nodemon({
        script: 'server.js',
        ignore: 'client',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });
});


// HELPER FUNCITONS

function logFileChange(event) {
    console.log('File ' + event.path + ' was ' + event.type);
}
