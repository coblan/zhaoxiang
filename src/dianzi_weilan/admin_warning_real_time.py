from helpers.director.shortcut import TablePage,ModelTable,page_dc,director,RowFilter,RowSearch,RowSort,ModelFields
from .models import RealtimeWarning,PROC_STATUS

class RealTimeWaringPage(TablePage):
    template='jb_admin/table.html'
    
    def get_label(self):
        return '围栏报警信息'
    
    class tableCls(ModelTable):
        model=RealtimeWarning
        exclude=['id']
        fields_sort=['inspector','code','proc_status','proc_detail','reason','manager','start_time', 'end_time']
        #pop_edit_field='inspector'
        def dict_row(self, inst):
            return {
                '_inspector_label': str(inst.inspector) if inst.inspector else "",
                'code':inst.inspector.code if inst.inspector else "",
                '_manager_label':str(inst.manager) if inst.manager else "",
                '_proc_status_label': inst.proc_status == 'processed',
                #'proc_detail':'<span class="ellipsis" style="max-width:100px">%s</span>'%inst.proc_detail
            }
        #def dict_head(self, head):
            #if head['name']=='proc_status':
                #head['type']='bool'
            #return head
        def dict_head(self, head):
            dc={
                'inspector':60,
                'proc_status':80,
                'proc_detail':160,
                'manager':100,
                'reason':160,
                'start_time':150, 
                'end_time': 150,
            }
            if dc.get(head['name']):
                head['width'] =dc.get(head['name'])              
            
            
            if head['name'] in[ 'inspector','manager','proc_status']:
                head['editor'] = 'com-table-label-shower'
            if head['name'] in ['proc_detail']:
                head['editor'] = 'com-table-linetext'
                head['readonly']={
                    'fun':'checkRowValue',
                    'field':'proc_status',
                    'target_value':'processed'
                    }
            if head['name']=='proc_status':
                head['editor'] = 'com-table-select'
                head['options'] = []
                for value,label in PROC_STATUS:
                    dc = {
                        'value':value,
                        'label':label
                    }
                    if value=='processed':
                        dc['html_label'] = '<span style="color:green">已处理</span>'
                    elif value =='unprocess':
                        dc['html_label'] = '<span style="color:red">未处理</span>'
                    head['options'].append(dc)
            return head
        
        def get_heads(self):
            heads = ModelTable.get_heads(self)
            for index,head in enumerate(heads):
                if head['name']=='inspector':
                    heads.insert(index+1, {
                        'name':'code',
                        'label':'编码',
                        'width':90
                    })
                    break
            return heads
        
        def get_operation(self):
            operations = ModelTable.get_operation(self)
            ops = filter(lambda op:op['name'] in ['save_changed_rows'] ,operations)
            ls=[{
                 'fun':'selected_set_value',
                 'editor':'com-op-btn',
                 'field':'proc_status',
                 'value':'processed',
                 'disabled':'!has_select',
                 #'hide':'!has_select',
                 'icon':'fa-circle',
                 'style':'color:green',
                 'label':'已处理'},
                {
                 'fun':'selected_set_value',
                 'editor':'com-op-btn',
                 'field':'proc_status',
                 'value':'unprocess',
                 'disabled':'!has_select',
                 #'hide':'!has_select',
                 'icon':'fa-exclamation',
                 'style':'color:red',
                 'label':'未处理'}, 
                
                ]
            ls.extend(ops)
            return ls
        
        class search(RowSearch):
            names=['inspector']
            def get_context(self):
                dc = super().get_context()
                dc.update({
                    'search_tip':'监督员姓名，编号'
                })
                return dc
            
            def get_query(self,query):
                self.valid_name=['inspector__name','inspector__code']
                return super().get_query(query)
            
                #if self.q:
                    #return query.filter(inspector__name__icontains=self.q,inspector__code__icontains=self.q)
                #else:
                    #return query
        class filters(RowFilter):
            names=['proc_status']
            range_fields = ['start_time']
            #range_fields=[{'name':'create_time','type':'date'}]
        
        class sort(RowSort):
            names=['start_time']


class RealTimeWarningForm(ModelFields):
    readonly=['manager','proc_time','inspector','create_time']
    class Meta:
        model=RealtimeWarning
        exclude=[]
    
    def get_row(self):
        row= ModelFields.get_row(self)
        row['create_time']= self.instance.create_time.strftime('%Y-%m-%d %H:%M:%S')
        row['proc_time']= self.instance.proc_time.strftime('%Y-%m-%d %H:%M:%S')
        return row
        
    def get_heads(self):
        heads = ModelFields.get_heads(self)
        heads.append({
            'name':'create_time',
            'label':'创建时间',
            'type':'linetext',
            'readonly':True
        })
        return heads
    
    def save_form(self):
        ModelFields.save_form(self)
        self.instance.manager=self.crt_user
        self.instance.save()
            

director.update({
      'dianzi_weilan.realtime_warning':RealTimeWaringPage.tableCls,
       'dianzi_weilan.realtime_warning.edit':RealTimeWarningForm,
})

page_dc.update({
     'dianzi_weilan.realtime_warning':RealTimeWaringPage,
})