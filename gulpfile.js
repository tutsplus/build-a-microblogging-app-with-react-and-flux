var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');

gulp.task('browserify', function () {
  gulp.src('src/main.js')
    .pipe(plumber())
    .pipe(browserify({ transform: 'reactify', debug: true }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('default', ['browserify']);

gulp.task('watch', function () {
  gulp.watch('src/**/*.*', ['default']);
});
