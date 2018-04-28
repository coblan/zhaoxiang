var field_select_work_inspector =  {
    props:['row','head'],
    template:`   <div>
        <ul v-if='head.readonly'><li v-for='value in row[head.name]' v-text='get_label(value)'></li></ul>
        <div v-else>
            <span>从监督员分组：</span>
            <select v-model="crt_group">
                <option  :value="null">---</option>
                <option  v-for="group in head.groups" :value="group" v-text="group.label"></option>
            </select>
            <button @click="add_group()">添加</button>
            <multi-chosen  v-model='row[head.name]' :id="'id_'+head.name"
                :choices='head.options'
                ref="select">
            </multi-chosen>
        </div>
    </div>`,
    computed:{
        label:function(){
            return this.row['_'+this.head.name+'_label']
        }
    },
    methods:{
        add_group:function(){
            if(this.crt_group){
                var self =this
                ex.each(self.crt_group.inspectors,function(inspector_pk){

                })
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
}

Vue.component('com-field-select-work-inspector',field_select_work_inspector)