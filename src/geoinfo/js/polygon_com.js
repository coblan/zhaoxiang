export var ploygon_editor={
    props:['name','row','kw'],
    template: `<div>
            <button @click="create_new()">new</button>
            <button @click="edit()">edit</button>
        </div>`,
    methods:{
        create_new:function(){
            //map.clearMap()

            drawer.show()
            drawer.create_polygon(function(polygon){
               var poly_obj =  drawer.insert_polygon(polygon)
                drawer.edit_polygon(poly_obj)
            });
            this.listn_submit()
        },
        edit:function(){
            drawer.show()
            if(this.row[this.name]){
                var polygon= JSON.parse(this.row[this.name])
                var poly_obj =  drawer.insert_polygon(polygon)
                drawer.edit_polygon(poly_obj)
            }
            this.listn_submit()
        },
        listn_submit:function(){
            var self=this
            drawer.onsubmit=function(polygon){
                var point_arr =  ex.map(polygon,function(point){
                    return [point.lng,point.lat]
                })
                self.row[self.name]=JSON.stringify(point_arr)
            }
        }
    }
}
