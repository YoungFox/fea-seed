require('./banner.css');
let dot = require('../../lib/doT.js');
class Banner{
	constructor(title){
		this.title = title;
	}
	ini(){
		let tpl = require('./tpl');
		// console.log(tpl);
		let tplFn = dot.template(tpl);
		let bannerHtml = tplFn({title:this.title});
		// console.log(bannerHtml);
		$('body').append(bannerHtml);
	}
};
module.exports = Banner;
