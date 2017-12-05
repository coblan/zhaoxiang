export var ploygon_editor={
    props:[],
    template: `<div>
            <button @click="create_new()">new</button>
            <button>edit</button>
        </div>`,
    methods:{
        create_new:function(){
            map.clearMap()
            drawer.create_polygon(function(polygon){
                console.log('hello')
                console.log(polygon)
                //var arr=ex.map(polygon,function(pos){
                //    return [pos.lat,pos.lng]
                //})

               var poly_obj =  drawer.insert_polygon(polygon)
                drawer.edit_polygon(poly_obj)
            });
        }
    }
}
