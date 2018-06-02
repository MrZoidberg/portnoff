'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    browserSync = require("browser-sync"),
    changed = require('gulp-changed'),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    size = require('gulp-size'),
    uglify = require('gulp-uglify');

var path = {
    build: {
        html: 'build/',
        style: 'build/css/',
        css: 'build/css/',
        less: 'build/css/',
        fonts: 'build/fonts/',
        img: 'build/images/',
        js: 'build/js/',
        htaccess: 'build/'
    },
    src: {
        html: 'src/*.html',
        style: 'src/style/custom.scss',
        css: 'src/style/libs/*.css',
        less: 'src/style/less/*.less',
        fonts: 'src/fonts/*.*',
        img: 'src/images/**',
        js: 'src/js/*.js',
        htaccess: 'src/.htaccess'
    },
    watch: {
        html: 'src/**/*.html',
        style: 'src/style/**/*.scss',
        css: 'src/style/libs/*.css',
        less: 'src/style/less/*.less',
        fonts: 'src/fonts/*.*',
        img: 'src/images/**',
        js: 'src/js/**/*.js',
        htaccess: 'src/.htaccess'
    }
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "andriyanov_dmitriy"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('less:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(changed(path.build.img))
        .pipe(gulp.dest(path.build.img))
        .pipe(size({title: 'img'}))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('htaccess:build', function () {
    gulp.src(path.src.htaccess)
        .pipe(gulp.dest(path.build.htaccess))
});

gulp.task('build', [
    'html:build',
    'style:build',
    'css:build',
    'less:build',
    'fonts:build',
    'image:build',
    'js:build',
    'htaccess:build'
]);


gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.css], function (event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.less], function (event, cb) {
        gulp.start('less:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.htaccess], function (event, cb) {
        gulp.start('htaccess:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);