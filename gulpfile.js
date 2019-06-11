var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
  return gulp.src('app/sass/style.scss')
          .pipe(sass())
          .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
          .pipe(gulp.dest('app/css'))
          .pipe(browserSync.reload({stream: true}))
});

gulp.task('reloadMe', function(){
  return gulp.pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function(){
  gulp.watch('app/sass/**/*.scss', gulp.parallel('sass'));
  gulp.watch('app/**/*.html', gulp.parallel('sass'));
});

gulp.task('browser-sync', function(){
  browserSync({
    server:{
      baseDir: 'app'
    },
    notify: false
  })
});

gulp.task('prebuild' , async function(){
  var buildCss = gulp.src([
      'app/css/style.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', async function(){
  return del.sync('dist');
});

gulp.task('img', function(){
  return gulp.src('app/img/**/*')
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant]
    }))
    .pipe(gulp.dest('dist/img/author'));
})

gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass'));
