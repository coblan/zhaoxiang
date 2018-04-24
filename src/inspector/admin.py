# encoding:utf-8
from __future__ import unicode_literals

from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,FieldsPage,ModelFields,model_dc,RowSort,RowFilter,RowSearch,permit_list,has_permit
from .models import Inspector,InspectorGrop
# Register your models here.

class InspectorPage(TablePage):
    template='jb_admin/table.html'
    #template='inspector/inspector.html'
    def get_label(self, prefer=None):
        return '监督员名单'
    
    class InspectorTable(ModelTable):
        model=Inspector
        exclude=[]
        pop_edit_field='name'
        
        class search(RowSearch):
            names=['name','code']
            
        class filters(RowFilter):
            names=['gen']
        
        class sort(RowSort):
            names=['name']
            chinese_words=['name']
        
        #def dict_head(self, head):
            #if head['name'] =='name':
                #head['editor'] = 'com-table-pop-fields'
                #head['fields_heads']=InspectorForm(crt_user=self.crt_user).get_heads()
                #head['get_row'] = {
                    ##'fun':'use_table_row'
                    #"fun":'get_table_row'
                    ##'fun':'get_with_relat_field',
                    ##'kws':{
                        ##"model_name":model_to_name(TbBanner),
                        ##'relat_field':'pk'
                    ##}
                #}
                #head['after_save']={
                    ##'fun':'do_nothing'
                    #'fun':'update_or_insert'
                #}
                #head['ops']=InspectorForm(crt_user=self.crt_user).get_operations()
            #return head
                
                #head['model_name']=model_to_name(TbBanner)
                
                #head['relat_field']='pk'
                #head['use_table_row']=True
                
        # def dict_row(self, inst):
            # return {
                # 'scope': ','.join([unicode(x) for x in inst.scope.all()])
            # }
        
    tableCls=InspectorTable
    


class InspectorForm(ModelFields):
    class Meta:
        model=Inspector
        exclude=[]
        
    def get_heads(self):
        heads = super(self.__class__,self).get_heads()
        for head in heads:
            if head.get('name') == 'head':
                head['editor'] = 'picture'
                #head['type']='picture'
                #head['config']={
                #'crop':True,
                #'aspectRatio': 1,
                #'size':{'width':250,'height':250}
            #}
        return heads        
        

class InspectorGroupPage(TablePage):
    template='jb_admin/table.html'
    class tableCls(ModelTable):
        model=InspectorGrop
        exclude=[]
        pop_edit_field='name'
        
        #def dict_row(self, inst):
            #return {
                #'inspector':','.join([unicode(x) for x in inst.inspector.all()])
            #}
        
        #def dict_head(self, head):
            #if head['name'] =='name':
                #head['editor'] = 'com-table-pop-fields'
                #head['fields_heads']=InspectorGroupForm(crt_user=self.crt_user).get_heads()
                #head['get_row'] = {
                    ##'fun':'use_table_row'
                    #"fun":'get_table_row'
                    ##'fun':'get_with_relat_field',
                    ##'kws':{
                        ##"model_name":model_to_name(TbBanner),
                        ##'relat_field':'pk'
                    ##}
                #}
                #head['after_save']={
                    ##'fun':'do_nothing'
                    #'fun':'update_or_insert'
                #}
                #head['ops']=InspectorGroupForm(crt_user=self.crt_user).get_operations()
            #return head        
    


class InspectorGroupForm(ModelFields):
    class Meta:
        model=InspectorGrop
        exclude=[]
        
    #def dict_head(self, head):
        #if head['name']=='inspector':
            #head['editor']=''
            


class InspectorMapPage(TablePage):
    template='inspector/inspector_map.html'
    class InspectorTable(ModelTable):
        model=Inspector
        exclude=[]
        
        # def dict_row(self, inst):
            # return {
                # 'scope': ','.join([unicode(x) for x in inst.scope.all()])
            # }
        
        def inn_filter(self, query):
            query = super(self.__class__,self).inn_filter(query)
            return query.exclude(last_loc='NaN').exclude(last_loc='')
        
        
    tableCls=InspectorTable




model_dc[Inspector]={'fields':InspectorForm}
model_dc[InspectorGrop]={'fields':InspectorGroupForm}

page_dc.update({
    'inspector.inspector':InspectorPage,
    #'inspector.inspector.edit':InspectorFormPage,
    'inspector.inspectorgroup':InspectorGroupPage,
    #'inspector.inspectorgroup.edit':InspectorGroupFormPage,
    
    'inspector.inspector_map':InspectorMapPage,
})