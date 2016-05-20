var gulp = require("gulp");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var myConfig = Object.create(webpackConfig);
// myConfig.devtool = "eval";
myConfig.debug = true;
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {


	/*
	*	想实现像react那样css更新，浏览器不刷新且样式生效的功能。
		貌似没什么好的方案啊，用browser-sync也有瑕疵。
		除非只监控css，才能做到不刷新浏览器，但是问题是JS，html改动就得不到监控了
		如果都监控，webpack --watch竟然是全量rebuild（说好的只build change呢？？？)
		经过验证，应该是修改css，会导致js部分模块change，从而触发gulp watch js
		这就导致无论改什么都会刷新页面
		谁有完美的解决方案，告诉我啊
	*
	*/

	var compiler = webpack(myConfig);

	//等同在terminal webpack -w
	compiler.watch({
		poll: true // use polling instead of native watchers
	}, function(err, stats) {

	});

	//启一个本地node服务
	browserSync.init({
		server: "./build",
		port: 8880
	});

	//监控各文件变化
	gulp.watch("dev/src/scss/*.scss", ['sass']);
	gulp.watch("build/static/css/*.css", function() {
		gulp.src("build/static/css/*.css")
			.pipe(browserSync.stream());
	});

	gulp.watch("build/static/js/*.js", function() {
		gulp.src("build/static/js/*.js")
			.pipe(browserSync.stream());
	});

	gulp.watch("build/*.html").on('change', function() {
		browserSync.reload();
	});
});

// 编译sass，并且无刷新在浏览器生效
gulp.task('sass', function() {
	//测试sass可以不刷新页面生效样式
	return gulp.src("dev/src/scss/*.scss")
		.pipe(sass())
		.pipe(gulp.dest("build/static/css"))
		.pipe(browserSync.stream());
});

// 默认task
gulp.task("default", ['sass', "serve"]);