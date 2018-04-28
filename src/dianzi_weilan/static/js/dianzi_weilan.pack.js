/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var field_select_work_inspector = {
    props: ['row', 'head'],
    template: '   <div>\n        <ul v-if=\'head.readonly\'><li v-for=\'value in row[head.name]\' v-text=\'get_label(value)\'></li></ul>\n        <div v-else>\n            <span>\u4ECE\u76D1\u7763\u5458\u5206\u7EC4\uFF1A</span>\n            <select v-model="crt_group">\n                <option  :value="null">---</option>\n                <option  v-for="group in head.groups" :value="group" v-text="group.label"></option>\n            </select>\n            <button @click="add_group()">\u6DFB\u52A0</button>\n            <multi-chosen  v-model=\'row[head.name]\' :id="\'id_\'+head.name"\n                :choices=\'head.options\'\n                ref="select">\n            </multi-chosen>\n        </div>\n    </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    },
    methods: {
        add_group: function add_group() {
            if (this.crt_group) {
                var self = this;
                ex.each(self.crt_group.inspectors, function (inspector_pk) {});
                //var tow_col_sel = this.$refs.two_col_sel
                //ex.each(tow_col_sel.can_select,function(item){
                //    if(ex.isin(item.value,self.crt_group.inspectors)){
                //        tow_col_sel.left_sel.push(item.value)
                //    }
                //})
                //tow_col_sel.batch_add()
            }
        }
    }
};

Vue.component('com-field-select-work-inspector', field_select_work_inspector);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _com_field_select_work_inspector = __webpack_require__(0);

var case_cmp = _interopRequireWildcard(_com_field_select_work_inspector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ })
/******/ ]);