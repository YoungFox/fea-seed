require('./banner.css');
var dot = require('../../lib/doT.js');
class Banner{
	constructor(title){
		this.title = title;
	}
	ini(){
		var tpl = require('./tpl');
		// console.log(tpl);
		var tplFn = dot.template(tpl);
		var bannerHtml = tplFn({title:this.title});
		// console.log(bannerHtml);
		$('body').append(bannerHtml);
	}
};
module.exports = Banner;