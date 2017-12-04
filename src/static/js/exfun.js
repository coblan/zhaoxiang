
function para_encode(para_str){
	return encodeURI(para_str).replace('+','%2B')
}

ex={
	parseSearch:function (queryString) {
		var queryString = queryString || location.search
		if(queryString.startsWith('?')){
			var queryString=queryString.substring(1)
		}
		var params = {}
	    // Split into key/value pairs
	    var queries = queryString.split("&");
	    // Convert the array of strings into an object
	    for (var i = 0; i < queries.length; i++ ) {
		    var mt = /([^=]+?)=(.+)/.exec(queries[i])
		    if(mt){
			    params[mt[1]] = decodeURI(mt[2]);
		    }
	    }
	    return params;
	},
	searchfy:function (obj,pre) {
		var outstr=pre||''
		for(x in obj){
			var value=obj[x]
			if(value===true){value='1'}
			if(value===false){value='0'}
			if(value!==''&& value!=null){
				outstr+=x.toString()+'='+ value.toString()+'&';
			}
		}
		if(outstr.endsWith('&')){
			return para_encode(outstr.slice(0,-1))
		}else if(outstr==pre){
			return ''
		}else{
			return para_encode(outstr)
		}
	},
	appendSearch:function(url,obj){
		if(!obj){
			var obj=url
			var url=location.href
		}
		if(url){
			var url_obj = ex.parseURL(url)
			var search = url_obj.params
		}else{
			url=location.href
			var search=ex.parseSearch()
		}
		ex.assign(search,obj)
		return url.replace(/(\?.*)|()$/,ex.searchfy(search,'?'))
	},
	parseURL: function(url) {
		var a = document.createElement('a');
		a.href = url;
		return {
			source: url,
			protocol: a.protocol.replace(':',''),
			host: a.hostname,
			port: a.port,
			search: a.search,
			params: (function(){
				var ret = {},
					seg = a.search.replace(/^\?/,'').split('&'),
					len = seg.length, i = 0, s;
				for (;i<len;i++) {
					if (!seg[i]) { continue; }
					s = seg[i].split('=');
					ret[s[0]] = decodeURI(s[1]);
				}
				return ret;
			})(),
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
			hash: a.hash.replace('#',''),
			pathname: a.pathname.replace(/^([^\/])/,'/$1'),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
			segments: a.pathname.replace(/^\//,'').split('/')
		};
	},
/*两种调用方式
 var template1="我是{0}，今年{1}了";
 var template2="我是{name}，今年{age}了";
 var result1=template1.format("loogn",22);
 var result2=template2.format({name:"loogn",age:22});
 两个结果都是"我是loogn，今年22了"
 */
	template:function (string,args) {
		var result = string;
		if(args.length){
			for (var i = 0; i < args.length; i++) {
                if (args[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
　　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, args[i]);
                }
            }
		}else{
			 for (var key in args) {
				 var value= args[key]
				 if(value==undefined){
					 value=''
				 }

				var reg = new RegExp("({" + key + "})", "g");
				result = result.replace(reg, value);

	         }
		}
	    return result;
		},
	/*
	ex.merge([{name:'dog',age:'18'}],[{name:'dog',label:'dog_label'}])
	>> [{name:'dog',age:'18',label:'dog_label'}]
	*/
	merge:function (src1,src2) {
		var self=this
		var dst_list=JSON.parse(JSON.stringify(src1))
		this.each(src2,function (src_item) {
			var obj = self.findone(dst_list,{name:src_item.name})
			if(obj){
				self.assign(obj,src_item)
			}else{
				dst_list.push(src_item)
			}
		})
		return dst_list
	},
	product:function (src1,src2) {
		var out=[]
		for(var i=0;i<src1.length;i++){
			for(var j=0;j<src2.length;j++){
				out.push([src1[i],src2[j]])
			}
		}
		return out
	},
	assign:function (dst,src) {
		for(var key in src){
			dst[key]=src[key]
		}
	},
	copy:function (obj) {
		return JSON.parse(JSON.stringify(obj))
	},
	findone:function (collection,obj_or_func) {

		for(var i=0;i<collection.length;i++){
			var now_obj=collection[i]
			if(typeof(obj_or_func)=='function'){
				var func=obj_or_func
				var match=func(now_obj)
			}else{
				var obj=obj_or_func
				var match=true
				for(var key in obj){
					if (obj[key] !=now_obj[key]){
						match =false
						break
					}
				}
			}

			if(match){
				return now_obj
			}
		}


		return null
	},
	find:function (collection,obj) {
		out=[]
		for(var i=0;i<collection.length;i++){
			var now_obj=collection[i]
			var match=true
			for(var key in obj){
				if (obj[key] !=now_obj[key]){
					match =false
					break
				}
			}
			if(match){
				out.push(now_obj)
			}
		}
		return out
	},
	each:function (array,func) {
		for(var i=0;i<array.length;i++){
			rt = func(array[i])
			if(rt=='break'){break;}
			else if(rt=='continue'){continue;}
		}
	},
	split:function (base_str,sep) {
		if(base_str==''){
			return []
		}else{
			return base_str.split(sep)
		}
	},
	map:function (array,func) {
		var out=[]
		for(var i=0;i<array.length;i++){
			out.push(func(array[i]))
		}
		return out
	},
	isin:function (obj,array,func) {
		if(func){
			for(var i=0;i<array.length;i++){
				if(func(array[i])){
					return true
				}
			}
			return false
		}else{
			return array.indexOf(obj)!=-1
		}
	},
	filter:function (array,func_or_obj) {
		var out=[]
		if(typeof func_or_obj == 'function'){
			for(var x=0;x<array.length;x++){
				if(func_or_obj(array[x])){
					out.push(array[x])
				}
			}
		}else{
			var obj=func_or_obj
			ex.each(array,function(doc){
				var match=true
				for(var key in obj){
					if(doc[key]!=obj[key]){
						match=false
						break
					}
				}
				if(match){
					out.push(doc)
				}
			})

		}
		return out
	},
	exclude:function(array,func_or_obj){
		var out=[]
		if(typeof func_or_obj == 'function'){
			for(var x=0;x<array.length;x++){
				if(!func_or_obj(array[x])){
					out.push(array[x])
				}
			}
		}else{
			var obj=func_or_obj
			ex.each(array,function(doc){
				var match=true
				for(var key in obj){
					if(doc[key]!=obj[key]){
						match=false
						break
					}
				}
				if(!match){
					out.push(doc)
				}
			})

		}
		return out
	},
	any:function(array,func) {
		for(var x=0;x<array.length;x++){
			if(func(array[x])){
				return true
			}
		}
		return false
	},
	extend:function(array1,array2){
		array1.push.apply(array1,array2)
		return array1
	},
	remove:function (array,func_or_obj) {
		var index_ls=[]
		if (typeof func_or_obj == 'function'){
			var func=func_or_obj
			for(var i=0;i<array.length;i++){
				if(func(array[i])){
					index_ls.push(i)
				}
			}
		}else{
			var obj=func_or_obj
			for(var i=0;i<array.length;i++){
				var match=true
				for(var key in obj){
					if(obj[key]!=array[i][key]){
						match=false
					}
				}
				if(match){
					index_ls.push(i)
				}
			}
		}
		var rm_item=[]
		index_ls.reverse()
		for(var x=0;x<index_ls.length;x++){
			var rm=array.splice(index_ls[x],1)
			rm_item= rm.concat(rm_item)
		}
		return rm_item
	},
	sort_by_names:function(array,name_list,keep){
		/*按照name_list来筛选和排列array，如果keep=true，落选的项会append到array后面。
		@array: [{name:'age',..},{contry:'china'}]
		@name_list:['contry','name']
		返回:按照name_list排序后的array
		* */
		var out_list=[]
		ex.each(name_list,function(name){
			var item = ex.findone(array,{name:name})
			if (item){
				out_list.push(item)
			}
		})
		if(keep){
			ex.each(array,function(item){
				if(!ex.isin(item,out_list)){
					out_list.push(item)
				}
			})
		}
		return out_list
	},
	load_js: function(src,success) {
		success = success || function(){};
		var name = src //btoa(src)
		if(!window['__js_hook_'+name]){
			window['__js_hook_'+name]=[]
		}
		window['__js_hook_'+name].push(success)
		var hooks=window['__js_hook_'+name]
		if(window['__js_loaded_'+name]){
			while (hooks.length>0){
				hooks.pop()()
			}
		}
		if(! window['__js_'+name]){
			window['__js_'+name]=true
			var domScript = document.createElement('script');
			  domScript.src = src;
			  domScript.onload = domScript.onreadystatechange = function() {
			    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
				  window['__js_loaded_'+name]=true
			      while (hooks.length>0){
						hooks.pop()()
					}
			      this.onload = this.onreadystatechange = null;
			      this.parentNode.removeChild(this);
			    }
			  }
			  document.getElementsByTagName('head')[0].appendChild(domScript);
		}
	},
	load_css:function (src) {
		var name = btoa(src)
		if(window['__src_'+name]){
			return
		}
		window['__src_'+name]=true
		$('head').append('<link rel="stylesheet" href="'+src+'" type="text/css" />')
	},

	append_css:function(styles_str){
	/*
	* @styles_str : css string or <style>css string</style>
	* */
			window._appended_css=window._appended_css || []
			if(ex.isin(styles_str,window._appended_css)){
				return
			}else{
				window._appended_css.push(styles_str)
			}
			var mt = /<style.*>([\s\S]*)<\/style>/im.exec(styles_str)
			if(mt){
				styles_str=mt[1]
			}
			var style = document.createElement('style');

			//这里最好给ie设置下面的属性
			/*if (isIE()) {
			 style.type = “text/css”;
			 style.media = “screen”
			 }*/
			(document.getElementsByTagName('head')[0] || document.body).appendChild(style);
			if (style.styleSheet) { //for ie
				style.styleSheet.cssText = styles_str;
			} else {//for w3c
				style.appendChild(document.createTextNode(styles_str));
			}


		//function includeStyleElement(styles,styleId) {
        //
		//	if (document.getElementById(styleId)) {
		//		return
		//	}
		//	var style = document.createElement(“style”);
		//	style.id = styleId;
		//	//这里最好给ie设置下面的属性
		//	/*if (isIE()) {
		//	 style.type = “text/css”;
		//	 style.media = “screen”
		//	 }*/
		//	(document.getElementsByTagName(“head”)[0] || document.body).appendChild(style);
		//	if (style.styleSheet) { //for ie
		//		style.styleSheet.cssText = styles;
		//	} else {//for w3c
		//		style.appendChild(document.createTextNode(styles));
		//	}
		//}
		//var styles = “#div{background-color: #FF3300; color:#FFFFFF }”;
		//includeStyleElement(styles,”newstyle”);
	},

	is_fun:function (v) {
		return typeof v === "function"
	},
	get:function(url,callback){
		//replace $.get
		var self=this
		var wrap_callback=function (resp) {
			if (resp.msg) {
				self.show_msg(resp.msg)
			}
			if (resp.status && typeof resp.status == 'string' && resp.status != 'success') {
				hide_upload(300)
				return
			} else {
				callback(resp)
			}
		}
		return $.get(url,wrap_callback)
	},
	post:function(url,data,callback){
		var self=this
		var wrap_callback=function (resp) {
			if (resp.msg) {
				self.show_msg(resp.msg)
			}
			if (resp.status && typeof resp.status == 'string' && resp.status != 'success') {
				hide_upload(300) // sometime
				return
			} else {
				callback(resp)
			}
		}
		return $.post(url,data,wrap_callback)
	},
	show_msg:function(msg){
		alert(msg)
	},
	access : function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	},
	set:function(par,name,obj){
		name = name.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		name = name.replace(/^\./, '');           // strip a leading dot
		var a = name.split('.');
		var o=par
		for (var i = 0; i < a.length-1; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return null;
			}
		}
		o[a[a.length-1]]=obj
		return o;
	},
	tr:function(str){
		var gettext=window.gettext||function(x){return x}
		return gettext(str)
	},
	trList:function(strlist){
		// translate string list to a map object
		var gettext=window.gettext||function(x){return x}
		var map_obj={}
		ex.each(strlist,function(key){
			map_obj[key]=gettext(key)
		})
		return map_obj
	},
	unique: function(array){
		var res = [];
		var json = {};
		for(var i = 0; i < array.length; i++){
			if(!json[array[i]]){
				res.push(array[i]);
				json[array[i]] = 1;
			}
		}
		return res;
	},
	group_add:function(old_array,new_array,callback){
		var out_list=old_array.slice()
		var last_key=null
		var last_list= null
		ex.each(new_array,function(item){
			var key= callback(item)
			if(key!=last_key){
				var obj=ex.findone(out_list,function(old_item){
					if(old_item.key==key){return true}
					else {return false}
				})

				if(!obj){
					last_list=  []
					last_key=key
					out_list.push({key:last_key,list:last_list})
				}else{
					last_list=obj.list
				}
			}
			last_list.push(item)
		})
		return out_list
	}


}

function parseSearch(queryString) {
	var queryString = queryString || location.search
	if(queryString.startsWith('?')){
		var queryString=queryString.substring(1)
	}
	var params = {}
    // Split into key/value pairs
    var queries = queryString.split("&");
    // Convert the array of strings into an object
    for (var i = 0; i < queries.length; i++ ) {
	    var mt = /([^=]+?)=(.+)/.exec(queries[i])
        params[mt[1]] = mt[2];
    }
    return params;
}
function searchfy(obj,pre){
	var outstr=pre||''
	for(x in obj){
		if(obj[x]){
			outstr+=x.toString()+'='+ obj[x].toString()+'&';
		}
		
	}
	if(outstr.endsWith('&')){
		return outstr.slice(0,-1)
	}else{
		return outstr
	}
	
}
function update(dst_obj,src_obj) {
	for(x in src_obj){
		dst_obj[x]=src_obj[x]
	}
}

//  startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
  String.prototype.endsWith = function(str){
	return (this.match(str+"$")==str)
	};
}

Array.prototype.each = function(fn) 
{ 
return this.length ? [fn(this.slice(0,1))].concat(this.slice(1).each(fn)) : []; 
};


 /*两种调用方式
 var template1="我是{0}，今年{1}了";
 var template2="我是{name}，今年{age}了";
 var result1=template1.format("loogn",22);
 var result2=template2.format({name:"loogn",age:22});
 两个结果都是"我是loogn，今年22了"
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
　　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}


var Base64 = {
// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
				Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

		}

		return output;
	},

// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = Base64._keyStr.indexOf(input.charAt(i++));
			enc2 = Base64._keyStr.indexOf(input.charAt(i++));
			enc3 = Base64._keyStr.indexOf(input.charAt(i++));
			enc4 = Base64._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}
		return string;
	}
}

if(!window.atob){
	window.atob=Base64.decode
	window.btoa=Base64.encode
}
