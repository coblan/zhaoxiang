# encoding:utf-8
from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import page_dc,regist_director,TablePage,FormPage,ModelTable,ModelFields,model_dc
from geoscope.admin import BlockGroupTablePage,BlockGroupFormPage
from geoscope.models import BlockGroup,BlockPolygon
from .models import InspectorGroupAndWeilanRel
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
        def dict_row(self, inst):
            return {
                'blocks':';'.join([x.name for x in  inst.blocks.all()]),
                'group':inst.group.name,
            }

class GroupWeilanRelFormPage(FormPage):
    class fieldsCls(ModelFields):
        class Meta:
            model=InspectorGroupAndWeilanRel
            exclude=[]
        def dict_options(self):
            blocks = BlockPolygon.objects.filter(blockgroup__belong='weilan').distinct()
            return {
                'blocks':[{'value':x.pk,'label':x.name} for x in blocks]
            }
        
model_dc[InspectorGroupAndWeilanRel]={'fields':GroupWeilanRelFormPage.fieldsCls}
page_dc.update({
    'dianzi_weilan.blockgroup':Weilan,
    'dianzi_weilan.blockgroup.edit':WeilanForm,
    'dianzi_weilan.groupweilanrel':GroupWeilanRel,
    'dianzi_weilan.groupweilanrel.edit':GroupWeilanRelFormPage,
})
# page_dc.update(group_weilan_rel)