from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,FormPage,ModelFields,model_dc,RowSort,RowFilter,RowSearch,permit_list,has_permit
from .models import Inspector,InspectorGrop
# Register your models here.
class InspectorPage(TablePage):
    template='inspector/inspector.html'
    class InspectorTable(ModelTable):
        model=Inspector
        exclude=[]
        
        # def dict_row(self, inst):
            # return {
                # 'scope': ','.join([unicode(x) for x in inst.scope.all()])
            # }
        
    tableCls=InspectorTable
    

class InspectorFormPage(FormPage):
    class InspectorForm(ModelFields):
        class Meta:
            model=Inspector
            exclude=[]
            
        def get_heads(self):
            heads = super(self.__class__,self).get_heads()
            for head in heads:
                if head.get('name') == 'head':
                    head['type']='picture'
                    head['config']={
                    'crop':True,
                    'aspectRatio': 1,
                    'size':{'width':250,'height':250}
                }
            return heads        
        
    fieldsCls=InspectorForm

class InspectorGroupPage(TablePage):
    class InspectorGroupTable(ModelTable):
        model=InspectorGrop
        exclude=[]
        def dict_row(self, inst):
            return {
                'inspector':','.join([unicode(x) for x in inst.inspector.all()])
            }
    
    tableCls = InspectorGroupTable

class InspectorGroupFormPage(FormPage):
    class InspectorGroupForm(ModelFields):
        class Meta:
            model=InspectorGrop
            exclude=[]
            
    fieldsCls=InspectorGroupForm


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
            return query.exclude(last_loc='NaN')
        
        
    tableCls=InspectorTable




model_dc[Inspector]={'fields':InspectorFormPage.InspectorForm}
model_dc[InspectorGrop]={'fields':InspectorGroupFormPage.InspectorGroupForm}

page_dc.update({
    'inspector.inspector':InspectorPage,
    'inspector.inspector.edit':InspectorFormPage,
    'inspector.inspectorgroup':InspectorGroupPage,
    'inspector.inspectorgroup.edit':InspectorGroupFormPage,
    
    'inspector.inspector_map':InspectorMapPage,
})