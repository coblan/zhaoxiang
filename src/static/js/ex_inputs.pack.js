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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*

>->comp/catalog.rst>

=============
catalog
=============
用于显示和编辑树状结构。该模块有对应的后端，用于编辑数据库。

前端组件
=========

使用示例::

     <com-catalog ref="catalog" url="/dir_mana" :root="{pk:null,name:'root'}" @dirclick="on_dirclick($event)"
     @itemclick="on_itemclick($event)" @state_change="set_state($event)" :editable="true"></com-catalog>

url:
    连接后端的地址

root:
    根元素，如果没有，就虚拟一个
editable:
    目前决定了catalog是否显示checkbox

使用时，在外部捕捉dirclick,itemclick,state_change。其中state事件会传出com-catalog的各种状态，这些状态用于告诉parent，可以执行的命令。

。。Note:: com-catalog自带create和delete功能，但是不具备修改save功能，（因为验证错误无处显示），所以client需要自己定义保存函数。

<-<
* */

__webpack_require__(2);

var com_catalog = {
    props: ['url', 'root', 'editable'],
    data: function data() {

        return {
            dirs: [],
            items: [],
            org_parents: [],
            crt_dir: this.root,
            selected: [],
            cut_list: []

        };
    },
    mounted: function mounted() {
        this.dir_data(this.root);
    },
    computed: {
        agent: function agent() {
            return {
                selected: this.selected
            };
        },
        parents: function parents() {
            if (!this.root.pk) {
                return this.org_parents;
            } else {
                var root_obj = ex.findone(this.org_parents, { pk: root.pk });
                var idx = this.org_parents.indexOf(root_obj);
                return this.org_parents.slice(idx);
            }
        },
        state: function state() {
            return {
                can_cut: this.can_cut,
                can_paste: this.can_paste,
                has_select: this.selected.length > 0
            };
        },
        can_cut: function can_cut() {
            if (this.selected.length > 0) {
                return true;
            }
        },
        can_paste: function can_paste() {
            return this.cut_list.length > 0;
        }
    },
    watch: {
        state: function state(v) {
            this.$emit('state_change', v);
        }
    },
    methods: {
        dir_data: function dir_data(par) {
            this.crt_dir = par || this.crt_dir;

            var self = this;
            this.selected = [];
            var url = this.url + ex.template('?_op=dir_data:par:{par}', { par: this.crt_dir.pk });
            ex.get(url, function (resp) {
                self.dirs = resp.dir_data.dirs;
                self.items = resp.dir_data.items;
                self.org_parents = resp.dir_data.parents;
            });
        },
        dir_create: function dir_create() {
            var self = this;
            show_upload();
            var url = this.url + ex.template('?_op=dir_create:par:{par}', { par: this.crt_dir.pk });
            ex.get(url, function (resp) {
                self.dirs.push(resp.dir_create);
                hide_upload(200);
            });
        },
        item_create: function item_create() {
            var self = this;
            var url = this.url + ex.template('?_op=item_create:par:{par}', { par: this.crt_dir.pk });
            ex.get(url, function (resp) {
                self.items.push(resp.item_create);
            });
        },
        cut: function cut() {
            this.cut_list = this.selected.slice();
        },
        paste: function paste() {
            var self = this;
            var post_data = [{ fun: 'items_paste', rows: this.cut_list, par: this.crt_dir.pk }];
            self.cut_list = [];
            ex.post(this.url, JSON.stringify(post_data), function (resp) {
                self.dir_data(self.crt_dir);
            });
        },
        item_del: function item_del() {
            var self = this;
            show_upload();
            var obj = {};
            ex.each(this.selected, function (item) {
                if (!obj[item._class]) {
                    obj[item._class] = item.pk;
                } else {
                    obj[item._class] += ':' + item.pk;
                }
            });
            var del_str = '';
            for (var k in obj) {
                del_str += k + ':' + obj[k] + ',';
            }
            location = engine_url + '/del_rows?rows=' + del_str + '&next=' + encodeURIComponent(location.href);
        },

        toggle_check: function toggle_check(v) {
            if (ex.isin(v, this.selected)) {
                ex.remove(this.selected, v);
            } else {
                this.selected.push(v);
            }
        }
    },
    template: '<div class="com-catalog">\n    <div class="flex">\n        <ol class="breadcrumb flex-grow">\n            <li ><span  @click="dir_data(root)" v-text="root.name">root</span></li>\n            <li v-for="dir in parents" ><span v-text="dir.name" href="#" @click="dir_data(dir);$emit(\'dirclick\',dir)" ></span></li>\n        </ol>\n        <slot name="head_end"></slot>\n    </div>\n\n    <div class="bd">\n        <ul>\n        <li v-for="dir in dirs" class="dir">\n            <slot  name="check_sel" :value="dir" :toggle_check="toggle_check" :selected="selected">\n                <input v-if="editable" type="checkbox" :value="dir" v-model="selected"/>\n            </slot>\n\n            <slot dir_icon>\n                <i class="fa fa-folder" aria-hidden="true"></i>\n            </slot>\n\n            <span v-text="dir.name" class="clickable name" @click="dir_data(dir);$emit(\'dirclick\',dir)"></span>\n            <slot name="btn-panel" :selected="selected" :item="dir"></slot>\n        </li>\n        <li v-for="item in items" :key="item.pk" class="item">\n            <slot name="check_sel" :value="item" :toggle_check="toggle_check" :selected="selected">\n                <input v-if="editable" type="checkbox" :value="item" v-model="selected"/>\n            </slot>\n            <slot name="item_icon">\n                <i class="fa fa-file-o" aria-hidden="true"></i>\n            </slot>\n            <span v-text="item.name" class="clickable name" @click="$emit(\'itemclick\',item)"></span>\n            <slot name="btn-panel" :selected="selected" :item="item"></slot>\n         </li>\n        </ul>\n    </div>\n    </div>'

};

Vue.component('com-catalog', com_catalog);

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../node_modules/.0.26.1@css-loader/index.js!./../../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./catalog.scss", function() {
			var newContent = require("!!./../../../../node_modules/.0.26.1@css-loader/index.js!./../../../../node_modules/.1.3.3@postcss-loader/index.js??ref--1-2!./../../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./catalog.scss");
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

exports = module.exports = __webpack_require__(4)();
// imports


// module
exports.push([module.i, ".com-catalog.mobile .dir .name {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n.com-catalog.mobile .item .name {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n.com-catalog.mobile .breadcrumb {\n  font-size: 1.5em; }\n\n.com-catalog.mobile .bd {\n  background-color: white; }\n  .com-catalog.mobile .bd li {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    padding: 10px 15px;\n    position: relative;\n    font-size: 1.3em; }\n    .com-catalog.mobile .bd li .fa {\n      padding: 0 0.5em; }\n  .com-catalog.mobile .bd li:before {\n    content: ' ';\n    border-bottom: 1px solid #f3f0ed;\n    position: absolute;\n    left: 15px;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    /*color: red;*/\n    height: 1px; }\n  .com-catalog.mobile .bd li.dir:after {\n    content: \" \";\n    display: inline-block;\n    height: 6px;\n    width: 6px;\n    border-width: 2px 2px 0 0;\n    border-color: #c8c8cd;\n    border-style: solid;\n    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);\n    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);\n    position: relative;\n    top: -2px;\n    position: absolute;\n    top: 50%;\n    margin-top: -4px;\n    right: 6px; }\n", ""]);

// exports


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _catalog = __webpack_require__(0);

var catalog = _interopRequireWildcard(_catalog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ })
/******/ ]);