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


var com_tab_case_cmp = {
    props: ['tab_head', 'par_row'],
    template: '<div class="flex flex-grow">\n        <div style="margin: 1em 2em;width: 30em;">\n            <label for="">\u6848\u4EF6\u7F16\u53F7:</label><span v-text="row.taskid"></span><br/>\n            <label for="">\u6848\u4EF6\u5927\u7C7B:</label><span v-text="row.bigclass"></span><br/>\n            <label for="">\u6848\u4EF6\u5C0F\u7C7B:</label><span v-text="row.litclass"></span><br/>\n            <label for="">\u53D1\u751F\u5730\u5740:</label><span v-text="row.addr"></span><br/>\n            <label for="">\u53D1\u751F\u65F6\u95F4:</label><span v-text="row.subtime"></span><br/>\n            <ul style="overflow: scroll;max-height: 70vh;">\n                <li v-for="pic in row.pic"><img :src="pic" alt="" style="max-width: 300px"/></li>\n            </ul>\n        </div>\n        <div class="flex-grow" style="position: relative;">\n            <com-map ref="map_com"></com-map>\n        </div>\n    </div>',
    data: function data() {
        return {
            heads: this.tab_head.heads,
            ops: this.tab_head.ops,
            errors: {},
            row: {}
        };
    },
    mixins: [mix_fields_data],
    mounted: function mounted() {
        var self = this;
        this.getData(function (row) {
            self.makeMap(row);
        });
    },
    methods: {
        on_show: function on_show() {
            if (!this.fetched) {
                this.getData();
                this.fetched = true;
            }
        },
        getData: function getData(callback) {
            var model_name = this.tab_head.model_name;
            var relat_field = 'pk';
            var dc = { fun: 'get_row', model_name: model_name };
            dc[relat_field] = this.par_row[relat_field];
            var post_data = [dc];
            var self = this;
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                self.row = resp.get_row;
                callback(self.row);
            });
        },
        makeMap: function makeMap(row) {
            var map_com = this.$refs.map_com;
            map_com.on_init(function () {
                var lon = row.loc[0];
                var lat = row.loc[1];
                var marker = new AMap.Marker({
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: [lon, lat],
                    title: ex.template('{bigclass}/{litclass}', row),
                    content: '<div class="red circle"></div>'
                });
                marker.setMap(map_com.map);

                AMap.event.addListener(marker, 'click', function () {
                    var url = ex.template('http://10.231.18.25/INSGRID/caseoperate_flat/XinZeng/EditFeedbackCaseInfo.aspx?KEY={KEY}&TYPE=3&pageindex=0&FanKui=1&sourctType=%E5%8C%BA%E7%BA%A7%E7%9D%A3%E5%AF%9F&categoryId=120', row);
                    window.open(url);
                });

                ex.each(row.near_case, function (lcase) {
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: lcase.loc,
                        title: ex.template('{bigclass}/{litclass}/{subtime}', lcase),
                        content: '<div class="blue circle"></div>'
                    });
                    marker.setMap(map_com.map);

                    AMap.event.addListener(marker, 'click', function () {
                        var url = ex.template('http://10.231.18.25/CityGrid/CaseOperate_flat/ParticularDisplayInfo.aspx?taskid={taskid}', lcase);
                        window.open(url);
                        this.setContent('<div class="dark circle"></div>');
                    });
                });
                map_com.map.setFitView();
            });
        }
    }
};

//Vue.component('com-tab-case-cmp',com_tab_case_cmp)

Vue.component('com-tab-case-cmp', function (resolve, reject) {
    ex.load_js(cfg.js_lib.geoscope_pack_js, function () {
        resolve(com_tab_case_cmp);
    });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _com_tab_case_cmp = __webpack_require__(0);

var case_cmp = _interopRequireWildcard(_com_tab_case_cmp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ })
/******/ ]);