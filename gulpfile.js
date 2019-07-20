const { src, dest, parallel, watch, series } = require('gulp');
const sass = require('gulp-sass');
const nodeSass = require('node-sass');
sass.compiler = nodeSass;
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rimraf = require('rimraf');
const connect = require('gulp-connect');

const copyGlobs = ['src/index.html', 'src/*.js', 'src/assets/**/*']
const copy = () => src(copyGlobs, {base: 'src'}).pipe(dest('dist'))
const watchCopy = () => watch(copyGlobs, (cb) => {copy(); connect.reload(); cb();});

const styles = () => {
  return src('src/*.scss')
  .pipe(sass())
  .on('error', sass.logError)
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(dest('dist'))
}
const watchCss = () => watch('src/*.scss', (cb) => {styles(); connect.reload(); cb();});
const clean = (cb)  => {
  rimraf('dist', cb);
};

const serve = (cb) => {
  connect.server({
    root: 'dist',
    livereload: true
  })
  cb();
};

exports.build = series(clean, parallel(copy, styles));
exports.start = series(
  parallel(serve, clean),
  parallel(copy, styles),
  parallel(watchCopy, watchCss)
);