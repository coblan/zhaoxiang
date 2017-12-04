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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 >5>mobile/table.rst>

 table的过滤器
 ============
 ::

 class SalaryFilter(RowFilter):
 names=['is_checked']
 range_fields=[{'name':'month','type':'month'}]
 model=SalaryRecords

 <-<
 */

var com_filter = {
    props: ['row_filters', 'search_args', 'search_tip'],
    computed: {
        option_filters: function option_filters() {
            return ex.filter(this.row_filters, function (head) {
                return head.options;
            });
        },
        time_filters: function time_filters() {
            var time_spans = ex.filter(this.row_filters, function (head) {
                return ex.isin(head.type, ['time', 'date', 'month']);
            });
            return time_spans;
        }
    },
    template: ex.template('\n    <div>\n    <div class="weui-panel" v-if=\'search_tip\'>\n        <div class="weui-cells__title">\u641C\u7D22</div>\n        <div class="weui-cells weui-cells_form">\n            <div class="weui-cell">\n                <div class="weui-cell__hd" >\n                    <label for=\'\'  class="weui-label">\u5173\u952E\u5B57</label>\n                </div>\n                 <div class="weui-cell__bd">\n                      <input v-if=\'search_tip\' class="weui-input" type="text" name="_q" v-model=\'search_args._q\' :placeholder=\'"\u8BF7\u8F93\u5165"+search_tip\'/>\n                 </div>\n\n            </div>\n        </div>\n    </div>\n\n\n    <div class="weui-panel" v-if=\'option_filters.length>0\'>\n\n        <div class="weui-cells__title">\u9009\u62E9\u8FC7\u6EE4</div>\n        <div class="weui-cells weui-cells_form">\n            <div class="weui-cell weui-cell_select weui-cell_select-after" v-for=\'filter in option_filters\'>\n                <div class="weui-cell__hd" >\n                    <label for=\'\'  class="weui-label">\n                        <span v-text=\'filter.label\'></span>\n                    </label>\n                </div>\n                <div class="weui-cell__bd">\n                    <select v-if="filter.options" name=""   v-model=\'search_args[filter.name]\' class=\'weui-select\'>\n                        <!--<option :value="undefined" v-text=\'filter.label\'></option>-->\n                        <option :value="null">----</option>\n                        <option v-for=\'option in filter.options\' :value="option.value" v-text=\'option.label\'></option>\n                    </select>\n                </div>\n            </div>\n        </div>\n    </div>\n            <!--<input v-if=\'search_tip\' type="text" name="_q" v-model=\'search._q\' :placeholder=\'search_tip\' class=\'form-control\'/>-->\n   <div class="weui-panel" v-if="time_filters.length>0">\n        <div class="weui-cells__title">\u65F6\u95F4\u6BB5</div>\n        <div  v-for=\'filter in time_filters\'  class="weui-cells weui-cells_form date-filter">\n            <div class="weui-cell">\n                 <div class="weui-cell__hd" >\n                    <label for=\'\'  class="weui-label">\n                        <span>\u4ECE</span>\n                    </label>\n                </div>\n                 <div class="weui-cell__bd">\n                     <date v-if="filter.type==\'month\'" set="month" v-model="search_args[\'_start_\'+filter.name]" ></date>\n                     <date v-if="filter.type==\'date\'"  v-model="search_args[\'_start_\'+filter.name]" ></date>\n                </div>\n            </div>\n            <div class="weui-cell">\n                <div class="weui-cell__hd" >\n                    <label for=\'\'  class="weui-label">\n                        <span>\u5230</span>\n                    </label>\n                </div>\n                <div class="weui-cell__bd">\n                      <date v-if="filter.type==\'month\'" set="month" v-model="search_args[\'_end_\'+filter.name]"></date>\n                      <date v-if="filter.type==\'date\'"  v-model="search_args[\'_end_\'+filter.name]" ></date>\n                </div>\n            </div>\n        </div>\n   </div>\n            <slot></slot>\n            <!--<button name="go" type="button" class="btn btn-info" @click=\'m_submit()\' >{submit}</button>-->\n\n\n    </div>\n    ', ex.trList(['From', 'To', 'submit'])),
    created: function created() {
        var self = this;
        ex.each(self.row_filters, function (filter) {
            // 初始化 Vue 变量属性。
            if (ex.isin(filter.type, ['month', 'date'])) {
                if (!self.search_args['_start_' + filter.name]) {
                    Vue.set(self.search_args, '_start_' + filter.name, '');
                }
                if (!self.search_args['_end_' + filter.name]) {
                    Vue.set(self.search_args, '_end_' + filter.name, '');
                }
            }
        });
    },
    methods: {
        m_submit: function m_submit() {
            this.$emit('submit');
            //if(this.submit){
            //    this.submit()
            //}else{
            //    location =ex.template('{path}{search}',{path:location.pathname,
            //        search: encodeURI(ex.searchfy(this.search,'?')) })
            //}
        }
    }

};
Vue.component('com-filter', com_filter);

var com_sort = {
    props: ['row_sort'],
    template: '\n    <div class="weui-panel" v-if="">\n    </div>\n    '
};

Vue.component('com-sort', com_sort);

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
        }
    },
    template: '\t<table>\n\t\t<thead>\n\t\t\t<tr >\n\t\t\t\t<th style=\'width:50px\' v-if=\'has_check\'>\n\t\t\t\t\t<input type="checkbox" name="test" value=""/>\n\t\t\t\t</th>\n\t\t\t\t<th v-for=\'head in heads\' :class=\'["td_"+head.name,{"selected":is_sorted(row_sort.sort_str ,head.name )}]\'>\n\t\t\t\t\t<span v-if=\'is_sortable(head.name)\' v-text=\'head.label\' class=\'clickable\'\n\t\t\t\t\t\t@click=\'row_sort.sort_str = toggle( row_sort.sort_str,head.name)\'></span>\n\t\t\t\t\t<span v-else v-text=\'head.label\'></span>\n\t\t\t\t\t<sort-mark class=\'sort-mark\' v-model=\'row_sort.sort_str\' :name=\'head.name\'></sort-mark>\n\t\t\t\t</th>\n\t\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n\t\t\t<tr v-for=\'row in rows\'>\n\t\t\t\t<td v-if=\'has_check\'>\n\t\t\t\t\t<input type="checkbox" name="test" :value="row.pk" v-model=\'selected\'/>\n\t\t\t\t</td>\n\t\t\t\t<td v-for=\'head in heads\' :class=\'"td_"+head.name\'>\n\t\t\t\t\t<span v-html=\'m_map(head.name,row)\'></span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>'
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
            search_args: search_args,
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
    computed: {
        can_search: function can_search() {
            if (this.row_filters.length > 0 || this.row_sort.length > 0 || this.search_tip) {
                return true;
            } else {
                return false;
            }
        },
        has_next_page: function has_next_page() {
            var final = row_pages.options[row_pages.options.length - 1];
            return row_pages.crt_page < parseInt(final);
        }
    },
    methods: {
        goto: function goto(url) {
            location = url;
        },
        search: function search() {
            location = ex.template('{path}{search}', { path: location.pathname,
                search: encodeURI(ex.searchfy(this.search_args, '?')) });
        },
        load_next_page: function load_next_page() {
            var self = this;
            ex.get(ex.appendSearch({ _page: row_pages.crt_page + 1 }), function (resp) {
                ex.assign(row_pages, resp.row_pages);
                self.rows = self.rows.concat(resp.rows);
            });
        },
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
            if (this.search_args._pop) {
                ln.rtWin(row);
            } else if (name == this.heads[0].name) {
                return this.form_link(name, row);
            } else if (content === true) {
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
            // 启用
            var url = ex.template('{engine_url}/{page}.edit?next={next}', {
                engine_url: engine_url,
                page: page_name,
                next: encodeURIComponent(location.href)
            });
            location = url; //ex.appendSearch(url,search_args)
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
    template: '<div class=\'btn-group\' style=\'float: right;\'>\n            <slot></slot>\n\t\t\t<a type="button" class="btn btn-success btn-sm" :href=\'add_new()\' v-if=\'can_add\' role="button">\u521B\u5EFA</a>\n\t\t\t<button type="button" class="btn btn-danger btn-sm" @click=\'del_item()\' v-if=\'can_del\'>\u5220\u9664</button>\n\t\t</div>'
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
    template: '<div class=\'sort-mark\'>\n\t\t\t<span v-if=\'index>0\' v-text=\'index\'></span>\n\t\t\t<img v-if=\'status=="up"\' src=\'http://res.enjoyst.com/image/up_01.png\'\n\t\t\t\t\t @click=\'sort_str=toggle(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t<img v-if=\'status=="down"\' src=\'http://res.enjoyst.com/image/down_01.png\'\n\t\t\t\t\t @click=\'sort_str=toggle(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t<img v-if=\'status!="no_sort"\' src=\'http://res.enjoyst.com/image/cross.png\'\n\t\t\t\t\t@click=\'sort_str=remove_sort(sort_str,name);$emit("input",sort_str)\'/>\n\t\t\t</div>\n\t',
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
});

window.table_fun = table_fun;
window.build_table_args = build_table_args;

/***/ })
/******/ ]);