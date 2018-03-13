/*分发页面的地图组件
*
* */

export var map_com = {
    template:`<div id="container"></div>`,
    mounted:function(){
        var self=this

        ex.load_css("http://cache.amap.com/lbs/static/main1119.css")
        ex.load_js("http://webapi.amap.com/maps?v=1.3&key=0909294a753dfe00a0aa124b6ecb93eb&plugin=AMap.PolyEditor,AMap.CircleEditor,AMap.MouseTool",function(){
            ex.load_js("http://cache.amap.com/lbs/static/addToolbar.js",function(){
                setTimeout(function(){
                    self.init()
                },10)

            })


        })

    },
    data:function(){
      return {
          ploygons:[]
      }
    },
    methods:{
        on_init:function(callback){
          this.on_init_call=callback
        },
        on_polygon_click:function(callback){
          this.on_polygon_click_callback=callback
        },
        init:function(){
            this.editorTool,this.map = new AMap.Map(this.$el, {
                resizeEnable: true,
                center: [116.403322, 39.900255],//地图中心点
                zoom: 13 //地图显示的缩放级别
            });
            if(this.on_init_call){
                this.on_init_call()
            }
            //this.map.setMapStyle('amap://styles/light');
        },
        insert_polygon:function(arr){
            var self=this
            var _polygon= new AMap.Polygon({
                map: this.map,
                path: arr,
                strokeOpacity: 1,
                fillOpacity: 0.2,
                strokeWeight:1,
                strokeColor: "#555",
                fillColor: "#777",
            })
            this.ploygons.push(_polygon)
            _polygon.on('click',function(){
                if(self.on_polygon_click_callback){
                    self.on_polygon_click_callback(_polygon)
                }
            })
            return _polygon
        },
        detach_polygon:function(poly){
            poly.setMap(null)
        },
        add_polygon:function(poly){
            poly.setMap(this.map)
        },
        highlight_polygon:function(poly,color){
            color = color || 'white'
            poly.setOptions({
                fillColor:color,
                strokeWeight:3,
                strokeColor: "red",
            })
        },
        remove_highlight_polygon:function(poly,color){
            color = color || '#777'
            poly.setOptions({
                strokeWeight:1,
                strokeColor: "#000000",
                fillColor: color,
            })
        }

    }
}

