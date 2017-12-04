/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(0)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../node_modules/.6.0.0@sass-loader/lib/loader.js!./fields.scss", function() {
			var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../node_modules/.6.0.0@sass-loader/lib/loader.js!./fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.hook_ajax_msg = hook_ajax_msg;
exports.hook_ajax_csrf = hook_ajax_csrf;
exports.show_upload = show_upload;
exports.hide_upload = hide_upload;
/**
 * Created by zhangrong on 2016/8/6.
 */

/*
新增一个wrap函数，用户封装调用函数
*/

function def_proc_error(jqxhr) {
	if (!window.iclosed) {
		if (jqxhr.status != 0) {
			alert(jqxhr.statusText + ':code is;' + jqxhr.status + jqxhr.responseText);
		} else {
			alert('maybe server offline,error code is ' + jqxhr.status);
		}
		hide_upload();
	}
}

//window.__proc_port_error=def_proc_port_msg
window.__proc_ajax_error = def_proc_error;

function hook_ajax_msg(proc_port_error, proc_ajax_error) {
	if (proc_port_error) {
		window.__proc_port_error = proc_port_error;
	}
	if (proc_ajax_error) {
		window.__proc_ajax_error = proc_ajax_error;
	}
	if (window.hook_ajax_msg_mark) {
		return;
	}
	window.hook_ajax_msg_mark = true;
	$(window).bind('beforeunload', function () {
		window.iclosed = true;
	});

	//$(document).ajaxSuccess(function (event,data) {
	//    window.__proc_port_error(data,event)
	//})
	$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
		window.__proc_ajax_error(jqxhr);
	});
	//hook_ajax_csrf()
}

function hook_ajax_csrf() {
	// needed in django context,because django has csrf system enabled by default
	// used for fetch and generate CSRF code for POST ,used with django CSRF middleware
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === name + '=') {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	var csrftoken = getCookie('csrftoken');
	function csrfSafeMethod(method) {
		// these HTTP methods do not require CSRF protection
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
		);
	}
	$.ajaxSetup({
		beforeSend: function beforeSend(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
}

function show_upload() {
	$('#load_wrap').show();
}
function hide_upload(second) {
	if (second) {
		setTimeout(function () {
			$('#load_wrap').hide();
		}, second);
	} else {
		$('#load_wrap').hide();
	}
}

ex.load_css('/static/lib/font-awesome4.7/font-awesome4.7.min.css');
//if(!window.__font_awesome){
//	window.__font_awesome=true
//	document.write(`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">`)
//}

if (!window.__uploading_mark) {
	window.__uploading_mark = true;
	document.write('\n\t\t<style>\n\t\t._popup{\n\t\t\tposition: fixed;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\tbottom: 0;\n\t\t\tdisplay:none;\n\t\t\tz-index: 9000;\n\t\t}\n\t\t#_upload_inn{\n\t\t\tbackground: rgba(88, 88, 88, 0.2);\n\t\t\tborder-radius: 5px;\n\t\t\twidth:180px;\n\t\t\theight:120px;\n\t\t\tz-index: 9500;\n\t\t\t/*padding:30px 80px ;*/\n\t\t}\n\t\t.imiddle{\n\t\t    position: absolute;\n\t        top: 50%;\n\t        left: 50%;\n\t        transform: translate(-50%, -50%);\n\t        -ms-transform:translate(-50%, -50%); \t/* IE 9 */\n\t\t\t-moz-transform:translate(-50%, -50%); \t/* Firefox */\n\t\t\t-webkit-transform:translate(-50%, -50%); /* Safari \u548C Chrome */\n\t\t\t-o-transform:translate(-50%, -50%); \n\t\t\t\n\t        text-align: center;\n\t\t\t/*display: table;*/\n\t        z-index: 10000;\n    \t}\n    \t#_upload_mark{\n    \t\tfloat: left;\n\n    \t}\n\t\t</style>');
	$(function () {
		$('body').append('<div class="_popup" id="load_wrap"><div id=\'_upload_inn\' class="imiddle">\n\t\t<div  id="_upload_mark" class="imiddle"><i class="fa fa-spinner fa-spin fa-3x"></i></div></div></div>');
	});
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>->front/ckedit.rst>
==========
ckeditor
==========
源文件:vuejs/ckeditor.js

使用时，引入fields.pack.js即可。

使用示例
=========
::

	bus=new Vue()  //因为ckeditor的数据不是时时同步的，所以提交时，需要触发数据同步
	// 提交时:
	bus.$emit('sync_data')

	<ckeditor set='complex' config='{}'></ckeditor>

set
======

set是指预先定义好的一套设置。可以在Vue component中定义映射。

当前有的set有:

=========   ========
complex     完善
edit        普通编辑
=========   =========

<<<<
 */

var ck_complex = {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	toolbarGroups: [{ name: 'clipboard', groups: ['clipboard', 'undo'] }, { name: 'editing', groups: ['find', 'selection', 'spellchecker'] }, { name: 'links' }, { name: 'insert' }, { name: 'forms' }, { name: 'tools' }, { name: 'document', groups: ['mode', 'document', 'doctools'] }, { name: 'others' }, '/', { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] }, { name: 'styles' }, { name: 'font' }, { name: 'colors' }, { name: 'about' }],

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	removeButtons: 'Underline,Subscript,Superscript',

	// Set the most common block elements.
	format_tags: 'p;h1;h2;h3;pre',

	// Simplify the dialog windows.
	removeDialogTabs: 'image:advanced;link:advanced',
	image_previewText: 'image preview',
	imageUploadUrl: '/_face/ckeditor_upload_image',
	filebrowserImageUploadUrl: '/_face/ckeditor_upload_image', // Will be replace by imageUploadUrl when upload_image
	extraPlugins: 'justify,codesnippet,lineutils,mathjax,colorbutton,uploadimage,font,autogrow', //autogrow,
	mathJaxLib: 'https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent: 'img[class]',
	autoGrow_maxHeight: 600,
	autoGrow_minHeight: 200,
	autoGrow_onStartup: true,
	autoGrow_bottomSpace: 50
};

Vue.component('ckeditor', {
	template: '<div class=\'ckeditor\'>\n\t\t    \t<textarea class="form-control" name="ri" ></textarea>\n\t    \t</div>',
	props: {
		value: {},
		config: {},
		set: {
			default: 'edit'
		}
	},
	created: function created() {
		var self = this;
		if (!window.bus) {
			window.bus = new Vue();
		}
		bus.$on('sync_data', function () {
			self.$emit('input', self.editor.getData());
		});
	},
	mounted: function mounted() {
		var self = this;
		self.input = $(this.$el).find('textarea')[0];
		var config_obj = {
			//'complex':'//res.enjoyst.com/js/ck/config_complex.js',
			'complex': ck_complex,
			'edit': edit_level
		};
		var config = {};
		ex.assign(config, config_obj[self.set]);
		ex.assign(config, self.config);
		// 4.5.10   4.6.2   ///static/lib/ckeditor4.6.2.js
		//
		ex.load_js('https://cdn.bootcss.com/ckeditor/4.6.2/ckeditor.js', function () {
			//CKEDITOR.timestamp='GABCDFDGff'
			//self.input.value=self.value

			var editor = CKEDITOR.replace(self.input, config);
			editor.setData(self.value);
			editor.checkDirty();
			self.editor = editor;

			//var is_changed=false
			//editor.on( 'change', function( evt ) {
			//	// getData() returns CKEditor's HTML content.
			//	is_changed=true
			//	//self.$emit('input',editor.getData())
			//});
			//
			//setInterval(function(){
			//	if(is_changed){
			//		self.$emit('input',editor.getData())
			//		is_changed=false
			//	}
			//},3000)
		});
	}
});

var edit_level = {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	toolbarGroups: [
	//{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
	//{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
	{ name: 'tools' },

	//'/',
	{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] }, { name: 'styles' }, { name: 'font' }, { name: 'colors' }, { name: 'links' }, { name: 'insert' }, { name: 'forms' }, { name: 'others' }, { name: 'document', groups: ['mode', 'document', 'doctools'] }],

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	removeButtons: 'Underline,Subscript,Superscript',

	// Set the most common block elements.
	format_tags: 'p;h1;h2;h3;pre',

	// Simplify the dialog windows.
	removeDialogTabs: 'image:advanced;link:advanced',
	image_previewText: 'image preview',
	imageUploadUrl: '/_face/ckeditor_upload_image',
	filebrowserImageUploadUrl: '/_face/ckeditor_upload_image', // Will be replace by imageUploadUrl when upload_image
	extraPlugins: 'justify,lineutils,colorbutton,uploadimage,font,autogrow', //,mathjax,codesnippet
	//mathJaxLib : '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent: 'img[class]',
	autoGrow_maxHeight: 600,
	autoGrow_minHeight: 200,
	autoGrow_onStartup: true,
	autoGrow_bottomSpace: 50
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.back_ops = back_ops;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
*
* 这个文件里面的东西不用了。
* 因为对象映射，牵涉到异步加载问题，只能用函数代替，结果调用方式不在优雅，
* 不如直接在前段写一个封装函数。见back_ops函数。
*
* 直接将后端操作对象暴露到前端
*
*
* bk_manager=new BackOps(myurl)
* bk_manager.call_some_method(function(resp){
*       do_something
*   }
* )
* */

var BackOps = exports.BackOps = function () {
    function BackOps(url) {
        _classCallCheck(this, BackOps);

        this.url = url;
        this.init_methods();
    }

    _createClass(BackOps, [{
        key: "init_methods",
        value: function init_methods() {
            var url = ex.appendSearch(this.url, { get_class: 1 });
            var self = this;
            ex.get(url, function (resp) {
                for (var k in resp) {
                    var name = resp[k];
                    if (typeof name == "string") {
                        (function (name) {
                            self[name] = function (kw, callback) {
                                if (typeof kw == 'function') {
                                    callback = kw;
                                    kw = null;
                                }
                                self.rout_methods(name, kw, callback);
                            };
                        })(name);
                    }
                }
            });
        }
    }, {
        key: "rout_methods",
        value: function rout_methods(name, kw, callback) {
            var args = { fun: name };
            if (kw) {
                ex.assign(args, kw);
            }
            ex.post(this.url, JSON.stringify([args]), function (resp) {
                callback(resp[name]);
            });
        }
    }]);

    return BackOps;
}();

function back_ops(url) {
    var proc = function proc(kw_list, callback) {
        ex.post(url, JSON.stringify(kw_list), function (resp) {
            if (callback) {
                callback(resp);
            }
        });
    };
    return proc;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var field_base = exports.field_base = {
    props: {
        name: {
            required: true
        },
        kw: {
            required: true
        }
    },
    computed: {
        row: function row() {
            return this.kw.row;
        },
        errors: function errors() {
            if (!this.kw.errors) {
                Vue.set(this.kw, 'errors', {});
            }
            return this.kw.errors;
        },
        head: function head() {
            var heads = this.kw.heads;
            for (var x = 0; x < heads.length; x++) {
                var head = heads[x];
                if (head.name == this.name) {
                    return head;
                }
            }
        }
    },
    methods: {
        error_data: function error_data(name) {
            if (this.errors[name]) {
                return this.errors[name];
            } else {
                return '';
            }
        }
    },
    components: {
        linetext: {
            props: ['name', 'row', 'kw'],
            template: '<div>\n            \t\t\t<span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<input v-else type="text" class="form-control" v-model="row[name]" :id="\'id_\'+name"\n                        \t:placeholder="kw.placeholder" :autofocus="kw.autofocus" :maxlength=\'kw.maxlength\'>\n                       </div>'
        },
        number: {
            props: ['name', 'row', 'kw'],

            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t<input v-else type="number" class="form-control" v-model="row[name]" :id="\'id_\'+name"\n                        :placeholder="kw.placeholder" :autofocus="kw.autofocus"></div>'
        },
        password: {
            props: ['name', 'row', 'kw'],
            template: '<input type="password" :id="\'id_\'+name" class="form-control" v-model="row[name]" :placeholder="kw.placeholder" :readonly=\'kw.readonly\'>'
        },
        blocktext: {
            props: ['name', 'row', 'kw'],
            //data:function(){
            //    return {
            //        org_height:0,
            //    }
            //},
            //mounted:function(){
            //    var self=this
            //    Vue.nextTick(function(){
            //        self.on_input()
            //    })
            //
            //},
            //methods:{
            //    on_input:function(){
            //        if(this.kw.readonly) return
            //        var textarea = $(this.$el).find('textarea')[0]
            //        if(this.org_height!=textarea.scrollHeight){
            //            $(textarea).height(textarea.scrollHeight-12)
            //            this.org_height=textarea.scrollHeight
            //        }
            //    }
            //},
            //computed:{
            //    value:function(){
            //        return this.row[this.name]
            //    }
            //},
            //watch:{
            //    value:function(v){
            //        var self=this
            //        Vue.nextTick(function(){
            //            self.on_input()
            //        })
            //    }
            //},
            template: '<div>\n            <span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            <textarea v-else class="form-control" rows="3" :id="\'id_\'+name" v-model="row[name]" :placeholder="kw.placeholder" :readonly=\'kw.readonly\'></textarea>\n            </div>'
        },
        color: {
            props: ['name', 'row', 'kw'],
            template: '<input type="text" v-model="row[name]" :id="\'id_\'+name" :readonly=\'kw.readonly\'>',
            methods: {
                init_and_listen: function init_and_listen() {
                    var self = this;
                    Vue.nextTick(function () {
                        $(self.$el).spectrum({
                            color: self.row[self.name],
                            showInitial: true,
                            showInput: true,
                            preferredFormat: "name",
                            change: function change(color) {
                                self.src_color = color.toHexString();
                                self.row[self.name] = color.toHexString();
                            }
                        });
                    });
                }
            },
            watch: {
                input_value: function input_value(value) {
                    if (this.src_color != value) {
                        this.init_and_listen();
                    }
                }
            },
            computed: {
                input_value: function input_value() {
                    return this.row[this.name];
                }
            },
            mounted: function mounted() {
                var self = this;
                ex.load_css('/static/lib/spectrum1.8.0.min.css');
                ex.load_js('/static/lib/spectrum1.8.0.min.js', function () {
                    self.init_and_listen();
                });
            }
        },
        logo: { // absolate
            props: ['name', 'row', 'kw'],
            template: '<logo-input :up_url="kw.up_url" :web_url.sync="row[name]" :id="\'id_\'+name"></logo-input>'
        },
        picture: {
            props: ['name', 'row', 'kw'],
            template: '<div><img class="img-uploador" v-if=\'kw.readonly\' :src=\'row[name]\'/>\n\t\t\t<img-uploador v-else :up_url="kw.up_url" v-model="row[name]" :id="\'id_\'+name" :config="kw.config"></img-uploador></div>'
        },
        sim_select: {
            props: ['name', 'row', 'kw'],
            data: function data() {
                return {
                    model: this.row[this.name]
                };
            },
            template: '<div>\n            <span v-if=\'kw.readonly\' v-text=\'get_label(kw.options,row[name])\'></span>\n            <select v-else v-model=\'row[name]\'  :id="\'id_\'+name"  class="form-control">\n            \t<option v-for=\'opt in orderBy(kw.options,"label")\' :value=\'opt.value\' v-text=\'opt.label\'></option>\n            </select>\n            </div>',
            mounted: function mounted() {
                if (this.kw.default && !this.row[this.name]) {
                    Vue.set(this.row, this.name, this.kw.default);
                    //this.row[this.name]=this.kw.default
                }
            },
            methods: {
                get_label: function get_label(options, value) {
                    var option = ex.findone(options, { value: value });
                    if (!option) {
                        return '---';
                    } else {
                        return option.label;
                    }
                },
                orderBy: function orderBy(array, key) {
                    return order_by_key(array, key);
                }
            }
        },
        search_select: {
            props: ['name', 'row', 'kw'],
            data: function data() {
                return {
                    model: this.row[this.name]
                };
            },
            template: '<div>\n            <span v-if=\'kw.readonly\' v-text=\'get_label(kw.options,row[name])\'></span>\n            <select v-else v-model=\'row[name]\'  :id="\'id_\'+name"  class="selectpicker form-control" data-live-search="true">\n            \t<option v-for=\'opt in orderBy(kw.options,"label")\' :value=\'opt.value\'\n            \t :data-tokens="opt.label" v-text=\'opt.label\'></option>\n            </select>\n            </div>',
            mounted: function mounted() {
                var self = this;
                if (this.kw.default && !this.row[this.name]) {
                    Vue.set(this.row, this.name, this.kw.default);
                }
                ex.load_css("/static/lib/bootstrap-select.min.css");
                ex.load_js("/static/lib/bootstrap-select.min.js", function () {
                    $(self.$el).find('.selectpicker').selectpicker();
                });
            },
            methods: {
                get_label: function get_label(options, value) {
                    var option = ex.findone(options, { value: value });
                    if (!option) {
                        return '---';
                    } else {
                        return option.label;
                    }
                },
                orderBy: function orderBy(array, key) {
                    return order_by_key(array, key);
                }
            }
        },

        check_select: {
            props: ['name', 'row', 'kw'],
            computed: {
                selected: {
                    get: function get() {
                        var data = this.row[this.name];
                        if (data) {
                            return data.split(',');
                        } else {
                            return [];
                        }
                    },
                    set: function set(v) {
                        this.row[this.name] = v.join(',');
                    }

                }
            },
            template: '<div>\n                <ul>\n                <li v-for=\'option in kw.options\' v-if="option.value"><input type="checkbox" :value="option.value" v-model="selected"/><span v-text="option.label"></span></li>\n                </ul>\n            </div>'
        },
        tow_col: {
            props: ['name', 'row', 'kw'],
            template: '<div>\n\t        \t<ul v-if=\'kw.readonly\'><li v-for=\'value in row[name]\' v-text=\'get_label(value)\'></li></ul>\n\t        \t<tow-col-sel v-else v-model=\'row[name]\' :id="\'id_\'+name" :choices=\'kw.options\' :size=\'kw.size\' ></tow-col-sel>\n\t        \t</div>',
            methods: {
                get_label: function get_label(value) {
                    for (var i = 0; i < this.kw.options.length; i++) {
                        if (this.kw.options[i].value == value) {
                            return this.kw.options[i].label;
                        }
                    }
                }
            }
        },
        bool: {
            props: ['name', 'row', 'kw'],
            template: '<div class="checkbox">\n\t        <input type="checkbox" :id="\'id_\'+name" v-model=\'row[name]\' :disabled="kw.readonly">\n\t\t\t <label :for="\'id_\'+name"><span v-text=\'kw.label\'></span></label>\n\t\t\t\t\t  </div>'
        },
        date: {
            props: ['name', 'row', 'kw'],
            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n                                <date v-else v-model="row[name]" :id="\'id_\'+name"\n                                    :placeholder="kw.placeholder"></date>\n                               </div>'
        },
        datetime: {
            props: ['name', 'row', 'kw'],
            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<datetime  v-model="row[name]" :id="\'id_\'+name"\n                        \t:placeholder="kw.placeholder"></datetime>\n                       </div>'
        },
        richtext: {
            props: ['name', 'row', 'kw'],
            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<ckeditor  v-model="row[name]" :id="\'id_\'+name"></ckeditor>\n                       </div>'
        }

    }

};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var field_fun = exports.field_fun = {
    data: function data() {
        return {
            kw: {
                heads: heads,
                row: row,
                errors: {}
            },
            menu: menu,
            search_args: search_args,

            can_add: can_add,
            can_del: can_del,
            can_log: can_log,
            can_edit: can_edit,

            page_label: page_label,
            help_url: help_url
        };
    },
    methods: {
        goto: function goto(url) {
            location = url;
        },
        after_sub: function after_sub(new_row) {
            //ff.back()
            if (search_args.next) {
                location = decodeURIComponent(search_args.next);
            } else {
                location = document.referrer;
            }
        },
        before_sub: function before_sub() {},
        submit: function submit() {
            this.before_sub();
            var self = this;
            if (window.bus) {
                window.bus.$emit('sync_data');
            }
            show_upload();
            var search = ex.parseSearch();
            var post_data = [{ fun: 'save', row: this.kw.row }];
            var url = ex.appendSearch('/_ajax', search_args);
            ex.post(url, JSON.stringify(post_data), function (resp) {
                hide_upload(500);
                if (resp.save.errors) {
                    self.kw.errors = resp.save.errors;
                } else {
                    self.after_sub(resp.save.row);
                }
            });
        },
        cancel: function cancel() {
            var search = ex.parseSearch(); //parseSearch(location.search)
            if (search._pop) {
                window.close();
            } else {
                history.back();
            }
        },
        get_del_link: function get_del_link() {
            var search_args = ex.parseSearch();
            if (this.kw.row.pk) {
                return ex.template('{engine_url}/del_rows?rows={class}:{pk}&next={next}&_pop={pop}', { class: this.kw.row._class,
                    engine_url: engine_url,
                    pk: this.kw.row.pk,
                    next: search_args.next,
                    pop: search_args._pop

                });
            } else {
                return null;
            }
        },
        del_row: function del_row() {
            return this.get_del_link();
        },
        log_url: function log_url() {
            var obj = {
                pk: this.kw.row.pk,
                _class: this.kw.row._class,
                engine_url: engine_url,
                page_name: page_name
            };
            return ex.template('{engine_url}/log?rows={_class}:{pk}', obj);
        }
    }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.order_by_key = order_by_key;
function isChinese(temp) {
    var re = /[^\u4E00-\u9FA5]/;
    if (re.test(temp[0])) {
        return false;
    }
    return true;
}
function compare(temp1, temp2) {
    if (temp1 < temp2) {
        return -1;
    } else if (temp1 == temp2) {
        return 0;
    } else {
        return 1;
    }
}

function order_by_key(array, key) {
    return array.slice().sort(function (a, b) {
        if (isChinese(a[key]) && isChinese(b[key])) {
            return a[key].localeCompare(b[key], 'zh');
        } else {
            return compare(a[key], b[key]);
        }
    });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>>>front/file.rst>
===========
文件上传
===========

主要内容
========
fl
    包含可以操作file对象的函数，例如上传upload,批量上传uploads.

file-input
    该组件用户收集用户输入。只能返回file list 。所以，如果使用upload上传文件，必须取 [0] 第一个file对象。

img-uploador
    图片选择，自动上传。

多个文件上传步骤
==============

1. Vue.data设置::

    data:{
    files:[],
    },

2. 在html中插入Vue组件::

    <file-input id='jjyy' v-model='files' multiple></file-input>

3. 在Methods中上传::

    fl.uploads(files,url,function(resp){  // url 可以忽略，默认url为 /face/upload
        resp ....
    })

单个文件
=======
1.Vue.data设置::

    data:{
        files:[],
    },

2. 在html中插入Vue组件::

    <file-input id='jjyy' v-model='files'></file-input>

3. 在Methods中上传::

     fl.uploads(this.files[0],url,function(resp){
        resp ....
     })

.. Note:: 默认上传url是/face/upload ，该接口返回的是 file_url_list。

上传进度
=========
进度只是上传进度，判断文件是否被后端接收成功，需要判断是否success回调被调用::

     fl.upload(this.file2[0],'/face/upload',function(url_list){

     },function(progress){
        console.log(progress)
     })

预览图片
=========
从file-input读出数据，然后赋予图片的src ::

    f1.read(this.files[0],function (data) {
            $('#haha')[0].src = data
    }


上传图片
==========
::

    <img-uploador v-model='xxx_url_variable'></img-uploador>   //默认上传，使用的是 fl.upload默认地址 /face/upload
    <img-uploador v-model='xxx_url_variable' up_url='xxx'></img-uploador>

具备裁剪性质::

    <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>


样式技巧
========
1. 自定义样式

    <file-inpu>不支持直接自定义样式。但是可以通过其他方式自定义。最简单的方式是：

    * 隐藏<file-input> ，
    * 然后触发其click事件('.file-input').click()
<<<<
*/

__webpack_require__(13);

var fl = {
    read: function read(file, callback) {
        // 读完文件后，调用callback
        var reader = new FileReader();
        reader.onloadend = function () {
            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            var dataURL = reader.result;
            //var img = new Image();
            //img.src = dataURL;
            // 插入到 DOM 中预览
            //$('#haha')[0].src=dataURL
            callback(dataURL);
        };
        reader.readAsDataURL(file); // 读出 base64
    },
    upload: function upload(file, url, success, progress) {
        if (ex.is_fun(url)) {
            var progress = success;
            var success = url;
            var url = '/_face/upload';
        } else {
            var url = url || '/_face/upload';
        }

        var fd = new FormData();
        fd.append('file', file);
        $.ajax({
            url: url,
            type: 'post',
            data: fd,
            contentType: false,
            success: success,
            //success:function (data) {
            //    success(data)
            //},
            processData: false,
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (progress && evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        progress(percentComplete);
                        //console.log('进度', percentComplete);
                    }
                }, false);

                return xhr;
            }
        });
    },
    uploads: function uploads(files, url, success, progress) {
        if (ex.is_fun(url)) {
            var progress = success;
            var success = url;
            var url = '/face/upload';
        } else {
            var url = url || '/face/upload';
        }

        var fd = new FormData();
        for (var x = 0; x < files.length; x++) {
            var file = files[x];
            fd.append(file.name, file);
        }
        $.ajax({
            url: url,
            type: 'post',
            data: fd,
            contentType: false,
            success: success,
            processData: false,
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (progress && evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        progress(percentComplete);
                        //console.log('进度', percentComplete);
                    }
                }, false);

                return xhr;
            }
        });
    }
};

var file_input = {
    template: "<input class='file-input' type='file' @change='on_change($event)'>",
    props: ['value'],
    data: function data() {
        return {
            files: []
        };
    },
    watch: {
        value: function value(v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v;
            }
        }

    },
    methods: {
        on_change: function on_change(event) {
            this.files = event.target.files;
            this.$emit('input', this.files);
        }
    }
};

Vue.component('file-input', file_input);

/*
<img-uploader v-model='xxx'></img-uploader>
 <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>

 accept='image/gif,image/jpeg,image/png'
*/

var img_uploader = {
    props: ['value', 'up_url', 'config'],
    data: function data() {
        return {
            img_files: '',
            url: this.value,
            disable: false
        };
    },
    computed: {
        is_crop: function is_crop() {
            return this.config && this.config.crop;
        },
        crop_config: function crop_config() {
            if (this.config && this.config.crop) {
                var temp_config = ex.copy(this.config);
                delete temp_config.crop;
                return temp_config;
            } else {
                return {};
            }
        }
    },

    template: '\n          <div :class=\'["up_wrap logo-input img-uploader",{"disable":disable}]\'>\n            <file-input v-if="!is_crop"\n                accept=\'image/*\'\n                v-model= \'img_files\'>\n            </file-input>\n            <img-crop class=\'input\' v-if=\'is_crop\' v-model=\'img_files\' :config="crop_config">\n            </img-crop>\n            <div style="padding: 40px" @click="select()">\n                <a class=\'choose\'>Choose</a>\n            </div>\n            <div v-if=\'url\' class="closeDiv">\n            <div class="close" @click=\'clear()\'><i class="fa fa-times" aria-hidden="true" style="padding: 5px;"></i></div>\n            <img :src="url" alt="" class="logoImg">\n            </div>\n            </div>\n        ',
    watch: {
        value: function value(v) {
            this.url = v;
        },
        img_files: function img_files(v) {
            var self = this;
            console.log('start upload');
            fl.upload(v[0], this.up_url, function (url_list) {
                self.url = url_list[0];
                self.$emit('input', self.url);
            });
        }
    },
    methods: {
        clear: function clear() {
            console.log('clear image data');
            this.img_files = '';
            this.url = '';
            this.$emit('input', '');
        },
        select: function select() {
            console.log('before select');
            var self = this;
            if (!this.disable) {
                $(this.$el).find('input[type=file]').click();
                this.disable = true;
                setTimeout(function () {
                    self.disable = false;
                }, 3000);
            }

            console.log('after select');
        }
    }
};

Vue.component('img-uploador', img_uploader);

/*
具备裁剪功能
==============
 img_crop是一种input

    <img-crop v-model='xxx' :config='{aspectRatio: 8 / 10}'></img-crop>
*
*  上传:
*  ======
*  fl.upload(xxx[0],function(urls){
*         ...
*  ))
* */

var img_crop = {
    template: '<div class="img-crop">\n    <input type=\'file\' @change=\'on_change($event)\'\n            accept=\'image/*\'>\n    <modal v-show=\'cropping\' >\n        <div class="total-wrap flex-v" style="width:80vw;height: 80vh;background-color: white;">\n            <div class="crop-wrap flex-grow">\n                <img class="crop-img" :src="org_img" >\n            </div>\n            <div style="padding: 5px;">\n            <div class="btn-group" role="group">\n                <button class="btn btn-primary" @click="rotato_90()"><i class="fa fa-repeat" aria-hidden="true"></i></button>\n                <button class="btn btn-primary" @click="zoom_in()"><i class="fa fa-search-plus" aria-hidden="true"></i></button>\n                <button class="btn btn-primary" @click="zoom_out()"><i class="fa fa-search-minus" aria-hidden="true"></i></button>\n            </div>\n            <div class="btn-group" role="group">\n                <button class="btn btn-primary" @click="make_sure()"><i class="fa fa-check" aria-hidden="true"></i></button>\n                <button class="btn btn-primary" @click="cancel()"><i class="fa fa-times" aria-hidden="true"></i></button>\n            </div>\n            </div>\n        </div>\n    </modal>\n    </div>',
    props: ['value', 'config'],
    data: function data() {
        var inn_config = {
            size: {}
        };
        ex.assign(inn_config, this.config);

        return {
            files: [],
            org_img: '',
            cropping: false,
            inn_config: inn_config
        };
    },
    mounted: function mounted() {
        ex.load_css('/static/lib/cropper2.3.4.min.css');
        ex.load_js('/static/lib/cropper2.3.4.min.js');
    },
    watch: {
        value: function value(v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v;
            }
        }

    },

    methods: {
        cancel: function cancel() {
            $(this.$el).find('input[type=file]').val('');
            this.cropping = false;
        },
        zoom_in: function zoom_in() {
            $(this.$el).find('.crop-img').cropper('zoom', 0.1);
        },
        zoom_out: function zoom_out() {
            $(this.$el).find('.crop-img').cropper('zoom', -0.1);
        },
        rotato_90: function rotato_90() {
            $(this.$el).find('.crop-img').cropper('rotate', 90);
        },
        move_img: function move_img() {
            $(this.$el).find('.crop-img').cropper('setDragMode', 'move');
        },
        move_crop: function move_crop() {
            $(this.$el).find('.crop-img').cropper('setDragMode', 'crop');
        },
        on_change: function on_change(event) {

            if ($(this.$el).find('input[type=file]').val() == '') {
                return;
            }
            var self = this;
            this.cropping = true;
            var img_file = event.target.files[0];

            //fl.read(img_file)
            //this.$emit('input', this.files)
            fl.read(img_file, function (data) {
                self.org_img = data;
                Vue.nextTick(function () {
                    self.init_crop();
                });
            });
        },
        init_crop: function init_crop() {
            //$(this.$el).find('.crop-img').cropper({
            //    aspectRatio: 8 / 10,
            //});
            if (this.inn_config.aspectRatio) {
                $(this.$el).find('.crop-img').cropper({ aspectRatio: this.inn_config.aspectRatio });
            }

            $(this.$el).find('.crop-img').cropper('replace', this.org_img);
            $(this.$el).find('.crop-img').cropper('setDragMode', 'move');
        },
        make_sure: function make_sure() {
            var self = this;
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`

            //$(this.$el).find('.crop-img').cropper('getCroppedCanvas',this.inn_config.size).toBlob(function (blob) {
            //    //var formData = new FormData();
            //    self.$emit('input',[blob])
            //    self.cropping=false
            //
            //});
            var data_url = $(this.$el).find('.crop-img').cropper('getCroppedCanvas', this.inn_config.size).toDataURL('image/jpeg');
            var blob = dataURLtoBlob(data_url);
            self.$emit('input', [blob]);
            self.cropping = false;
        }
    }

};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

Vue.component('img-crop', img_crop);

/*
* 下面是为了老代码的兼容性，以后不会用了。
*
*/

Vue.component('file-obj', {
    template: "<input model='filebody' type='file' @change='changed'>",
    props: {
        up_url: {
            type: String,
            required: true
        },
        //url:{
        //    type: String,
        //    twoWay:true
        //},
        ready: {}
    },
    methods: {
        changed: function changed(changeEvent) {
            var file = changeEvent.target.files[0];
            if (!file) return;
            this.fd = new FormData();
            this.fd.append('file', file);
            this.ready = true;
            this.upload();
        },
        upload: function upload() {
            var self = this;
            $.ajax({
                url: this.up_url,
                type: 'post',
                data: this.fd,
                contentType: false,
                cache: false,
                success: function success(data) {
                    if (data.url) {
                        self.$dispatch('rt_url', data.url);
                    }

                    //alert(data);
                    //self.url=data.url;
                    //self.$emit('url.changed',data.url)
                },
                //error:function (data) {
                //	alert(data.responseText)
                //},
                processData: false
            });
        }
    }
});

Vue.component('logo-input', {
    props: ['up_url', 'web_url', 'id'],
    template: '\n          <div class=\'up_wrap logo-input\'>\n            <file-obj :id=\'id\'\n                accept=\'image/gif,image/jpeg,image/png\'\n                :up_url=\'up_url\'\n                @rt_url= \'get_web_url\'>\n            </file-obj>\n            <div style="padding: 40px">\n                <a class=\'choose\'>Choose</a>\n            </div>\n            <div v-if=\'web_url\' class="closeDiv">\n            <div class="close" @click=\'clear()\'>X</div>\n            <img :src="web_url" alt="" class="logoImg">\n            </div>\n            </div>\n        ',
    methods: {
        get_web_url: function get_web_url(e) {
            this.web_url = e;
        },
        clear: function clear() {
            this.web_url = '';
            $('#' + this.id).val('');
        }
    }
});

window.fl = fl;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tab_box = __webpack_require__(21);

var tab = _interopRequireWildcard(_tab_box);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var date_config_set = {
    date: {
        language: "zh-CN",
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true

    },
    month: {
        language: "zh-CN",
        format: "yyyy-mm",
        startView: "months",
        minViewMode: "months",
        autoclose: true

    }
}; /**
    * Created by heyulin on 2017/1/24.
    *
   >->front/input.rst>
   =======
   inputs
   =======
   
   date
   ========
   ::
   
   <date v-model='variable'></date>  // 选择默认set=date ,即选择日期
   
   <date v-model='variable' set='month'></date> // 选择 set=month ,即选择月份
   
   <date v-model='variable' set='month' :config='{}'></date>  //  config 是自定义的配置对象，具体需要参加帮助文件
   
   datetime
   ===========
   ::
   
   <datetime v-model='variable' :config='{}'></datetime> // 选择日期和时间
   
   color
   ======
   
   forign-edit
   ============
   示例::
   
       <forign-edit :kw="person.emp_info" name="user" page_name="user" ></forign-edit>
   
   <-<
    */

Vue.component('date', {
    //template:'<input type="text" class="form-control">',
    template: " <div class=\"input-group datetime-picker\" style=\"width: 12em;\">\n                <input type=\"text\" class=\"form-control\" readonly :placeholder=\"placeholder\"/>\n                <div class=\"input-group-addon\" @click=\"$emit('input','')\">\n                    <i class=\"fa fa-calendar-times-o\" aria-hidden=\"true\"></i>\n                </div>\n                </div>",
    props: ['value', 'set', 'config', 'placeholder'],
    mounted: function mounted() {
        var self = this;
        if (!this.set) {
            var def_conf = date_config_set.date;
        } else {
            var def_conf = date_config_set[this.set];
        }
        if (this.config) {
            ex.assign(def_conf, this.config);
        }
        self.input = $(this.$el).find('input');

        ex.load_css('/static/lib/bootstrap-datepicker1.6.4.min.css');

        ex.load_js('/static/lib/bootstrap-datepicker1.6.4.min.js', function () {
            ex.load_js('/static/lib/bootstrap-datepicker1.6.4.zh-CN.min.js', function () {
                self.input.datepicker(def_conf).on('changeDate', function (e) {
                    self.$emit('input', self.input.val());
                });
                // if has init value,then init it
                if (self.value) {
                    self.input.datepicker('update', self.value);
                    self.input.val(self.value);
                }
            });
        });
    },
    methods: {
        click_input: function click_input() {
            this.input.focus();
        }
    },
    watch: {
        value: function value(n) {
            this.input.datepicker('update', n);
            this.input.val(n);
        }
    }
});

Vue.component('datetime', {
    //data:function(){
    //    return {
    //        input_value:'',
    //    }
    //},
    //template:'<input type="text" class="form-control">',
    template: "<span class=\"datetime-picker\">\n                <span class=\"cross\" @click=\"$emit('input','')\">X</span>\n                <input type=\"text\" readonly/>\n                </span>",
    props: ['value', 'config'],
    mounted: function mounted() {
        var self = this;
        var def_conf = {
            language: "zh-CN",
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayHighlight: true
        };
        if (self.config) {
            ex.assign(def_conf, this.config);
        }
        self.input = $(this.$el).find('input');

        ex.load_css('/static/lib/smalot-bootstrap-datetimepicker2.4.3.min.css');
        ex.load_js('/static/lib/moment2.17.1.min.js');
        ex.load_js('/static/lib/smalot-bootstrap-datetimepicker2.4.3.min.js', function () {

            self.input.datetimepicker(def_conf).on('changeDate', function (e) {
                self.$emit('input', self.input.val());
            });

            // if has init value,then init it
            if (self.value) {
                self.input.datepicker('update', self.value);
                self.input.val(self.value);
            }
        });
    },

    watch: {
        value: function value(n) {
            this.input.val(n);
            this.input.val(n);
        }
    }
});

var color = {
    props: ['value'],
    template: "<input type=\"text\">",
    methods: {
        init_and_listen: function init_and_listen() {
            var self = this;
            Vue.nextTick(function () {
                $(self.$el).spectrum({
                    color: self.value,
                    showInitial: true,
                    showInput: true,
                    preferredFormat: "name",
                    change: function change(color) {
                        self.src_color = color.toHexString();
                        self.$emit('input', self.src_color);
                    }
                });
            });
        }
    },
    watch: {
        value: function value(_value) {
            if (this.src_color != _value) {
                this.init_and_listen();
            }
        }
    },
    mounted: function mounted() {
        var self = this;
        ex.load_css('/static/lib/spectrum1.8.0.min.css');
        ex.load_js('/static/lib/spectrum1.8.0.min.js', function () {
            self.init_and_listen();
        });
    }
};

Vue.component('color', color);

ex.append_css("<style type=\"text/css\" media=\"screen\">\n    /*.datetime-picker{*/\n        /*position: relative;*/\n        /*display: inline-block;*/\n    /*}*/\n    .datetime-picker input[readonly]{\n        background-color: white;\n    }\n\t/*.datetime-picker .cross{*/\n\t    /*display: none;*/\n\t/*}*/\n\t/*.datetime-picker:hover .cross{*/\n\t    /*display: inline-block;*/\n\t    /*position: absolute;*/\n\t    /*right: 8px;*/\n\t    /*top:3px;*/\n\t    /*cursor: pointer;*/\n\n\t/*}*/\n</style>\n ");

var forignEdit = {
    template: "<div class=\"forign-key-panel\">\n        <button v-if=\"has_pk()\" @click=\"jump_edit(kw.row[name])\" title=\"edit\">\n            <i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i></button>\n        <button @click=\"jump_edit()\" title=\"create new\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i></button>\n    </div>",
    props: ['kw', 'name', 'page_name'],
    methods: {
        jump_edit: function jump_edit(pk) {
            var name = this.name;
            var kw = this.kw;
            var page_name = this.page_name || this.name;
            var options = ex.findone(kw.heads, { name: name }).options;
            var row = kw.row;
            var pk = pk || '';

            var url = ex.template('{engine_url}/{page_name}.edit?pk={pk}', {
                engine_url: engine_url,
                page_name: page_name,
                pk: pk
            });
            ln.openWin(url, function (resp) {
                if (resp.del_rows) {
                    ex.remove(options, function (option) {
                        return ex.isin(option, resp.del_rows, function (op, del_row) {
                            return op.value == del_row.pk;
                        });
                    });
                } else if (resp.row) {
                    if (pk) {
                        var option = ex.findone(options, { value: pk });
                        option.label = resp.row._label;
                    } else {
                        options.push({ label: resp.row._label, value: resp.row.pk });
                        row[name] = resp.row.pk;
                    }
                }
            });
        },
        has_pk: function has_pk() {
            if (this.kw.row[this.name]) {
                return true;
            } else {
                return false;
            }
        }
    }
};

ex.append_css("\n<style type=\"text/css\">\n    .forign-key-panel{\n        padding: 6px;\n    }\n</style>");

Vue.component('forign-edit', forignEdit);

var check_box = {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: ['value', 'checked'],
    methods: {
        on_click: function on_click() {
            $(this.$el).find('input').click();
            this.$emit('change', this.checked);
        }
    },
    data: function data() {
        var checked = this.checked || [];
        return {
            inn_checked: checked
        };
    },
    watch: {
        inn_checked: function inn_checked(v) {
            this.$emit('change', v);
        },
        checked: function checked(v) {
            this.inn_checked = v;
        }
    },
    computed: {
        is_checked: function is_checked() {
            if (this.value) {
                return this.inn_checked.indexOf(this.value) != -1;
            } else {
                return this.inn_checked;
            }
        }
    },
    template: " <span class=\"com-checkbox\" @click=\"on_click()\">\n                <input type=\"checkbox\" :value=\"value\" v-model='inn_checked' style=\"display: none\"/>\n                  <i class=\"fa fa-check-circle\" aria-hidden=\"true\" v-if='is_checked' style=\"color: #009926\"></i>\n                  <i class=\"fa fa-circle-thin\" aria-hidden=\"true\" v-else></i>\n              </span>"
};
Vue.component('com-check-box', check_box);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>->front/link.rst>
=========
link
=========

利用SessionStorage跳转页面
===========================
基本思想：将对象保存在sessionStorage中，切换到其他页面，当完成选择等任务后，再利用history.back()切换回原来的页面。这时将保存的信息恢复回来。
::

    // origin.html页面
    // 以window为访问root，将对象的path保存下来。
    var save_list=['row']
    url=ex.template('{engine_url}/home.wx',{engine_url:engine_url,})
    ln.getFromTab(url,save_list)

    //在页面的初始阶段调用:
    ln.readCache()  // 读取对应自身url的cache，如果有cache则恢复对应window属性。
                   // 在页面加载后2秒，自动删除 cache 和_rt　值

    // select.html页面
    // 判断是否是 _pop=1，返回row对象。
    ln.rt(row)  // 该函数是将结果存在sessionStorage中，以key=_rt存储。


以前的SessionStorage
=========================
示例::

     var director = '{% url 'director' %}'

     var cache_meta={
     cache:['person.emp_info.row',
            'person.bas_info.row',
            'crt_view'],
     rt_key:{'auth.user':'person.emp_info.row.user'}
     }

    //auth.user 是返回的值在storage中的key，person.emp_info.row.user是还原的对象路径

     ln.cache(cache_meta)

     // 下面是构造跳转的url,其中最重要的是需要appendSearch({cache:1})),表明返回时，需要读取cache
     var back_url=btoa(ex.appendSearch({cache:1}))
     if(pk){
     location=ex.template('{director}model/{name}/edit/{pk}?next={encode_url}',{director:director,name:name,pk:pk,encode_url:back_url})
     }else{
     location=ex.template('{director}model/{name}/edit?next={encode_url}',{director:director,name:name,encode_url:back_url})
     }

readCache
	@root_obj

cache
	@cache_meta
	@root_obj : 如果没写，默认是window


history
========
利用h5的history功能，是的地址栏发生变化，并且不会触发服务器请求。该功能可以用在ajax请求，将ajax请求记录在history中，可以达到前进后退的功能。

pushUrl
    url入栈

popUrlListen:
    监听pop history事件，点击前进后退按钮时，刷新整个页面。如果需要精细的控制，在不刷新页面的情况下，切换状态，需要自定义事件handler

<-<
 */

__webpack_require__(14);

var ln = {
    history_handle: function history_handle(obj) {
        this._his_handler = obj.handler;
        window.addEventListener('popstate', function (e) {
            if (e.state) {
                obj.handler(e.state);
            } else {
                history.back();
            }
        }, false);

        if (obj.init) {
            // && !history.state){
            if (!history.state) {
                history.pushState(obj.init, '');
            }
            //else{
            //    history.replaceState(obj.init,'')
            //}
        }
    },
    pushState: function pushState(state, url) {
        url = url || '';
        history.pushState(state, '', url);
        this._his_handler(state);
    },

    getFromTab: function getFromTab(url, cache_name_list, rt_obj_path) {

        cache_name_list = cache_name_list || [];
        var cache_obj = {
            _scroll: { x: scrollX, y: scrollY },
            name_list: cache_name_list,
            obj_list: [],
            rt_obj_path: rt_obj_path
        };
        ex.each(cache_name_list, function (name) {
            cache_obj.obj_list.push(ex.access(window, name));
        });

        sessionStorage.setItem('_stack_' + location.href, JSON.stringify(cache_obj));
        location = ex.appendSearch(url, { _pop: 1 });
    },
    ret: function ret(value) {
        if (window.opener) {
            this._ret_win(value);
        } else {
            this._ret_frame(value);
        }
    },
    _ret_frame: function _ret_frame(value) {
        // 在iframe中运行
        //var search_args=ex.parseSearch()
        if (search_args._pop) {
            if (window.parent.__fram_back) {
                window.parent.__fram_back(value);
            }

            //if(search_args._frame){
            //    if(parent.__fram_back){
            //        parent.__fram_back(value)
            //    }
            //}else if(window.opener){
            //    this.rtWin(value)
            //}else{
            //    sessionStorage.setItem('_rt',JSON.stringify(value))
            //    history.back()
            //}
            //return  true
        }

        //else{
        //    return false
        //}
    },

    readCache: function readCache() {
        var cache_obj_str = sessionStorage.getItem('_stack_' + location.href);

        if (cache_obj_str) {
            var cache_obj = JSON.parse(cache_obj_str);

            var name_list = cache_obj.name_list;
            var obj_list = cache_obj.obj_list;
            for (var i = 0; i < name_list.length; i++) {
                ex.set(window, name_list[i], obj_list[i]);
            }

            // 将返回值赋予对应的window对象
            var rt_value = sessionStorage.getItem('_rt');

            if (rt_value) {
                if (cache_obj.rt_obj_path) {
                    ex.set(window, cache_obj.rt_obj_path, JSON.parse(rt_value));
                }
            }

            //var cache_meta=cache_obj.cache_meta
            //if(cache_meta && cache_meta.rt_key){
            //    for(var key in cache_meta.rt_key){
            //        var value = sessionStorage.getItem(key)
            //        if(value){
            //            var targ_key=cache_meta.rt_key[key]
            //            sessionStorage.removeItem(key)
            //            ex.set(root_obj,targ_key,value)
            //        }
            //
            //    }
            //}

            // 尝试滚动到原来的位置
            if (cache_obj._scroll) {
                $(function () {
                    setTimeout(function () {
                        window.scrollTo(cache_obj._scroll.x, cache_obj._scroll.y);
                    }, 10);
                });
            }
            //onload=function(){
            //    setTimeout(function(){
            //        console.log(cache_obj._scroll.y)
            //        window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
            //    },10)
            //}
            //$(function(){
            //setTimeout(function(){
            //    console.log(cache_obj._scroll.y)
            //    window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
            //},3000)

            //})

            $(function () {
                setTimeout(function () {
                    sessionStorage.removeItem('_stack_' + location.href);
                    sessionStorage.removeItem('_rt');
                }, 2000);
            });
        }
        //}
    },

    cache: function cache(cache_meta, root_obj) {

        var root_obj = root_obj || window;
        var cache_obj = {
            cache_meta: cache_meta,
            window: {},
            _scroll: { x: scrollX, y: scrollY }
        };

        if (cache_meta.cache) {
            ex.each(cache_meta.cache, function (key) {
                cache_obj.window[key] = ex.access(root_obj, key);
            });
        }
        sessionStorage.setItem(location.href, JSON.stringify(cache_obj));
    },

    openWin: function openWin(url, callback) {
        /*
          * */
        var norm_url = ex.appendSearch(url, { _pop: 1 });
        window.open(norm_url, url, 'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300');
        window.__on_subwin_close = callback;
    },
    _ret_win: function _ret_win(resp) {
        if (window.opener && window.opener.__on_subwin_close) {
            window.opener.__on_subwin_close(resp);
        }
        window.opener.__on_subwin_close = null;
        window.close();
    },
    pushUrl: function pushUrl(url) {
        window.history.pushState(url, 0, url);
    },
    popUrlListen: function popUrlListen() {
        window.addEventListener('popstate', function (e) {
            /// <summary>
            ///　　　&#10;　在页面初始化加载完成中添加该事件，则可以监听到onpopstate事件，而浏览器进行前进、后退、刷新操作都会触发本事件
            ///　　　&#10;　linkFly原创，引用请注明出处，谢谢
            /// </summary>/// <returns type="void" />
            if (e.state) {
                location = e.state;
                //e.state就是pushState中保存的Data，我们只需要将相应的数据读取下来即可
            }
        });
    },
    openFrame: function openFrame(url, title, callback, css) {
        var self = this;
        if (!window.__load_frame) {
            $('body').append('<div id="_load_frame_wrap">\n            <div class="imiddle popframe flex-v">\n                <span class="title"><b>' + title + '</b></span>\n                <span class="close-btn" onclick="ln.closeFrame()"><i class="fa fa-times fa-2x" aria-hidden="true"></i></span>\n                <iframe id="_load_frame" frameborder="0" class="flex-grow"></iframe>\n            </div>\n            </div>');
            window.__load_frame = true;
        }
        var url = ex.appendSearch(url, { _pop: 1, _frame: 1 });
        $('#_load_frame').attr('src', url);
        if (!callback) {
            window.__fram_back = null;
        } else {
            window.__fram_back = function (v) {
                callback(v);
                self.closeFrame();
            };
        }

        if (css) {
            $('.popframe').css(css);
        }
        $('#_load_frame_wrap').show();
    },
    closeFrame: function closeFrame() {
        $('#_load_frame').attr('src', '');
        $('#_load_frame_wrap').hide();
    }

};

window.ln = ln;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!window.__multi_sel) {
	document.write('\n\t\n<style type="text/css" media="screen" id="test">\n\n._tow-col-sel{\n\tdisplay: flex;\n\talign-items: stretch;\n\n}\n\n._tow-col-sel .sel{\n\tmin-width:250px;\n\tmax-width: 400px;\n\n\tdisplay: flex;\n\tflex-direction: column;\n\t/*display: inline-block;*/\n\t/*vertical-align: middle;*/\n}\n._tow-col-sel .sel select{\n\twidth: 100%;\n\n\tflex: 1;\n}\n._tow-col-sel .sel.right{\n\tborder-width:2px;\n}\n._tow-col-sel .arrow{\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content:center;\n\tpadding: 5px;\n}\n._tow-col-sel ._small_icon{\n\twidth:15px;\n}\n._tow-col-sel ._small_icon.deactive{\n\topacity: 0.5;\n\t-moz-opacity: 0.5;\n\tfilter:alpha(opacity=50);\n}\n</style>\n\n\t');
}

var temp_tow_col_sel = '\n<div class=\'_tow-col-sel\'>\n\t\t<div class="sel">\n\t\t\t<b>\u53EF\u9009\u9879</b>\n\t\t\t<select name="" id="" multiple="multiple" :size="size" class=\'left\' v-model=\'left_sel\' @dblclick=\'batch_add()\'>\n\t\t\t\t<option v-for=\'opt in orderBy(can_select,"label")\' :value="opt.value" v-text=\'opt.label\'  ></option>\n\t\t\t</select>\n\t\t</div>\n\n\t\t<div class="arrow">\n\t\t\t<img src="//res.enjoyst.com/image/right_02.png" alt=""\n\t\t\t\t:class=\'["_small_icon",{"deactive":left_sel.length==0}]\' @click=\'batch_add()\'>\n\t\t\t<br>\n\t\t\t<img src="//res.enjoyst.com/image/left_02.png" alt=""\n\t\t\t\t:class=\'["_small_icon",{"deactive":right_sel.length==0}]\' @click=\'batch_rm()\'>\n\t\t</div>\n\t\t<div class="sel">\n\t\t\t<b>\u9009\u4E2D\u9879</b>\n\t\t\t<select name="" id="" multiple="multiple" :size="size" class=\'right\' v-model=\'right_sel\' @dblclick=\'batch_rm()\'>\n\t\t\t\t<option v-for=\'opt in orderBy(selected,"label")\' :value="opt.value" v-text=\'opt.label\' ></option>\n\t\t\t</select>\n\t\t</div>\n\n</div>\n';

Vue.component('tow-col-sel', {
	template: temp_tow_col_sel,
	props: {
		choices: {},
		value: {
			default: function _default() {
				return [];
			}
		},
		size: {
			default: 6
		}
	},
	data: function data() {
		var self = this;
		if (!this.value) {
			var norm_selected = [];
		} else {
			norm_selected = ex.filter(this.choices, function (choice) {
				return ex.isin(choice.value, self.value);
			});
		}
		return {
			selected: norm_selected,
			//can_select:JSON.parse(JSON.stringify(this.choices)),
			left_sel: [],
			right_sel: []
		};
	},
	mounted: function mounted() {
		//var self=this
		//this.can_select=ex.filter(this.choices,function(choice){
		//	return !ex.isin(choice,self.selected)
		//})
		//this.selected__ = ex.remove(this.can_select,function (item) {
		//		return ex.isin(item.value,self.value)
		//	})
	},
	watch: {
		selected: function selected(v) {
			this.$emit('input', ex.map(v, function (choice) {
				return choice.value;
			}));
		}
	},
	computed: {
		can_select: function can_select() {
			var self = this;
			return ex.filter(this.choices, function (choice) {
				return !ex.isin(choice, self.selected);
			});
		}
	},
	methods: {
		orderBy: function orderBy(array, key) {
			return order_by_key(array, key);
		},
		batch_add: function batch_add() {
			var self = this;
			var added_choice = ex.remove(this.can_select, function (choice) {
				return ex.isin(choice.value, self.left_sel);
			});
			ex.extend(this.selected, added_choice);
		},
		batch_rm: function batch_rm() {
			var self = this;
			var del_choice = ex.remove(this.selected, function (choice) {
				return ex.isin(choice.value, self.right_sel);
			});
			//ex.extend(this.can_select,del_choice)
		}
	}
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(0)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./file.scss", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./file.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(0)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./link.scss", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./link.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(0)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/.0.26.1@css-loader/index.js!./../../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./tab_box.scss", function() {
			var newContent = require("!!./../../../../node_modules/.0.26.1@css-loader/index.js!./../../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./tab_box.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".img-uploader input {\n  display: none; }\n\n.img-uploader.disable {\n  background-color: #e3e2e1; }\n\n.up_wrap {\n  position: relative;\n  text-align: center;\n  border: 2px dashed #ccc;\n  background: #FDFDFD;\n  width: 200px; }\n\n.closeDiv {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-color: #ffffff; }\n\n.choose {\n  display: inline-block;\n  text-decoration: none;\n  padding: 5px;\n  border: 1px solid #0092F2;\n  border-radius: 4px;\n  font-size: 14px;\n  color: #0092F2;\n  cursor: pointer; }\n\n.choose:hover, .choose:active {\n  text-decoration: none;\n  color: #0092F2; }\n\n.close {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #242424; }\n\n.logoImg {\n  max-height: 100px !important;\n  vertical-align: middle;\n  margin-top: 5px; }\n\n.img-crop .total-wrap {\n  padding: 30px; }\n\n.img-crop .crop-wrap {\n  max-width: 100%;\n  max-height: 90%;\n  overflow: hidden; }\n\n.img-crop .crop-img {\n  max-width: 100%;\n  max-height: 100%; }\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n#_load_frame_wrap {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: none;\n  z-index: 1000;\n  background: rgba(88, 88, 88, 0.2); }\n\n#_load_frame {\n  width: 100%;\n  height: 100%;\n  border-top: 1px solid #b6b6b6; }\n\n.imiddle {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n  /* IE 9 */\n  -moz-transform: translate(-50%, -50%);\n  /* Firefox */\n  -webkit-transform: translate(-50%, -50%);\n  /* Safari 和 Chrome */\n  -o-transform: translate(-50%, -50%);\n  text-align: center;\n  /*display: table;*/\n  z-index: 10000; }\n\n.popframe {\n  max-width: 90vw;\n  max-height: 90vh;\n  min-width: 40em;\n  min-height: 30em;\n  border: 2px solid #8e8e8e;\n  box-shadow: 2px 2px 20px #828282;\n  border-radius: 1em;\n  padding-top: 3em;\n  background-color: white; }\n  .popframe .close-btn {\n    position: absolute;\n    right: 0.5em;\n    top: 0.4em;\n    cursor: pointer; }\n  .popframe .title {\n    position: absolute;\n    top: 0.5em;\n    left: 50%;\n    -webkit-transform: translate(-50%, 0);\n            transform: translate(-50%, 0); }\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".error {\n  color: red; }\n\n.field-panel {\n  background-color: #F5F5F5;\n  margin: 20px;\n  padding: 20px 30px;\n  position: relative;\n  border: 1px solid #D9D9D9; }\n  .field-panel:after {\n    content: '';\n    display: block;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    width: 180px;\n    border-radius: 6px;\n    background-color: #fff;\n    z-index: 0; }\n  .field-panel .form-group.field {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start; }\n    .field-panel .form-group.field .field_input {\n      -webkit-box-flex: 0;\n          -ms-flex-positive: 0;\n              flex-grow: 0;\n      padding: 5px 20px; }\n      .field-panel .form-group.field .field_input .ckeditor {\n        padding: 20px; }\n    .field-panel .form-group.field:first-child .control-label {\n      border-top: 5px solid #FFF; }\n    .field-panel .form-group.field .control-label {\n      width: 150px;\n      text-align: right;\n      padding: 5px 30px;\n      z-index: 100;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n      border-top: 1px solid #EEE; }\n  .field-panel .form-group.field .field_input ._tow-col-sel {\n    /*width:750px;*/ }\n  .field-panel .form-group.field .help_text {\n    padding: 10px;\n    color: #999;\n    font-style: italic;\n    font-size: 0.9em; }\n  .field-panel .field.error .error {\n    display: inline-block;\n    vertical-align: top;\n    padding-top: 8px; }\n\n._tow-col-sel select {\n  min-height: 7em; }\n\nimg.img-uploador {\n  max-width: 100px;\n  max-height: 100px; }\n\n.req_star {\n  color: red; }\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".tab-lite {\n  display: inline-block;\n  padding: 0.2em 0.7em;\n  background-color: rgba(76, 173, 247, 0.3);\n  border: 1px solid #7cc9ff;\n  border-radius: 0.2em;\n  margin: 0.2em 0.3em; }\n\n.tab-lite.selected {\n  background-color: rgba(76, 173, 247, 0.6);\n  border: 1px solid #1a6aff; }\n\n.tab-lite .cross {\n  margin-left: 0.8em; }\n\n.tab-lite .cross:hover {\n  cursor: pointer; }\n\n.tab-box {\n  border: 1px solid #f4efeb;\n  padding: 0.2em 0.5em;\n  min-height: 2em;\n  display: inline-block;\n  min-width: 10em; }\n", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.merge = merge;

var _ajax_fun = __webpack_require__(3);

var _file = __webpack_require__(9);

var f = _interopRequireWildcard(_file);

var _ckeditor = __webpack_require__(4);

var ck = _interopRequireWildcard(_ckeditor);

var _multi_sel = __webpack_require__(12);

var multi = _interopRequireWildcard(_multi_sel);

var _inputs = __webpack_require__(10);

var inputs = _interopRequireWildcard(_inputs);

var _link = __webpack_require__(11);

var ln = _interopRequireWildcard(_link);

var _base = __webpack_require__(6);

var _field_page = __webpack_require__(7);

var _backend = __webpack_require__(5);

var _order = __webpack_require__(8);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//import * as fb from './field_base.js'
//import * as js from './adapt.js'

/*
>->front/fields.rst>
=========
fields
=========

fields模块的目标是利用vuejs快速生成form表单。

主要结构
===========
1. field_base
    基类，包括操作逻辑，专用input组件。如果需要修改整个field的外观，可以继承field_base，然后自定义wrap template

2. field
    wrap功能，在field_base外面套上了一层外观template，例如label，error,help_text等的显示。

参数结构
==============
field_base的参数都是采用的关键字参数，结构如下：
使用的 kw 结构
 kw={
     errors:{},
     row:{
         username:'',
         password:'',
         pas2:'',
    },
     heads:[
     	{name:'username',label:'用户名',type:'text',required:true,autofocus:true},
     ]
  }
 <field name='username' :kw='kw' ></field>


<-<
*配合jsonpost使用，效果最好
*/

/*
自动处理form.errors
$.post('',JSON.stringify(post_data),function (data) {
	is_valid(data.do_login,self.meta.errors,function () {
		location=next;
})
*/

//import {use_color} from '../dosome/color.js'
//import {load_js,load_css} from '../dosome/pkg.js'
__webpack_require__(2);

(0, _ajax_fun.hook_ajax_msg)();
(0, _ajax_fun.hook_ajax_csrf)();

var field = {
	mixins: [_base.field_base],
	template: '\n\t\t<div for=\'field\' class="form-group field" :class=\'{"error":error_data(name)}\' v-if="head">\n\t\t<label :for="\'id_\'+name"  class="control-label" v-if=\'!head.no_auto_label\'>\n\t\t\t<span v-text="head.label"></span><span class="req_star" v-if=\'head.required\'>*</span>\n\t\t</label>\n\n\t\t<div class="field_input">\n\t\t\t<component :is=\'head.type\'\n\t\t\t\t:row=\'row\'\n\t\t\t\t:name=\'name\'\n\t\t\t\t:kw=\'head\'>\n\t\t\t</component>\n\t\t</div>\n\t\t<div class="help_text"><span v-text="head.help_text"></span></div>\n\t\t<slot> </slot>\n\t\t<div v-for=\'error in error_data(name)\' v-text=\'error\' class=\'error\'></div>\n\t\t</div>\n\t'

};

Vue.component('field', field);

function update_vue_obj(vue_obj, obj) {
	for (var x in vue_obj) {
		Vue.delete(vue_obj, x);
	}
	for (var _x in obj) {
		Vue.set(vue_obj, _x, obj[_x]);
	}
}

function merge(mains, subs) {
	mains.each(function (first) {
		subs.each(function (second) {
			if (first.name == second.name) {
				for (var x in second) {
					first[x] = second[x];
				}
			}
		});
	});
}

Vue.component('com-form-btn', {
	data: function data() {
		return {
			can_add: can_add,
			can_del: can_del
		};
	},
	props: ['submit', 'del_row', 'cancel'],
	computed: {
		del_link: function del_link() {
			return this.del_row();
		}
	},
	template: '<div style=\'overflow: hidden;\'>\n\t\t<div class="btn-group" style=\'float: right;\'>\n\t\t\t<button type="button" class="btn btn-default" @click=\'submit()\' v-if=\'can_add\'>\u4FDD\u5B58</button>\n\t\t\t<a type="button" class="btn btn-default" v-if=\'can_del &&del_link\' :href=\'del_link\'>\u5220\u9664</a>\n\t\t\t<button type="button" class="btn btn-default" @click=\'cancel()\' >\u53D6\u6D88</button>\n\t\t</div>\n\t</div>'
});

var fieldset_fun = {
	data: function data() {
		return {
			fieldset: fieldset,
			namelist: namelist,
			menu: menu,
			search_args: ex.parseSearch(),
			can_add: can_add,
			can_del: can_del,
			can_log: can_log
		};
	},

	methods: {
		submit: function submit() {
			var self = this;
			(0, _ajax_fun.show_upload)();
			var search = ex.parseSearch();
			var fieldset_row = {};
			for (var k in this.fieldset) {
				fieldset_row[k] = this.fieldset[k].row;
			}

			var post_data = [{ fun: 'save_fieldset', fieldset: fieldset_row, save_step: save_step }];
			ex.post('', JSON.stringify(post_data), function (resp) {
				if (resp.save_fieldset.errors) {
					var error_path = resp.save_fieldset.path;
					ex.set(self.fieldset, error_path, resp.save_fieldset.errors);
					(0, _ajax_fun.hide_upload)(200);
				} else if (search._pop == 1) {
					window.ln.rtWin({ row: resp.save_fieldset.fieldset });
				} else if (search.next) {

					location = decodeURIComponent(search.next);
				} else {
					(0, _ajax_fun.hide_upload)(200);
				}
			});
		},
		cancel: function cancel() {
			var search = ex.parseSearch(); //parseSearch(location.search)
			if (search._pop) {
				window.close();
			} else {
				history.back();
			}
		},
		del_row: function del_row(path) {
			var self = this;
			var search_args = ex.parseSearch();
			var rows = [];
			ex.each(delset, function (name) {
				var row = self.fieldset[name].row;
				if (row.pk) {
					rows.push(row._class + ':' + row.pk);
				}
			});
			if (rows.length > 1) {
				return ex.template('{engine_url}/del_rows?rows={rows}&next={next}&_pop={pop}', { engine_url: engine_url,
					rows: rows,
					next: search_args.next,
					pop: search_args._pop
				});
			} else {
				return null;
			}
		},
		log_url: function log_url() {
			var rows = [];
			for (var k in this.fieldset) {
				var kw = this.fieldset[k];
				rows.push(kw.row._class + ':' + kw.row.pk);
			}
			var obj = {
				rows: rows.join(','),
				engine_url: engine_url
			};
			return ex.template('{engine_url}/log?rows={rows}', obj);
		}
	}
};
window.fieldset_fun = fieldset_fun;

window.field_fun = _field_page.field_fun;
window.hook_ajax_msg = _ajax_fun.hook_ajax_msg;
window.update_vue_obj = update_vue_obj;
window.use_ckeditor = ck.use_ckeditor;
window.show_upload = _ajax_fun.show_upload;
window.hide_upload = _ajax_fun.hide_upload;
window.merge = merge;
window.BackOps = _backend.BackOps;
window.back_ops = _backend.back_ops;
window.order_by_key = _order.order_by_key;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(15);

var tab_lite = {
    // event: close(value)
    template: '<div class="tab-lite">\n        <span v-text="label"></span>\n        <span v-if="!readonly" @click="$emit(\'close\',value)" class="cross">X</span>\n    </div>',
    props: ['value', 'label', 'readonly']
};
Vue.component('com-tab-lite', tab_lite);

var tab_box = {
    template: '  <div class="tab-box">\n        <com-tab-lite :class="{\'selected\':seleced_item==item}" v-for="item in value" :value="item.value" :label="item.label" :readonly="readonly" @close="on_tab_close_click($event)" @click.native="on_tab_click(item)"></com-tab-lite>\n    </div>',
    props: ['value', 'readonly'],
    data: function data() {
        return {
            seleced_item: {}
        };
    },
    methods: {
        on_tab_close_click: function on_tab_close_click(tab_value) {
            ex.remove(this.value, { value: tab_value });
            this.$emit('input', this.value);
        },
        on_tab_click: function on_tab_click(item) {
            this.seleced_item = item;
            this.$emit('selected', item.value);
        }
    }
};
Vue.component('com-tab-box', tab_box);

/***/ })
/******/ ]);