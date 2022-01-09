const {src, dest, series, parallel, watch} = require('gulp')    // gulp
      sass = require('gulp-sass')(require('sass'))              // sass compiller 
      cleanCSS = require('gulp-clean-css')                      // minify css
      rename = require('gulp-rename')                           // rename files (.min)
      uglify = require('gulp-uglify')                           // minify js
      babel = require('gulp-babel')                             // new version js to old
      del = require('del')                                      // delete dist dirrectory
      sourcemaps = require('gulp-sourcemaps')                   // sourcemap for easly debugging
      autoprefixer = require('gulp-autoprefixer')               // auto css prefixes for others brousers
      browserSync = require('browser-sync').create()            // autoreload page

// paths to files //
const path = {
    style: {
        src: 'src/style/**/*.scss',
        dest: 'dist/style/'
    },
    script: {
        src: 'src/script/**/*.js',
        dest: 'dist/script/'
    },
    index: {
        src: 'src/index.html',
        dest: 'dist/'
    }
}


// browser-sync server //
function webServer() {
    browserSync.init({
        server: {
            baseDir: './dist',
            notify: false
        }
    });
}

// dist cleaner //
function clean() {
    return del(['dist'])
}

// style's compiller //
function style() {
    return src(path.style.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.style.dest))
        .pipe(browserSync.stream())
}

// script's compiller //
function script() {
    return src(path.script.src)
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/env']
    }))
      .pipe(uglify())
      .pipe(rename({
        basename: 'main',
        suffix: '.min'
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest(path.script.dest))
      .pipe(browserSync.stream())
}

// index compiller //
function index() {
    return src(path.index.src)
      .pipe(sourcemaps.init())
      .pipe(dest(path.index.dest))
      .pipe(browserSync.stream())
}

// gulp watcher //
function watcher() {
    watch(path.style.src, style).on('change', browserSync.reload);
    watch(path.script.src, script).on('change', browserSync.reload);
    watch(path.index.src, index).on('change', browserSync.reload);
}

// build a project //
const build = series(clean, style, script, index, parallel(webServer, watcher))


// exports //
exports.style = style
exports.script = script
exports.index = index
exports.clean = clean
exports.watcher = watcher
exports.webServer = webServer
exports.build = build
exports.default = build
