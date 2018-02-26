# encoding:utf-8
from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import page_dc
from geoscope.admin import BlockGroupTablePage,BlockGroupFormPage
# Register your models here.
class Weilan(BlockGroupTablePage):
    def __init__(self,*args,**kw):
        super(Weilan,self).__init__(*args,**kw)
        self.table.set_belong('weilan')

class WeilanForm(BlockGroupFormPage):
    def __init__(self,*args,**kw):
        super(WeilanForm,self).__init__(*args,**kw)
        self.set_belong('weilan') 
           

page_dc.update({
    'dianzi_weilan.blockgroup':Weilan,
    'dianzi_weilan.blockgroup.edit':WeilanForm,
})