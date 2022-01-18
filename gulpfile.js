// plugins //

const {src, dest, series, parallel, watch} = require('gulp')    // gulp
      sass = require('gulp-sass')(require('sass'))              // sass compiller 
      htmlmin = require('gulp-htmlmin')                         // minify html
      uglify = require('gulp-uglify')                           // minify js
      rename = require('gulp-rename')                           // rename files (.min)
      babel = require('gulp-babel')                             // new version js to old
      del = require('del')                                      // delete dist dirrectory
      sourcemaps = require('gulp-sourcemaps')                   // sourcemap for easly debugging
      autoprefixer = require('gulp-autoprefixer')               // auto css prefixes for others brousers
      browserSync = require('browser-sync').create()            // autoreload page
      concat = require('gulp-concat')                           // concat all files in one
      imagemin = require('gulp-imagemin')                       // images compressor
      newer = require('gulp-newer')                             // compress only new files

// paths to files //
const path = {
    style: {
        src: 'src/style/**/main.scss',
        dest: 'dist/style/'
    },
    script: {
        src: 'src/script/**/*.js',
        dest: 'dist/script/'
    },
    index: {
        src: 'src/index.html',
        dest: 'dist/'
    },
    img: {
        src: 'src/img/*',
        dest: 'dist/img/'
    }
}


// dist cleaner //
function clean() {
    return del(['dist/*', '!dist/img'])
}

// style's compiller //
function style() {
    return src(path.style.src)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
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
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.script.dest))
        .pipe(browserSync.stream())
}

// index compiller //
function index() {
    return src(path.index.src)
        .pipe(sourcemaps.init())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest(path.index.dest))
        .pipe(browserSync.stream())
}

// image compiller //
function img() {
    return src(path.img.src)
        .pipe(newer(path.img.dest))
        .pipe(imagemin())
        .pipe(dest(path.img.dest))
}

// gulp watcher //
function watcher() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    watch(path.style.src, style).on('change', browserSync.reload);
    watch(path.script.src, script).on('change', browserSync.reload);
    watch(path.index.src, index).on('change', browserSync.reload);
}

// build a project //
const build = series(
    clean,
    parallel(style, script, index, img),
    watcher
)


// exports //
exports.style = style
exports.script = script
exports.index = index
exports.img = img
exports.clean = clean
exports.watcher = watcher
exports.build = build
exports.default = build
