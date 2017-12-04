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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
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

"use strict";


/**
>5>front/table.rst>

table的过滤器
============
::

    class SalaryFilter(RowFilter):
    names=['is_checked']
    range_fields=[{'name':'month','type':'month'}]
    model=SalaryRecords


<-<
 */

__webpack_require__(8);

Vue.component('com-filter', {
    props: ['heads', 'search', 'search_tip'],
    template: ex.template('\n    <form v-if=\'search_tip || heads.length>0\' class="com-filter flex flex-grow flex-ac">\n                <input style="max-width: 20em;min-width: 10em;" v-if=\'search_tip\' type="text" name="_q" v-model=\'search._q\' :placeholder=\'search_tip\' class=\'form-control\'/>\n                <div class="flex row-filter"  style="flex-grow:0;min-width: 10em;">\n                    <!--<component is="sim-filter"  v-model=\'search[filter.name]\' v-if="filter.options"  v-for=\'filter in heads\' :id="\'filter-\'+filter.name"-->\n                    <!--</component>-->\n                     <component :is="filter.type?filter.type:\'sim-filter\'"  :filter="filter" v-model=\'search[filter.name]\' v-if="filter.options"  v-for=\'filter in heads\' :id="\'filter-\'+filter.name">\n                    </component>\n\n                    <!--<select  v-if="filter.options" v-for=\'filter in heads\' :id="\'filter-\'+filter.name"-->\n                        <!--v-model=\'value\' class=\'form-control\' >-->\n                        <!--<option :value="undefined" v-text=\'filter.label\'></option>-->\n                        <!--<option value="">-&#45;&#45;&#45;&#45;&#45;&#45;</option>-->\n                        <!--<option v-for=\'option in orderBy( filter.options,"label")\' :value="option.value" v-text=\'option.label\'></option>-->\n                    <!--</select>-->\n                </div>\n\n                <div  v-for=\'filter in heads\' v-if="[\'time\',\'date\',\'month\'].indexOf(filter.type)!=-1" class="date-filter flex flex-ac">\n                    <span v-text="filter.label"></span>\n                    <span>{From}</span>\n                    <div>\n                         <date v-if="filter.type==\'month\'" set="month" v-model="search[\'_start_\'+filter.name]"></date>\n                        <date v-if="filter.type==\'date\'"  v-model="search[\'_start_\'+filter.name]"></date>\n                    </div>\n                    <span>{To}</span>\n                    <div>\n                        <date v-if="filter.type==\'month\'" set="month" v-model="search[\'_end_\'+filter.name]"></date>\n                        <date v-if="filter.type==\'date\'"  v-model="search[\'_end_\'+filter.name]"></date>\n                    </div>\n\n                </div>\n\n                <slot></slot>\n\n          <button name="go" type="button" class="btn btn-info btn-sm" @click=\'m_submit()\' >{search}</button>\n        </form>\n    ', ex.trList(['From', 'To', 'search'])),
    created: function created() {
        var self = this;
        ex.each(self.heads, function (filter) {
            if (ex.isin(filter.type, ['month', 'date'])) {
                if (!self.search['_start_' + filter.name]) {
                    Vue.set(self.search, '_start_' + filter.name, '');
                }
                if (!self.search['_end_' + filter.name]) {
                    Vue.set(self.search, '_end_' + filter.name, '');
                }
            }
        });
    },
    methods: {
        m_submit: function m_submit() {
            this.$emit('submit');
        },
        orderBy: function orderBy(array, key) {
            return array.slice().sort(function (a, b) {
                if (isChinese(a[key]) && isChinese(b[key])) {
                    return a[key].localeCompare(b[key], 'zh');
                } else {
                    return compare(a[key], b[key]);
                }
            });
        }
    }

});

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

var sim_filter = {
    props: ['filter', 'value'],
    data: function data() {
        return {
            myvalue: this.value
        };
    },
    watch: {
        myvalue: function myvalue(v) {
            this.$emit('input', v);
        }
    },
    methods: {
        orderBy: function orderBy(array, key) {
            return array.slice().sort(function (a, b) {
                if (isChinese(a[key]) && isChinese(b[key])) {
                    return a[key].localeCompare(b[key], 'zh');
                } else {
                    return compare(a[key], b[key]);
                }
            });
        }
    },
    template: '<select  v-if="filter.options"\n    v-model=\'myvalue\' class=\'form-control\' >\n    <option :value="undefined" v-text=\'filter.label\'></option>\n    <option value="">-------</option>\n    <option v-for=\'option in orderBy( filter.options,"label")\' :value="option.value" v-text=\'option.label\'></option>\n    </select>\n\n    '
};
Vue.component('sim-filter', sim_filter);

var sim_filter_with_search = {
    props: ['filter', 'value'],
    data: function data() {
        return {
            myvalue: this.value
        };
    },
    mounted: function mounted() {
        var self = this;
        ex.load_js("/static/lib/bootstrap-select.min.js", function () {
            $(self.$el).selectpicker();
        });
        ex.load_css("/static/lib/bootstrap-select.min.css");
    },
    watch: {
        myvalue: function myvalue(v) {
            this.$emit('input', v);
        }
    },
    methods: {
        orderBy: function orderBy(array, key) {
            return array.slice().sort(function (a, b) {
                if (isChinese(a[key]) && isChinese(b[key])) {
                    return a[key].localeCompare(b[key], 'zh');
                } else {
                    return compare(a[key], b[key]);
                }
            });
        }
    },
    template: '<select class="selectpicker form-control"  data-live-search="true" v-model=\'myvalue\'>\n        <option :value="undefined" v-text=\'filter.label\'></option>\n        <option value="">-------</option>\n        <option v-for=\'option in orderBy( filter.options,"label")\' :value="option.value"\n           :data-tokens="option.label" v-text=\'option.label\'>\n        </option>\n        </select>\n    '
};
Vue.component('sel-search-filter', sim_filter_with_search);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var first_col = {
    props: ['row', 'name'],
    methods: {
        ret: function ret(row) {
            ln.ret(row);
        },
        form_link: function form_link(name, row) {
            return ex.template('{edit}?pk={pk}', { edit: page_name + '.edit',
                pk: row.pk
            });
        },
        is_pop: function is_pop() {
            return search_args._pop;
        }
    },
    template: '<div>\n    <span v-if="is_pop()"  v-text="row[name]" @click="ret(row)" style="cursor: pointer;color: #5d9cd3"></span>\n    <a v-else :href="form_link(name,row)" v-text="row[name]"></a>\n    </div>'
};

Vue.component('first-col', first_col);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./table.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./table.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _filter = __webpack_require__(2);

var myfilter = _interopRequireWildcard(_filter);

var _first_col = __webpack_require__(3);

var first_col = _interopRequireWildcard(_first_col);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
>->front/table.rst>
=========
table
=========

Argments Format:
=================

heads=[{name:'xxx',label:'label1'},
        {name:'jb',label:'jb'}]
rows=[{xxx:"jjy",jb:'hahaer'}]

<-<
 */

__webpack_require__(4);

// 下面这个sort-table应该是不用了的。有空来清理它
Vue.component('sort-table', {
    props: {
        value: {},
        heads: {
            default: function _default() {
                return [];
            }
        },
        rows: {
            default: function _default() {
                return [];
            }
        },
        sort: {
            default: function _default() {
                return [];
            }
        },
        map: {
            default: function _default() {
                return function (name, row) {
                    return row[name];
                };
            }
        }
    },
    data: function data() {
        return {
            icatch: '',
            selected: this.value
        };
    },
    methods: {
        in_sort: function in_sort(name) {
            return this.sort.indexOf(name) != -1;
        },
        get_sort_pos: function get_sort_pos(name) {
            if (name.startsWith('-')) {
                name = name.substr(1);
            }
            var index = this.sort.indexOf(name);
            if (index != -1) {
                return index;
            } else {
                return this.sort.indexOf("-" + name);
            }
        },
        sort_col: function sort_col(name) {
            var pos = this.get_sort_pos(name);
            if (pos == -1) {
                this.sort.push(name);
            } else {
                this.sort[pos] = name;
            }
            this.$dispatch('sort-changed');
        },
        rm_sort: function rm_sort(name) {
            var pos = this.get_sort_pos(name);
            if (pos != -1) {
                this.sort.splice(pos, 1);
            }
            this.$dispatch('sort-changed');
        }
    },
    watch: {
        selected: function selected(v) {
            this.$emit('input', v);
        }
    },
    template: '<table>\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<td style=\'width:50px\' v-if=\'selected\'>\n\t\t\t\t\t\t<input type="checkbox" name="test" value=""/>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td v-for=\'head in heads\' :class=\'"td_"+head.name\'>\n\t\t\t\t\t\t<span v-if=\'head.sortable\' v-text=\'head.label\' class=\'clickable\' @click=\'sort_col(head.name)\'></span>\n\t\t\t\t\t\t<span v-else v-text=\'head.label\'></span>\n\t\t\t\t\t\t<span v-if=\'icatch = get_sort_pos(head.name),icatch!=-1\'>\n\t\t\t\t\t\t\t<span v-text=\'icatch\'></span>\n\t\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-up clickable" v-if=\'in_sort(head.name)\'\n\t\t\t\t\t\t\t\t @click=\'sort_col("-"+head.name)\'></span>\n\t\t\t\t\t\t\t<span v-if=\'in_sort("-"+head.name)\' class="glyphicon  glyphicon-chevron-down clickable"\n\t\t\t\t\t\t\t\t @click=\'sort_col(head.name)\'></span>\n\t\t\t\t\t\t\t<span v-if=\'in_sort(head.name)||in_sort("-"+head.name)\' class="glyphicon glyphicon-remove clickable"\n\t\t\t\t\t\t\t\t @click=\'rm_sort(head.name)\'></span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t\t<tbody>\n\t\t\t\t<tr v-for=\'row in rows\'>\n\t\t\t\t\t<td v-if=\'selected\'><input type="checkbox" name="test" :value="row.pk" v-model=\'selected\'/></td>\n\t\t\t\t\t<td v-for=\'head in heads\' :class=\'"td_"+head.name\'>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<span v-html=\'map(head.name,row)\'></span>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>'
});

var com_table = {
    props: {
        has_check: {},
        heads: {},
        rows: {
            default: function _default() {
                return [];
            }
        },
        map: {},
        row_sort: {
            default: function _default() {
                return { sort_str: '', sortable: [] };
            }
        },
        value: {}
    },
    computed: {
        selected: {
            get: function get() {
                return this.value;
            },
            set: function set(v) {
                this.$emit('input', v);
            }
        }
    },
    watchs: {
        selected: function selected(v) {
            this.$emit('input', v);
        }
    },
    methods: {
        m_map: function m_map(name, row) {
            if (this.map) {
                return this.map(name, row);
            } else {
                return row[name];
            }
        },
        is_sorted: function is_sorted(sort_str, name) {
            var ls = sort_str.split(',');
            var norm_ls = this.filter_minus(ls);
            return ex.isin(name, norm_ls);
        },
        filter_minus: function filter_minus(array) {
            return ex.map(array, function (v) {
                if (v.startsWith('-')) {
                    return v.slice(1);
                } else {
                    return v;
                }
            });
        },
        is_sortable: function is_sortable(name) {
            return ex.isin(name, this.row_sort.sortable);
        },
        toggle: function toggle(sort_str, name) {
            var ls = ex.split(sort_str, ',');
            var norm_ls = this.filter_minus(ls);
            var idx = norm_ls.indexOf(name);
            if (idx != -1) {
                ls[idx] = ls[idx].startsWith('-') ? name : '-' + name;
            } else {
                ls.push(name);
            }
            return ls.join(',');
        },
        toggle_all: function toggle_all(e) {
            var checked = e.currentTarget.checked;
            if (checked) {
                this.selected = ex.map(this.rows, function (row) {
                    return row.pk;
                });
            } else {
                this.selected = [];
            }
        }

    },
    template: '\t<table>\n\t\t<thead>\n\t\t\t<tr >\n\t\t\t\t<th style=\'width:50px\' v-if=\'has_check\'>\n\t\t\t\t\t<input type="checkbox" name="test" value="" @click="toggle_all($event)"/>\n\t\t\t\t</th>\n\t\t\t\t<th v-for=\'head in heads\' :class=\'["td_"+head.name,{"selected":is_sorted(row_sort.sort_str ,head.name )}]\'>\n\t\t\t\t\t<span v-if=\'is_sortable(head.name)\' v-text=\'head.label\' class=\'clickable\'\n\t\t\t\t\t\t@click=\'row_sort.sort_str = toggle( row_sort.sort_str,head.name)\'></span>\n\t\t\t\t\t<span v-else v-text=\'head.label\'></span>\n\t\t\t\t\t<sort-mark class=\'sort-mark\' v-model=\'row_sort.sort_str\' :name=\'head.name\'></sort-mark>\n\t\t\t\t</th>\n\t\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n\t\t\t<tr v-for=\'row in rows\'>\n\t\t\t\t<td v-if=\'has_check\'>\n\t\t\t\t\t<input type="checkbox" name="test" :value="row.pk" v-model=\'selected\'/>\n\t\t\t\t</td>\n\t\t\t\t<td v-for=\'head in heads\' :class=\'"td_"+head.name\'>\n\t\t\t\t    <component v-if="head.type" :is="head.type" :name="head.name" :row="row"></component>\n\t\t\t\t\t<span v-else v-html=\'m_map(head.name,row)\'></span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>'
};

Vue.component('com-table', com_table);

//<component v-if='icatch = map(head.name,row),icatch.com' :is='icatch.com' :kw='icatch.kw'></component>

/*
Argments:
==========

nums = ['1','...','6_a','7','8','...','999']

Events:
=======

goto_page,num

*/

Vue.component('paginator', {
    props: ['nums', 'crt', 'set'],
    data: function data() {
        return {
            input_num: this.crt || 1
        };
    },

    methods: {
        goto_page: function goto_page(num) {
            if (!isNaN(parseInt(num))) {
                this.$emit('goto_page', num);
            }
        }
    },
    template: ex.template('\n    <div class="paginator">\n    <ul class="pagination page-num">\n    <li v-for=\'num in nums\' track-by="$index" :class=\'{"clickable": !isNaN(parseInt(num))}\' @click=\'goto_page(num)\'>\n    <span v-text=\'!isNaN(parseInt(num))? parseInt(num):num\' :class=\'{"active":parseInt(num) ==parseInt(crt)}\'></span>\n    </li>\n    </ul>\n    <div v-if="set==\'jump\'" class="page-input-block">\n        <input type="text" v-model="input_num"/>\n        <button type="button" class="btn btn-success btn-xs" @click="goto_page(input_num)">{jump}</button>\n    </div>\n    </div>\n    ', ex.trList(['jump']))
});

var build_table_args = {
    // 这个函数应该没用了 ，其功能被 filters object 属性 取代了。--2017/1/19日
    methods: {
        get_filter_obj: function get_filter_obj() {
            //var search_str=''
            var filter_obj = {};
            for (var x = 0; x < this.filters.length; x++) {
                var filter = this.filters[x];
                if (filter.value) {
                    filter_obj[filter.name] = filter.value;
                    //search_str+= filter.name+'='+filter.value+'&'
                }
            }
            if (this.q) {
                filter_obj['_q'] = this.q;
                //search_str+='_q='+this.q+'&'
            }
            return filter_obj;
            //return search_str
        },
        get_sort_str: function get_sort_str() {
            var sort_str = '';
            for (var x = 0; x < this.sort.length; x++) {
                sort_str += this.sort[x] + ',';
            }
            return sort_str;
        },
        refresh_arg: function refresh_arg() {
            var filter_obj = this.get_filter_obj();
            var sort_str = this.get_sort_str();
            var search_obj = { '_sort': sort_str };
            update(search_obj, filter_obj);
            location.search = searchfy(search_obj);
            //location.search='_sort='+sort_str+'&'+search_str
        },
        goto_page: function goto_page(num) {
            var filter_obj = this.get_filter_obj();
            var sort_str = this.get_sort_str();
            var search_obj = { '_sort': sort_str, '_page': num };
            update(search_obj, filter_obj);
            location.search = searchfy(search_obj);
            //location.search='_sort='+sort_str+'&'+search_str+'_page='+num
        }
    },
    events: {
        'sort-changed': function sortChanged() {
            this.refresh_arg();
        }

    }
};

var table_fun = {
    data: function data() {
        heads[0].type = 'first-col';

        return {
            heads: heads,
            rows: rows,
            row_filters: row_filters,
            row_sort: row_sort,
            row_pages: row_pages,
            search_tip: search_tip,
            selected: [],
            del_info: [],
            menu: menu,

            can_add: can_add,
            can_del: can_del,
            can_edit: can_edit,

            search_args: ex.parseSearch(),
            ex: ex,
            help_url: help_url
        };
    },
    watch: {
        'row_sort.sort_str': function row_sortSort_str(v) {
            this.search_args._sort = v;
            this.search();
        }
    },
    methods: {
        goto: function goto(url) {
            location = url;
        },
        search: function search() {
            location = ex.appendSearch(this.search_args);
            //location =ex.template('{path}{search}',{path:location.pathname,
            //    search: encodeURI(ex.searchfy(this.search_args,'?')) })
        },
        //rt_win:function(row){
        //    ln.rtWin(row)
        //},
        filter_minus: function filter_minus(array) {
            // 移到 com-table 中去了
            return ex.map(array, function (v) {
                if (v.startsWith('-')) {
                    return v.slice(1);
                } else {
                    return v;
                }
            });
        },
        is_sorted: function is_sorted(sort_str, name) {
            // 该函数被移到 com-table 中去了。
            var ls = sort_str.split(',');
            var norm_ls = this.filter_minus(ls);
            return ex.isin(name, norm_ls);
        },
        // 我放到 com table 去，试试。如果行，证明这里的无用了。
        toggle: function toggle(sort_str, name) {
            var ls = ex.split(sort_str, ',');
            var norm_ls = this.filter_minus(ls);
            var idx = norm_ls.indexOf(name);
            if (idx != -1) {
                ls[idx] = ls[idx].startsWith('-') ? name : '-' + name;
            } else {
                ls.push(name);
            }
            return ls.join(',');
        },
        remove_sort: function remove_sort(sort_str, name) {
            var ls = ex.split(sort_str, ',');
            ls = ex.filter(ls, function (v) {
                return v != '-' + name && v != name;
            });
            return ls.join(',');
        },
        map: function map(name, row) {
            var content = row[name];
            //if(name==this.heads[0].name){
            //    if(this.search_args._pop){
            //        return '<a onclick="ln.ret(row)">'+row[name]+'</a>'
            //    }else{
            //        return this.form_link(name,row)
            //    }
            //}else
            if (content === true) {
                return '<img src="//res.enjoyst.com/true.png" width="15px" />';
            } else if (content === false) {
                return '<img src="//res.enjoyst.com/false.png" width="15px" />';
            } else {
                return content;
            }
        },
        form_link: function form_link(name, row) {
            return ex.template('<a href="{edit}?pk={pk}&next={next}">{value}</a>', { edit: page_name + '.edit',
                pk: row.pk,
                next: encodeURIComponent(location.href),
                value: row[name]
            });
        },

        del_item: function del_item() {
            if (this.selected.length == 0) {
                return;
            }
            var del_obj = {};
            for (var j = 0; j < this.selected.length; j++) {
                var pk = this.selected[j];
                for (var i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].pk.toString() == pk) {
                        if (!del_obj[this.rows[i]._class]) {
                            del_obj[this.rows[i]._class] = [];
                        }
                        del_obj[this.rows[i]._class].push(pk);
                    }
                }
            }
            var out_str = '';
            for (var key in del_obj) {
                out_str += key + ':' + del_obj[key].join(':') + ',';
            }
            location = ex.template("{engine_url}/del_rows?rows={rows}&next={next}", { engine_url: engine_url,
                rows: encodeURI(out_str),
                next: encodeURIComponent(location.href) });
        },
        goto_page: function goto_page(page) {
            this.search_args._page = page;
            this.search();
        },
        add_new: function add_new() {
            var url = ex.template('{engine_url}/{page}.edit/?next={next}', {
                engine_url: engine_url,
                page: page_name,
                next: encodeURIComponent(location.href)
            });
            location = url;
        }
    }

};

var com_table_btn = {
    data: function data() {
        return {
            can_add: can_add,
            can_del: can_del
        };
    },
    props: ['add_new', 'del_item'],
    template: '<div class=\'btn-group\'>\n            <slot></slot>\n\t\t\t<button type="button" class="btn btn-success btn-sm" @click=\'add_new()\' v-if=\'can_add\'>\u521B\u5EFA</button>\n\t\t\t<button type="button" class="btn btn-danger btn-sm" @click=\'del_item()\' v-if=\'can_del\'>\u5220\u9664</button>\n\n\t\t</div>'
};

Vue.component('com-table-btn', com_table_btn);

Vue.component('sort-mark', {
    props: ['value', 'name'],
    data: function data() {
        return {
            index: -1,
            sort_str: this.value
        };
    },
    mixins: [table_fun],
    template: '<span class=\'sort-mark\'>\n\t\t\t<span v-if=\'index>0\' v-text=\'index\'></span>\n\t\t\t<img v-if=\'status=="up"\' src=\'http://res.enjoyst.com/image/up_01.png\'\n\t\t\t\t\t @click=\'sort_str=toggle(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t<img v-if=\'status=="down"\' src=\'http://res.enjoyst.com/image/down_01.png\'\n\t\t\t\t\t @click=\'sort_str=toggle(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t<img v-if=\'status!="no_sort"\' src=\'http://res.enjoyst.com/image/cross.png\' \n\t\t\t\t\t@click=\'sort_str=remove_sort(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t</span>\n\t',
    computed: {
        status: function status() {
            var sorted = this.value.split(',');
            for (var x = 0; x < sorted.length; x++) {
                var org_name = sorted[x];
                if (org_name.startsWith('-')) {
                    var name = org_name.slice(1);
                    var minus = 'up';
                } else {
                    var name = org_name;
                    var minus = 'down';
                }
                if (name == this.name) {
                    this.index = x + 1;
                    return minus;
                }
            }
            return 'no_sort';
        }
    }
    //methods:{

    //	get_status:function () {
    //		var sorted=this.sort_str.split(',')
    //		for(var x=0;x<sorted.length;x++){
    //			var org_name=sorted[x]
    //			if(org_name.startsWith('-')){
    //				var name=org_name.slice(1)
    //				var minus='up'
    //			}else{
    //				var name=org_name
    //				var minus='down'
    //			}
    //			if(name==this.name){
    //				this.index=x+1
    //				return minus
    //			}
    //		}
    //		return 'no_sort'
    //	}
    //}

});

window.table_fun = table_fun;
window.build_table_args = build_table_args;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "table.fake-suit {\n  border: 1px solid #DDD;\n  border-radius: 6px; }\n  table.fake-suit th {\n    font-weight: bold;\n    background-color: #e5e5e5;\n    background-image: linear-gradient(to bottom, #f3f3f3, #e5e5e5); }\n  table.fake-suit td {\n    border-left: 1px solid #F5F5F5; }\n  table.fake-suit tr > td:first-child {\n    border-left: none; }\n  table.fake-suit tbody tr {\n    background-color: white; }\n  table.fake-suit tbody td {\n    border-top: 1px solid #E7E7E7;\n    padding-top: 3px;\n    padding-bottom: 3px; }\n  table.fake-suit tbody tr:nth-child(even) {\n    background-color: #FAFAFA; }\n  table.fake-suit tbody tr:hover {\n    background-color: #F5F5F5; }\n\n.paginator input {\n  width: 20px; }\n\n.paginator .page-input-block {\n  display: inline-block; }\n\n.paginator button {\n  vertical-align: top; }\n\n.sort-mark img {\n  width: 10px; }\n\nul.pagination li {\n  display: inline;\n  cursor: pointer; }\n\nul.pagination li span {\n  color: black;\n  float: left;\n  padding: 4px 10px;\n  text-decoration: none;\n  border: 1px solid #ddd; }\n\nul.pagination li span.active {\n  background-color: #4CAF50;\n  color: white; }\n\nul.pagination li span:hover:not(.active) {\n  background-color: #ddd; }\n\n.com-filter .date-filter {\n  padding-left: 10px; }\n  .com-filter .date-filter span {\n    padding-left: 5px; }\n  .com-filter .date-filter .datetime-picker {\n    min-width: 10em;\n    max-width: 14em; }\n\n.clickable {\n  cursor: pointer;\n  color: #39718e; }\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".date-filter {\n  margin: 0 1em; }\n\n.com-filter {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n\n.row-filter .bootstrap-select {\n  min-width: 10em; }\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./table_filter.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./table_filter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);