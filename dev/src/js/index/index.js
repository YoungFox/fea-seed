require("../../css/style.css");
let dot = require('../lib/doT.js');
let headerIns = false;
$(window).on('click',function (){
	require.ensure('../components/header/header.js',function (){
		let header = require('../components/header/header.js');
		if(!headerIns){
			headerIns = new header();
			headerIns.init();
		}
	});
})
let Banner = require('../components/banner/banner');
let banner = new Banner('我是banner');
banner.ini();

let Content = require('../components/content/content');
let content = new Content();
content.ini();

console.log('index/index');
