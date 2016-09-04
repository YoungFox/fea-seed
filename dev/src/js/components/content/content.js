let dot = require('../../lib/doT.js');
let css = require('./content.css');
let tpl = require('./tpl.js');
let d = require('./data.js');
// console.log($);
class Content{
	constructor(detail){
		this.detail = detail;
	}
	ini(){
		let tpl = require('./tpl');
		// console.log(tpl);
		let tplFn = dot.template(tpl);
		let contentHtml = tplFn({detail:d.detail});
		$('body').append(contentHtml);
	}
};

module.exports = Content;
