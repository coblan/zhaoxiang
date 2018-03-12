# encoding:utf-8
from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import page_dc,regist_director,TablePage,FormPage,ModelTable,ModelFields,model_dc
from geoscope.admin import BlockGroupTablePage,BlockGroupFormPage
from geoscope.models import BlockGroup,BlockPolygon
from .models import InspectorGroupAndWeilanRel,OutBlockWarning
from inspector.models import InspectorGrop
from geoscope.polygon import poly2dict
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
    class tableCls(ModelTable):
        model=InspectorGroupAndWeilanRel
        exclude=['id']
        #def get_heads(self):
            #heads = ModelTable.get_heads(self)
            #heads.append({'name':'block_img','label':'围栏截图'})
            #return heads
        
        def dict_row(self, inst): 
            return {
                'block': inst.block.name if inst.block else "",
                'groups':';'.join([x.name for x in  inst.groups.all()]),
                'polygon': poly2dict( inst.block.bounding )
                #'block_img':"<a href='%s' target='_blank'><img src='%s' style='height:200px;'></a>"%(inst.block.shot,inst.block.shot) if inst.block else ""
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

class OutBlockWaringPage(TablePage):
    class tableCls(ModelTable):
        model=OutBlockWarning
        exclude=['id']
        def dict_row(self, inst):
            return {
                'inspector': unicode(inst.inspector) if inst.inspector else "",
                'code':inst.inspector.code if inst.inspector else "",
                'manager':unicode(inst.manager) if inst.manager else "",
                'proc_status': inst.proc_status == 'processed',
                'proc_detail':'<span class="ellipsis" style="max-width:100px">%s</span>'%inst.proc_detail
            }
        #def dict_head(self, head):
            #if head['name']=='proc_status':
                #head['type']='bool'
            #return head
        def get_heads(self):
            heads = ModelTable.get_heads(self)
            for index,head in enumerate(heads):
                if head['name']=='inspector':
                    heads.insert(index+1, {
                        'name':'code',
                        'label':'编码'
                    })
                    break
            return heads

class OutBlockWarningFormPage(FormPage):
    class fieldCls(ModelFields):
        readonly=['manager','proc_time','inspector','create_time']
        class Meta:
            model=OutBlockWarning
            exclude=[]
        def save_form(self):
            ModelFields.save_form(self)
            self.instance.manager=self.crt_user
            self.instance.save()
        
model_dc[InspectorGroupAndWeilanRel]={'fields':GroupWeilanRelFormPage.fieldsCls}
model_dc[OutBlockWarning]={'fields':OutBlockWarningFormPage.fieldCls}
page_dc.update({
    'dianzi_weilan.blockgroup':Weilan,
    'dianzi_weilan.blockgroup.edit':WeilanForm,
    'dianzi_weilan.groupweilanrel':GroupWeilanRel,
    'dianzi_weilan.groupweilanrel.edit':GroupWeilanRelFormPage,
    
    'dianzi_weilan.warning':OutBlockWaringPage,
    'dianzi_weilan.warning.edit':OutBlockWarningFormPage
})
# page_dc.update(group_weilan_rel)