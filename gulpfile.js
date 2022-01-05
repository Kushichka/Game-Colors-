const gulp = require('gulp') // gulp
const sass = require('gulp-sass')(require('sass')) // sass compiller 
const cleanCSS = require('gulp-clean-css') // minify css
const rename = require('gulp-rename') // rename files (.min)
const uglify = require('gulp-uglify') // minify js
const babel = require('gulp-babel') // new version js to old
const del = require('del') // delete dist dirrectory
const sourcemaps = require('gulp-sourcemaps') // sourcemap for easly debugging
const autoprefixer = require('gulp-autoprefixer');

const path = { // paths to files
    style: {
        src: 'src/style/**/*.scss',
        dest: 'dist/style/'
    },
    script: {
        src: 'src/script/**/*.js',
        dest: 'dist/script/'
    }
}

function clean() { // dist cleaner
    return del(['dist'])
}

function style() { // style's compiller
    return gulp.src(path.style.src)
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
        .pipe(gulp.dest(path.style.dest))
}

function script() { // script's compiller
    return gulp.src(path.script.src)
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
      .pipe(gulp.dest(path.script.dest))
}

function watch() { // gulp watcher
    gulp.watch(path.style.src, style);
    gulp.watch(path.script.src, script);
}

const build = gulp.series(clean, gulp.parallel(style, script), watch) // build a project

exports.style = style
exports.script = script
exports.clean = clean
exports.watch = watch
exports.build = build
exports.default = build
