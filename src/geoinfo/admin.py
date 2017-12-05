# encoding:utf-8

from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.db_tools import to_dict
from helpers.director.shortcut import ModelTable,TablePage,page_dc,FormPage,ModelFields,model_dc,RowSort,RowFilter,RowSearch,permit_list,has_permit
# Register your models here.
from .models import BlockPolygon

class BlockPolygonTablePage(TablePage):
    class BlockPolygonTable(ModelTable):
        model=BlockPolygon
        exclude=[]
        
        def dict_row(self, inst):
            dc={
                'display':unicode(inst.display)
            }
            return dc
        
    
    tableCls = BlockPolygonTable

class BlockPolygonFormPage(FormPage):
    class BlockPolygonForm(ModelFields):
        class Meta:
            model=BlockPolygon
            exclude=[]
        
        def get_row(self):
            dc={
                'display':unicode(self.instance.display)
            }
            return to_dict(self.instance,filt_attr=dc)
        
        def dict_head(self, head):
            if head['name']=='display':
                head['type']='polygon-input'
        
    fieldsCls = BlockPolygonForm
    template='geoinfo/blockpolygon_form.html'

model_dc[BlockPolygon]={'fields':BlockPolygonFormPage.BlockPolygonForm}

page_dc.update({
    'geoinfo.blockpolygon':BlockPolygonTablePage,
    'geoinfo.blockpolygon.edit':BlockPolygonFormPage,
})