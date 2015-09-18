// Note: The use of gulp-browserify has been refactored out, per the article at
//            https://medium.com/@sogko/gulp-browserify-the-gulp-y-way-bb359b3f9623
//	      and https://github.com/substack/node-browserify/issues/1198
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var through2 = require('through2')
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');


gulp.task('browserify', function () {

	gulp.src('./src/main.js')
		.pipe(plumber())
		//instead of using the blacklisted and unmaintained gulp-browserify, we'll run browserify using through2
	    .pipe(through2.obj(function (file, enc, next){
	            browserify(file.path, {'debug': true})
	                .transform('reactify')
	                .bundle(function(err, res){
	                    file.contents = res;
	                    next(null, file);
	                });
	        }))
 	  	.pipe(concat('main.js'))
	    .pipe(gulp.dest('public'))
});

gulp.task('default', ['browserify']);

gulp.task('watch', function () {
  gulp.watch('src/**/*.*', ['default']);
});
