let dot = require('../../lib/doT.js');
let css = require('./header.css');
let tpl = require('./tpl.js');
let d = require('./data.js');
// console.log($);
class Header{
	constructor(){
		this.title = d.title;
	}
	init(){
		let tplFn = dot.template(tpl);
		let html = tplFn(d);
		$('body').prepend(html);
	}
	show(){

	}
}

module.exports = Header;