# encoding:utf-8
from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import page_dc,TablePage,FieldsPage,ModelTable,ModelFields,model_dc,RowSearch,RowFilter
from geoscope.admin import BlockGroupTablePage,BlockGroupFormPage
from geoscope.models import BlockGroup,BlockPolygon
from .models import InspectorGroupAndWeilanRel,OutBlockWarning,WorkInspector
from inspector.models import InspectorGrop
from geoscope.polygon import poly2dict
from django.utils import timezone
from .models import PROC_STATUS
from inspector.models import Inspector

# Register your models here.
class Weilan(BlockGroupTablePage):
    
    def __init__(self,*args,**kw):
        super(Weilan,self).__init__(*args,**kw)
        self.table.set_belong('weilan')

class WeilanForm(BlockGroupFormPage):
    def __init__(self,*args,**kw):
        super(WeilanForm,self).__init__(*args,**kw)
        self.set_belong('weilan') 

# group_weilan_rel  = regist_director(name='dianzi_weilan.groupweilanrel',src_model=InspectorGroupAndWeilanRel)
class GroupWeilanRel(TablePage):
    template='dianzi_weilan/weilan.html'
    #template='jb_admin/table.html'
    def get_label(self):
        return '围栏信息'
    
    class tableCls(ModelTable):
        model=InspectorGroupAndWeilanRel
        exclude=['id']
        pop_edit_field='block'
        def get_heads(self):
            heads = ModelTable.get_heads(self)
            heads.append({'name':'hight_region',
                          'label':'围栏区域',
                          'editor':'com-table-extraclick',
                          'extra_label':'提示',
                          'extra_fun':'hight_region',
                          'width':30,
                          })
            return heads
        
        def dict_head(self, head):
            
            dc={
                'block':60,
                'groups':100,
            }
            if dc.get(head['name']):
                head['width'] =dc.get(head['name'])
                
            
            if head['name']=='groups':
                head['editor']='com-table-array-mapper'
                head['options']={g.pk:g.name for g in InspectorGrop.objects.all()}
            if head['name']=='block':
                head['show_label']={
                    'fun':'use_other_field',
                    'other_field':'_block_label'
                }
                #head['editor']='com-table-label-shower'
            return head
        
        def dict_row(self, inst): 
            return {
                #'block': inst.block.name if inst.block else "",
                #'groups':';'.join([x.name for x in  inst.groups.all()]),
                'polygon': poly2dict( inst.block.bounding ) if inst.block else [],
                #'hight_region':'xx'
                #'block_img':"<a href='%s' target='_blank'><img src='%s' style='height:200px;'></a>"%(inst.block.shot,inst.block.shot) if inst.block else ""
            }

class GroupWeilanRelFormPage(FieldsPage):
    class fieldsCls(ModelFields):
        class Meta:
            model=InspectorGroupAndWeilanRel
            exclude=[]
        def dict_options(self):
            blocks = BlockPolygon.objects.filter(blockgroup__belong='weilan').distinct()
            groups = InspectorGrop.objects.all()
            return {
                'block':[{'value':x.pk,'label':x.name} for x in blocks],
                'groups':[{'value':x.pk,'label':x.name} for x in groups],
            }
        
            # blocks = BlockPolygon.objects.filter(blockgroup__belong='weilan').distinct()
            # return {
                # 'blocks':[{'value':x.pk,'label':x.name} for x in blocks]
            # }
        
        def dict_row(self, inst):
            return {
                'polygon': poly2dict( inst.block.bounding ) if inst.block else []
            }

class OutBlockWaringPage(TablePage):
    template='jb_admin/table.html'
    
    def get_label(self):
        return '围栏报警信息'
    
    class tableCls(ModelTable):
        model=OutBlockWarning
        exclude=['id']
        fields_sort=['inspector','code','proc_status','proc_detail','reason','manager']
        #pop_edit_field='inspector'
        def dict_row(self, inst):
            return {
                '_inspector_label': unicode(inst.inspector) if inst.inspector else "",
                'code':inst.inspector.code if inst.inspector else "",
                '_manager_label':unicode(inst.manager) if inst.manager else "",
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
                'proc_status':60,
                'proc_detail':160,
                'manager':60,
                'reason':160,
            }
            if dc.get(head['name']):
                head['width'] =dc.get(head['name'])              
            
            
            if head['name'] in[ 'inspector','manager','proc_status']:
                head['editor'] = 'com-table-label-shower'
            if head['name'] in ['proc_detail']:
                head['editor'] = 'com-table-linetext'
            if head['name']=='proc_status':
                head['editor'] = 'com-table-select'
                head['options']= [{'value':x[0],'label':x[1]} for x in PROC_STATUS]
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
            return ops
        
        class search(RowSearch):
            names=['inspector']
            def get_query(self,query):
                if self.q:
                    return query.filter(inspector__name__icontains=self.q)
                else:
                    return query
        class filters(RowFilter):
            names=['proc_status']
            range_fields=[{'name':'create_time','type':'date'}]

class OutBlockWarningFormPage(FieldsPage):
    class fieldCls(ModelFields):
        readonly=['manager','proc_time','inspector','create_time']
        class Meta:
            model=OutBlockWarning
            exclude=[]
        
        def get_row(self):
            row= ModelFields.get_row(self)
            row['create_time']=timezone.localtime( self.instance.create_time).strftime('%Y-%m-%d %H:%M:%S')
            row['proc_time']=timezone.localtime( self.instance.proc_time).strftime('%Y-%m-%d %H:%M:%S')
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

class WorkinspectorPage(TablePage):
    template='jb_admin/table.html'
    
    def get_label(self):
        return '上班排单'
    
    class tableCls(ModelTable):
        model = WorkInspector
        exclude=['id']
        pop_edit_field='date'
        
        def dict_head(self, head):
            
            dc={
                'date':60,
                'inspector':400,
            }
            if dc.get(head['name']):
                head['width'] =dc.get(head['name'])  
                
            if head['name']=='inspector':
                head['editor']='com-table-array-mapper'
                head['options']={ins.pk:ins.name for ins in Inspector.objects.all()}
            return head
        
        #def dict_row(self, inst):
            #return {
                #'inspector':';'.join([unicode(x) for x in inst.inspector.all()])
            #}

class WorkinspectorFormPage(FieldsPage):
    template='dianzi_weilan/workinspector_form.html'
    class fieldsCls(ModelFields):
        class Meta:
            model = WorkInspector
            exclude= []
    
    def get_context(self):
        ctx= FieldsPage.get_context(self)
        ls= []
        for group in InspectorGrop.objects.all():
            ls.append({
                'label':group.name,
                'inspectors':[x.pk for x in group.inspector.all()]
            })
        ctx['groups'] = ls
        return ctx
        

model_dc[InspectorGroupAndWeilanRel]={'fields':GroupWeilanRelFormPage.fieldsCls}
model_dc[OutBlockWarning]={'fields':OutBlockWarningFormPage.fieldCls}
model_dc[WorkInspector]={'fields':WorkinspectorFormPage.fieldsCls}

page_dc.update({
    'dianzi_weilan.blockgroup':Weilan,
    'dianzi_weilan.blockgroup.edit':WeilanForm,
    'dianzi_weilan.groupweilanrel':GroupWeilanRel,
    'dianzi_weilan.groupweilanrel.edit':GroupWeilanRelFormPage,
    
    'dianzi_weilan.warning':OutBlockWaringPage,
    'dianzi_weilan.warning.edit':OutBlockWarningFormPage,
    
    'dianzi_weilan.workinspector':WorkinspectorPage,
    'dianzi_weilan.workinspector.edit':WorkinspectorFormPage,
})
# page_dc.update(group_weilan_rel)