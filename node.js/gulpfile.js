var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var awsLambda = require('node-aws-lambda');
require('date-utils');

var config = require('./lambda-config.js');
var mainJsFile = config.functionName + ".js";
var dotEnvFile = '.env';

gulp.task('clean', function() {
  return del(['./dist', './dist.zip']);
});
 
gulp.task('js', function() {
  return gulp.src(mainJsFile)
    .pipe(gulp.dest('dist/'));
});

gulp.task('dotenv', function() {
  return gulp.src(dotEnvFile)
    .pipe(gulp.dest('dist/'));
});
 
gulp.task('node-mods', function() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}));
});
 
gulp.task('zip', function() {
  return gulp.src(['dist/**/*', '!dist/package.json', 'dist/.env'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});
 
gulp.task('upload', function(callback) {
  awsLambda.deploy('./dist.zip', config, callback);
});
 
gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['js', 'dotenv', 'node-mods'],
    ['zip'],
    ['upload'],
    callback
  );
});
