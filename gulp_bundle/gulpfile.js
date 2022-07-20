'use strict';
let gulp = require('gulp');
let _sass = require('sass');
let sass = require('gulp-sass')(_sass);
let svgSprite = require('gulp-svg-sprite');
let autoprefixer = require('gulp-autoprefixer');
let uglify = require('gulp-uglify').default;
let rename = require('gulp-rename');
let merge = require('merge-stream');
let concat = require('gulp-concat');

const PATH = './'

const bundles = [
	{
		src: [
			PATH + 'js/libs/jquery-3.5.1.min.js',
			PATH + 'js/libs/lightslider.js'
		],
		bundleName: 'head.js'
	},

	{
		src: [
			PATH + 'js/libs/lazyload.js',
			PATH + 'js/pages/common.js'
		],
		bundleName: 'footer.js'
	},
	{
		src: [
			PATH + 'js/libs/datepicker.js',
			PATH + 'js/pages/form.js',
			PATH + 'js/pages/modal.js'
		],
		bundleName: 'modal.js'
	},
	{
		src: [
			PATH + 'js/pages/list.js',
			PATH + 'js/pages/index.js'
		],
		bundleName: 'index.js'
	},
	{
		src: [
			PATH + 'js/pages/list.js',
			PATH + 'js/pages/rubric.js'
		],
		bundleName: 'rubric.js'
	},
	{
		src: [
			PATH + 'js/pages/article.js',
		],
		bundleName: 'article.js'
	}
]


gulp.task('sass', function () {
	return gulp.src(PATH + 'sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 0.01%'],
			overrideBrowserslist:  ['> 0.01%'],
			cascade: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(PATH + 'css'))
});


gulp.task('sprite', function () {
	let config = require(PATH + 'i/sprites/svgconfig.json');
	let folders = ['colors', 'package', 'flags'];

	let tasks = folders.map(function(folder) {
		return gulp.src(PATH + 'i/sprites/' + folder + '/src/*.svg')
			.pipe(svgSprite(config[folder]))
			.pipe(gulp.dest(PATH + 'i/sprites/' + folder));
	});

	return merge(tasks);
});


gulp.task('js', function () {
	return merge(bundles.map(function (obj) {
		return gulp.src(obj.src, { allowEmpty: true })
			.pipe(concat(obj.bundleName))
			// .pipe(uglify())
			.pipe(gulp.dest(PATH + 'js/dist'));
	}));
});

gulp.task('watch', function () {
	gulp.watch(PATH + 'sass/**/*.scss', gulp.parallel('sass'));
	gulp.watch([PATH + 'js/**/*.js', '!' + PATH + 'js/dist/**'], gulp.parallel('js'));
});






