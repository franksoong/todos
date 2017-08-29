import del from "del";
import path from "path";
import gulp from "gulp";
import open from "open";
import rename from 'gulp-rename'
import gulpLoadPlugins from "gulp-load-plugins";
import runSequence from "run-sequence";
import webpack from "webpack";
import webpackDevConfig, {publicPath as devPublicPath} from "./webpack.config.dev";
import webpackProdConfig, {publicPath as prodPublicPath}  from "./webpack.config.prod";
import WebpackDevServer from "webpack-dev-server";
import build from "./tools/build";
import prodServer from "./tools/prodServer";
import devServer from "./tools/devServer";



const $ = gulpLoadPlugins({ camelize: true });

const dev = webpackDevConfig.output.path;
const prod = webpackProdConfig.output.path;
const devPub = path.join(path.basename(dev), devPublicPath);
const prodPub = path.join(path.basename(prod), prodPublicPath);


// Main tasks
gulp.task('dev', () => runSequence('dev:start'));
gulp.task('dist', () => runSequence('dist:build', 'dist:index', 'dist:start'));
gulp.task('clean', ['dist:clean', 'dev:clean']);
gulp.task('open', () => open('http://localhost:3000'));

// For dev
gulp.task('dev:clean', cb => del(dev, { dot: true }, cb));


//// webpack build
gulp.task('dev:build', ['dev:clean'], cb => {
    return build('dev', cb);
});

//// Copy our index file and inject css/script imports for this build
gulp.task('dev:index', () => {
    // Build the index.html using the names of compiled files
    return gulp.src('src/index.html')
        .pipe($.injectString.after('<!-- inject:app:js -->', '<script src="static/bundle.js"></script>'))
        .on("error", $.util.log)
        .pipe(gulp.dest(dev));
});

//// Copy static files across to our final directory
gulp.task('dev:static', () =>
    gulp.src([
        'src/static/**'
    ])
    .pipe($.changed(dev))
    .pipe(gulp.dest(dev))
    .pipe($.size({ title: 'static' }))
);

//// Start a livereloading development server
gulp.task('dev:start',['dev:index', 'dev:static'], cb => {
    return devServer(cb);
});


// For dist
gulp.task('dist:clean', cb => del([prod], { dot: true }, cb));

//// webpack build
gulp.task('dist:build', ['dist:clean'], cb => {
    return build('prod', cb);
});

//// Copy our index file and inject css/script imports for this build
gulp.task('dist:index', () => {
    // TODO
    /*
    const pub = path.join(path.basename(prod), prodPublicPath);
    const app = gulp
        .src(["*.{css,js}"], { cwd: prod })
        .pipe(gulp.dest(pub));

    // Build the index.html using the names of compiled files
    return gulp.src('src/index.html')
        .pipe($.inject(app, {
            ignorePath: path.basename(prod),
            starttag: '<!-- inject:app:{{ext}} -->'
        }))
        .on("error", $.util.log)
        .pipe(gulp.dest(prod));
    */
});


//// Copy static files across to our final directory
gulp.task('dist:static', () =>
    gulp.src([
        'src/static/**'
    ])
    .pipe(gulp.dest(prod))
    .pipe($.size({ title: 'static' }))
);


//// Create a distributable package
gulp.task('dist:start', ['dist:static'], cb => {
    return prodServer(cb);
});
