// var $ = require('./lib/jquery.js');
require("../css/style.css");
var dot = require('./lib/doT.js');
var headerIns = false;
$(window).on('click',function (){
	require.ensure('./components/header/header.js',function (){
		var header = require('./components/header/header.js');
		if(!headerIns){
			headerIns = new header();
			headerIns.init();
		}
	});
})
var Banner = require('./components/banner/banner');
var banner = new Banner('我是banner');
banner.ini();
console.log('入口');