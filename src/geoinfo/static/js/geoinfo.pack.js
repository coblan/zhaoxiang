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


var _polygon_com = __webpack_require__(1);

var polygon_com = _interopRequireWildcard(_polygon_com);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

Vue.component('polygon-input', polygon_com.ploygon_editor);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var ploygon_editor = exports.ploygon_editor = {
    props: ['name', 'row', 'kw'],
    template: '<div>\n            <span v-if="row[name]"><i class="fa fa-map-o fa-2x" aria-hidden="true"></i></span>\n            <button @click="create_new()" title="\u65B0\u5EFA"><i class="fa fa-plus-square-o" aria-hidden="true"></i></button>\n            <button @click="edit()" title="\u7F16\u8F91"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>\n            <button @click="copy()">copy</button>\n            <button @click="paste()">paste</button>\n        </div>',
    methods: {
        create_new: function create_new() {
            //map.clearMap()

            drawer.show();
            drawer.create_polygon(function (polygon) {
                var poly_obj = drawer.insert_polygon(polygon);
                drawer.edit_polygon(poly_obj);
            });
            this.listn_submit();
        },
        edit: function edit() {
            drawer.show();
            if (this.row[this.name]) {
                var polygon = JSON.parse(this.row[this.name]);
                var poly_obj = drawer.insert_polygon(polygon);
                drawer.edit_polygon(poly_obj);
            }
            this.listn_submit();
        },
        listn_submit: function listn_submit() {
            var self = this;
            drawer.onsubmit = function (polygon) {
                var point_arr = ex.map(polygon, function (point) {
                    return [point.lng, point.lat];
                });
                self.row[self.name] = JSON.stringify(point_arr);
            };
        },
        copy: function copy() {
            localStorage.setItem('clip_polygon', this.row[this.name]);
            alert('复制成功!');
        },
        paste: function paste() {
            var clip_polygon = localStorage.getItem('clip_polygon');
            if (clip_polygon) {
                this.row[this.name] = clip_polygon;
            }
            alert('粘贴成功!');
        }
    }
};

/***/ })
/******/ ]);