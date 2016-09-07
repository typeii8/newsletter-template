// Base Gulp File
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    useref = require('gulp-useref'),
    htmlmin = require('gulp-htmlmin'),    
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    path = require('path'),
    notify = require('gulp-notify'),
    del = require('del'),
    Promise = require('es6-promise').Promise;

// Task to compile SCSS
gulp.task('sass', function () {
  return gulp.src('./src/scss/*')
    .pipe(sass({ paths: [ path.join(__dirname, 'scss', 'includes') ]
    })
    .on('error', function(err) {
        this.emit('end');
      }))
    .on("error", notify.onError(function(error) {
      return "Failed to Compile SCSS: " + error.message;
    }))
    .pipe(gulp.dest('./src/css/'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({
    stream: true
  }))
    .pipe(notify("SCSS Compiled Successfully :)"));
});

// Task to compile LESS
gulp.task('less', function () {
  return gulp.src('./src/less/main.less')
    .pipe(less({ paths: [ path.join(__dirname, 'less', 'includes') ]
  })
  .on('error', function(err) {
    this.emit('end');
  }))
  .on("error", notify.onError(function(error) {
    return "Failed to Compile LESS: " + error.message;
  }))
  .pipe(gulp.dest('./src/css/'))
  .pipe(gulp.dest('./dist/css/'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(notify("LESS Compiled Successfully :)"));
});

// Task to move compiled CSS to `dist` folder
gulp.task('movecss', function () {
  return gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./dist/css/'));
});


// Task to prefix CSS with autoprefixer and minify CSS with cssnano 
gulp.task('cssmin', function() {
  return gulp.src('./src/css/*.css')
    .pipe(cssnano())
    .pipe(useref())
    .pipe(gulp.dest('./dist/css/'));
});


gulp.task('useref', function(){
  return gulp.src('./src/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// Task to Minify JS
gulp.task('jsmin', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});


// Minify Images
gulp.task('imagemin', function (){
  return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(imagemin({
    progressive: true,
    optimizationLevel: 6,
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./dist/img'));
});

//Copying Fonts to Dist
gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**/*')
  .pipe(gulp.dest('./dist/fonts'))
})

//Copying favicon to Dist
gulp.task('copy-favicon', function() {
  return gulp.src('./src/*.ico')
  .pipe(gulp.dest('./dist/'))
})

// BrowserSync Task (Live reload)
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './src/'
    },
  })
});

//minimizes HTML files.
gulp.task('htmlminify', function() {
  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist/'));
});

//Cleaning up generated files automatically
gulp.task('clean:dist', function() {
  return del.sync('dist');
})


// Gulp Watch Task
gulp.task('watch', ['browserSync'], function () {
   gulp.watch('./src/scss/**/*', ['sass']);
   gulp.watch('./src/less/**/*', ['less']);
   gulp.watch('./src/css/*').on('change', browserSync.reload);
   gulp.watch('./src/js/*').on('change', browserSync.reload);
   gulp.watch('./src/**/*.html').on('change', browserSync.reload);
   //gulp.watch('./src/**/*.php').on('change', browserSync.reload);
});

// Gulp Default Task
gulp.task('default', ['watch']);

// Gulp Build Task
gulp.task('build', function() {
  runSequence('clean:dist', 'cssmin', 'jsmin', 'htmlminify', 'imagemin', 'copy-favicon');
});