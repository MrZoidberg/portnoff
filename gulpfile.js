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
    uglify = require('gulp-uglify'),
    favicons = require("favicons").stream,
    gutil = require("gulp-util"),
    robots = require('gulp-robots'),
    gtag = require('gulp-gtag'),
    minify = require('gulp-minify'),
    imagemin = require('gulp-imagemin'),
    instagram = require('instagram-node-lib');

var path = {
    build: {
        html: 'build/',
        index: 'build/index.html',
        style: 'build/css/',
        css: 'build/css/',
        less: 'build/css/',
        fonts: 'build/fonts/',
        img: 'build/images/',
        json: 'build/json/',
        js: 'build/js/',
        htaccess: 'build/',
        favicon: 'build/',
        robots: 'build/'
    },
    src: {
        html: 'src/*.html',
        index: 'src/index.html',
        style: 'src/style/custom.scss',
        css: 'src/style/libs/*.css',
        less: 'src/style/less/*.less',
        fonts: 'src/fonts/*.*',
        img: 'src/images/**/*.{png,jpg}',
        json: 'src/json/*.json',
        js: 'src/js/*.js',
        htaccess: 'src/.htaccess',
        favicon: 'src/logo.png'
    },
    watch: {
        html: 'src/**/*.html',
        style: 'src/style/**/*.scss',
        css: 'src/style/libs/*.css',
        less: 'src/style/less/*.less',
        fonts: 'src/fonts/*.*',
        img: 'src/images/**',
        json: 'src/json/*.json',
        js: 'src/js/**/*.js',
        htaccess: 'src/.htaccess',
        favicon: 'src/logo.png'
    }
};

instagram.set('client_id', '7a8dbf4a9be94b71b7f74196641c87b7');
instagram.set('client_secret', '8e33613557214694bf85b3b15a8db331 ');

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "andriyanov_dmitriy",
    instagram_user: 4112330147
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('html:build', function (done) {
    //TODO:
    //console.log(instagram.users.recent({ user_id: config.instagram_user }));

    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(gtag({uid: 'UA-12345678-1'}))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('style:build', function (done) {
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
    done();
});

gulp.task('less:build', function (done) {
    gulp.src(path.src.less)
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
        .pipe(gulp.dest(path.build.less))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('fonts:build', function (done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('image:build', function (done) {
    gulp.src(path.src.img)
        .pipe(changed(path.build.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(size({title: 'img'}))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('json:build', function (done) {
    gulp.src(path.src.json)
        .pipe(gulp.dest(path.build.json))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('js:build', function (done) {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(minify({
            ext:{
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('css:build', function (done) {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('htaccess:build', function (done) {
    gulp.src(path.src.htaccess)
        .pipe(gulp.dest(path.build.htaccess));
    done();
});

gulp.task("favicon:build", function (done) {
    gulp.src(path.src.favicon).pipe(favicons({
        appName: "Portnof",
        appDescription: "Ателье Portnof",
        developerName: "Mikhail Merkulov",
        developerURL: "http://merkulov.me/",
        background: "#020307",
        url: "https://portnof.com.ua/",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        version: 1.0,
        logging: true,
        html: "views/favicon.html",
        pipeHTML: false,
        replace: false
    }))
    .on("error", gutil.log)
    .pipe(gulp.dest("build"));
    done();
});

gulp.task('robots:build', function (done) {
    gulp.src(path.src.index)
        .pipe(robots({
            useragent: '*'
        }))
        .pipe(gulp.dest(path.build.robots));
    done();
});

var build = gulp.series([
    'favicon:build',
    'html:build',
    'style:build',
    'css:build',
    'less:build',
    'fonts:build',
    'image:build',
    'json:build',
    'js:build',
    'htaccess:build',
    'robots:build', function(done) {    
        // task code here
        done();
    }
]);
gulp.task('build', build);


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
    watch([path.watch.json], function (event, cb) {
        gulp.start('json:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.htaccess], function (event, cb) {
        gulp.start('htaccess:build');
    });
    watch([path.watch.favicon], function (event, cb) {
        gulp.start('favicon:build');
    });
});

var def = gulp.series(['build', 'webserver', 'watch']);
gulp.task('default', def);