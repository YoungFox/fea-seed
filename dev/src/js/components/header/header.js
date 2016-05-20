var dot = require('../../lib/doT.js');
var css = require('./header.css');
var tpl = require('./tpl.js');
var d = require('./data.js');
// console.log($);
var Header= function (){
	this.title = d.title;
}

Header.prototype = {
	constructor: Header,
	init: function (){
		var tplFn = dot.template(tpl);
		var html = tplFn(d);
		$('body').append(html);
	},
	show: function (){

	}
}

module.exports = Header;