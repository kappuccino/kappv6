(function(){
	'use strict'

	const gulp = require('gulp')
	const browserSync = require('browser-sync').create()
	const gutil = require('gulp-util')
	const plumber = require('gulp-plumber')

	const webpackConfig = {
		entry: './src/js/site.js',
		output: {
			filename: 'bundle.js'
		},
		plugins: []
	}

	function reportChange(event){
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
	}

	// Static Server + watching scss/html files
	gulp.task('serve', ['sass', 'webpack'], function(){

		browserSync.init({
			proxy: 'kapp.dev',
			open: true,
			notify: false
		})

		gulp.watch("./src/**/*.scss", ['sass']) //.on('change', reportChange);
		gulp.watch("./src/**/*.js", ['webpack']) //.on('change', reportChange);

		gulp.watch('./*.html')
			.on('change', browserSync.reload)
			.on('change', reportChange)

		gulp.watch('./dist/js/bundle.js')
			.on('change', browserSync.reload)
			.on('change', reportChange)

	})

	gulp.task('sass', function() {
		const sass = require('gulp-sass')
		const sourcemaps = require('gulp-sourcemaps')
		const postcss = require('gulp-postcss')
		const autoprefixer = require('autoprefixer')
		const cssnano = require('cssnano')

		const postcss_tools = [
			autoprefixer({
				browsers: ['last 4 versions'],
				cascade: false
			}),
			cssnano({
				zindex: false
			})
		]


		gulp.src('./src/**/*.scss')
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(postcss(postcss_tools))
			.pipe(gulp.dest('dist'))
			.pipe(browserSync.stream())
			.pipe(sourcemaps.write('./maps'))

	})

	gulp.task('webpack', function(){
		const webpack = require('webpack-stream')

		return gulp.src('src/js/site.js')
			.pipe(plumber())
			.pipe(webpack(webpackConfig))
			.pipe(gulp.dest('dist/js'))
	})

	gulp.task('webpack:prod', function(callback){
		const webpack = require('webpack-stream')
		const webpack2 = require('webpack')
		const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

		const myConfig = Object.create(webpackConfig);
		myConfig.plugins = myConfig.plugins.concat(
			new webpack2.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
			new UglifyJSPlugin()
		)

		return gulp.src('src/js/site.js')
			.pipe(plumber())
			.pipe(webpack(myConfig))
			.pipe(gulp.dest('dist/js'))

		// run webpack
		/*webpack(myConfig, function(err, stats) {
			if(err) throw new gutil.PluginError('webpack:build', err);

			gutil.log('[webpack:build]', stats.toString({
				colors: true
			}));

			callback();
		});*/

	})

	/*gulp.task('babel', function() {
		const babel = require('gulp-babel')
		const rename = require('gulp-rename')
		const pkg = getPackageJson()

		return gulp.src(['./!*.js', '!./!*-compiled.js'])
			.pipe(babel({
				presets: pkg.babel.preset
			}))
			//.pipe(rename("site-compiled.js"))
			.pipe(rename({
				suffix: "-compiled",
				extname: ".js"
			}))
			.pipe(gulp.dest('./'));
	})*/

}())

/*

const {resolve} = require('path')

module.exports = env => ({
	entry: {
		main: "./spider.js"
	},



	context: resolve(__dirname, 'src'),
	//devtool: env.prod ? 'source-map': 'eval',
	bail: env.prod,

	module: {
		loaders: [
			{test:/\.js$/, loader:'babel-loader', exclude:/node_modules/}
		]
	}
})

*/

