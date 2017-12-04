/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
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
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _muban = __webpack_require__(1);

var _flowchart = __webpack_require__(2);

var liucheng = _interopRequireWildcard(_flowchart);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.MubanManager = _muban.MubanManager;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MubanManager = exports.MubanManager = function () {
    function MubanManager(muban_table_url) {
        _classCallCheck(this, MubanManager);

        this.table_url = muban_table_url;
        this.vue_inst = null;
        this.select_callback = null;
    }

    _createClass(MubanManager, [{
        key: 'select',
        value: function select(callback) {
            if (!this.vue_inst) {
                this.vue_inst = this._mount();
            }
            var self = this;
            this.vue_inst.show_me = true;
            this.select_callback = function (row) {
                callback(row);
                self.vue_inst.show_me = false;
            };
        }
    }, {
        key: '_mount',
        value: function _mount() {
            $('body').append('<div id="_muban_list">\n        <modal v-show="show_me" @click.native="show_me=false">\n              <muban-list class="muban-list" @click.native.stop="" table_url="' + this.table_url + '"></muban-list>\n        </modal>\n        </div>');
            var manager = this;
            window._muban_list = new Vue({
                el: '#_muban_list',
                data: {
                    show_me: false
                },
                mounted: function mounted() {
                    this.$on('row-click', function (row) {
                        manager.select_callback(row);
                    });
                }
            });
            return window._muban_list;
        }
    }]);

    return MubanManager;
}();

function emit_to_parent(com_inst, event_name, arg) {
    var par = com_inst.$parent;
    while (par) {
        var rt = par.$emit(event_name, arg);
        par = par.$parent;
    }
}

var muban_list = {
    props: ['table_url'],
    data: function data() {
        return {
            heads: [],
            rows: [],
            row_pages: {
                options: [],
                crt_page: 1
            }
        };
    },
    mixins: [table_fun],
    mounted: function mounted() {
        this.goto_page(1);
    },
    methods: {
        goto_page: function goto_page(page_num) {
            var self = this;
            var url = ex.appendSearch(this.table_url, { _page: page_num });
            ex.get(url, function (resp) {

                self.heads = resp.heads;
                self.rows = resp.rows;
                self.row_pages = resp.row_pages;

                self.heads[0].type = "click-td";
                ex.each(self.heads, function (head) {
                    if (head.name == 'relations') {
                        head.type = "flowchart-td";
                    }
                });
            });
        }
    },
    template: '<div>\n        <com-table class=\'table fake-suit\' :has_check="false" :map="map"\n            :heads="heads" :rows="rows" v-model="selected"></com-table>\n\n        <paginator :nums=\'row_pages.options\' :crt=\'row_pages.crt_page\' @goto_page=\'goto_page($event)\'></paginator>\n    </div>'
};
Vue.component('muban-list', muban_list);

var click_td = {
    props: ['name', 'row'],
    template: '<span style="cursor: pointer;"  @click="on_click()" v-text="row[name]"></span>',
    methods: {
        on_click: function on_click() {
            //this.$parent.$emit('row-click',this.row)
            emit_to_parent(this, 'row-click', this.row);
        }
    }
};
Vue.component('click-td', click_td);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);

var flowchart_base = {
    template: '<div class="mermaid" v-text="memraid_text">\n    </div>',
    props: ['node_group'],
    mounted: function mounted() {},
    computed: {
        memraid_text: function memraid_text() {
            var text = "graph LR;";
            ex.each(this.node_group.nodes, function (node) {
                if (node.short_desp) {
                    text += ex.template('{id}["{desp}"];', { id: node.id, desp: node.short_desp });
                } else {
                    text += ex.template('{id};', { id: node.id });
                }
            });
            ex.each(this.node_group.relations, function (relation) {
                text += ex.template("{src}-->{dst};", { src: relation[0], dst: relation[1] });
            });
            ex.each(this.node_group.nodes, function (node) {
                text += 'class ' + node.pk + ' ' + node.status + ';';
            });
            return text;
        }
    }
};
Vue.component('com-flowchart', flowchart_base);

var flowchart_td = {
    props: ['name', 'row'],
    template: ' <div class="mermaid" v-text="memraid_text"></div>',
    mounted: function mounted() {
        this.render();
    },
    watch: {
        memraid_text: function memraid_text() {
            this.render();
        }
    },
    computed: {
        node_group: function node_group() {
            var node_group_local = ex.copy(this.row);
            //node_group_local.relations=JSON.parse(node_group_local.relations)
            return node_group_local;
        },
        memraid_text: function memraid_text() {
            var text = "graph LR;";
            ex.each(this.node_group.nodes, function (node) {
                if (node.short_desp) {
                    text += ex.template('{id}["{desp}"];', { id: node.id, desp: node.short_desp });
                } else {
                    text += ex.template('{id};', { id: node.id });
                }
            });
            ex.each(this.node_group.relations, function (relation) {
                text += ex.template("{src}-->{dst};", { src: relation[0], dst: relation[1] });
            });

            ex.each(this.node_group.nodes, function (node) {
                text += 'class ' + node.pk + ' ' + node.status + ';';
            });
            return text;
        }
    },
    methods: {
        render: function render() {
            var self = this;
            $(this.$el).attr('data-processed', '');
            Vue.nextTick(function () {
                mermaid.init({ noteMargin: 10 }, self.$el);
            });
        }
    }

};
Vue.component('flowchart-td', flowchart_td);

var mb_flowchart_base = {
    template: '<div class="mermaid" v-text="memraid_text">\n    </div>',
    props: ['node_group'],
    mounted: function mounted() {
        this.render();
    },
    watch: {
        memraid_text: function memraid_text() {
            this.render();
        }
    },
    computed: {
        memraid_text: function memraid_text() {
            var text = "graph TB;";
            ex.each(this.node_group.nodes, function (node) {
                if (node.short_desp) {
                    text += ex.template('{id}["{desp}"];', { id: node.id, desp: node.short_desp });
                } else {
                    text += ex.template('{id};', { id: node.id });
                }
            });
            ex.each(this.node_group.relations, function (relation) {
                text += ex.template("{src}-->{dst};", { src: relation[0], dst: relation[1] });
            });
            ex.each(this.node_group.nodes, function (node) {
                text += 'class ' + node.pk + ' ' + node.status + ';';
            });
            return text;
        }
    },
    methods: {
        render: function render() {
            var self = this;
            $(this.$el).attr('data-processed', '');
            Vue.nextTick(function () {
                mermaid.init({ noteMargin: 10 }, self.$el);
            });
        }
    }
};
Vue.component('com-flowchart_mb', mb_flowchart_base);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(6)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../../../../coblan/webcode/node_modules/.0.26.1@css-loader/index.js!./../../../../../../coblan/webcode/node_modules/.6.0.0@sass-loader/lib/loader.js!./flowchart.scss", function() {
			var newContent = require("!!./../../../../../../coblan/webcode/node_modules/.0.26.1@css-loader/index.js!./../../../../../../coblan/webcode/node_modules/.6.0.0@sass-loader/lib/loader.js!./flowchart.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, ".node.working rect {\n  fill: #4fafff; }\n\n.node.finish rect {\n  fill: #61c11a; }\n", ""]);

// exports


/***/ }),
/* 5 */
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
/* 6 */
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


/***/ })
/******/ ]);