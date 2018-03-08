# encoding:utf-8
from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import page_dc,regist_director,TablePage,FormPage,ModelTable,ModelFields,model_dc
from geoscope.admin import BlockGroupTablePage,BlockGroupFormPage
from geoscope.models import BlockGroup,BlockPolygon
from .models import InspectorGroupAndWeilanRel
from inspector.models import InspectorGrop
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
    class tableCls(ModelTable):
        model=InspectorGroupAndWeilanRel
        exclude=[]
        def get_heads(self):
            heads = ModelTable.get_heads(self)
            heads.append({'name':'block_img','label':'围栏截图'})
            return heads
        
        def dict_row(self, inst):
            
            return {
                'block': inst.block.name if inst.block else "",
                'groups':';'.join([x.name for x in  inst.groups.all()]),
                'block_img':"<a href='%s' target='_blank'><img src='%s' style='height:200px;'></a>"%(inst.block.shot,inst.block.shot) if inst.block else ""
            }

class GroupWeilanRelFormPage(FormPage):
    class fieldsCls(ModelFields):
        class Meta:
            model=InspectorGroupAndWeilanRel
            exclude=[]
        def dict_options(self):
            blocks = BlockPolygon.objects.filter(blockgroup__belong='weilan').distinct()
            groups = InspectorGrop.objects.all()
            return {
                'block':[{'value':x.pk,'label':x.name} for x in blocks],
                'groups':[{'value':x.pk,'label':x.name} for x in groups]
            }
        
            # blocks = BlockPolygon.objects.filter(blockgroup__belong='weilan').distinct()
            # return {
                # 'blocks':[{'value':x.pk,'label':x.name} for x in blocks]
            # }
        
model_dc[InspectorGroupAndWeilanRel]={'fields':GroupWeilanRelFormPage.fieldsCls}
page_dc.update({
    'dianzi_weilan.blockgroup':Weilan,
    'dianzi_weilan.blockgroup.edit':WeilanForm,
    'dianzi_weilan.groupweilanrel':GroupWeilanRel,
    'dianzi_weilan.groupweilanrel.edit':GroupWeilanRelFormPage,
})
# page_dc.update(group_weilan_rel)