const gulp = require('gulp');
const {
  watch,
  series
} = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();

// Merge HTML files
async function includeHTML() {
  return gulp.src(
      ['app/**/*.html',
        '!app/html_header.html', // ignore
        '!app/sidebar.html', // ignore
        '!app/footer.html' // ignore
      ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'));
}

// Reload Server
async function reload() {
  server.reload();
}

// Copy assets after build
async function copyAssets() {
  gulp.src(['app/**/*', '!app/**/*.html'])
    .pipe(gulp.dest('dist/'));
}

// Build files html and reload server
async function buildAndReload() {
  await includeHTML();
  await copyAssets();
  reload();
}

exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: 'dist'
    }
  });
  // Build and reload at the first time
  buildAndReload();
  // Watch task
  watch(["app"], series(buildAndReload));
};
