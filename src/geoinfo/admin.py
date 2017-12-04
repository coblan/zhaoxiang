# encoding:utf-8

from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import ModelTable,TablePage,page_dc,FormPage,ModelFields,model_dc,RowSort,RowFilter,RowSearch,permit_list,has_permit
# Register your models here.
from .models import BlockPolygon

class BlockPolygonTablePage(TablePage):
    class BlockPolygonTable(ModelTable):
        model=BlockPolygon
        exclude=[]
    
    tableCls = BlockPolygonTable

class BlockPolygonFormPage(FormPage):
    class BlockPolygonForm(ModelFields):
        class Meta:
            model=BlockPolygon
            exclude=[]
    
    fieldsCls = BlockPolygonForm

model_dc[BlockPolygon]={'fields':BlockPolygonFormPage.BlockPolygonForm}

page_dc.update({
    'geoinfo.blockpolygon':BlockPolygonTablePage,
    'geoinfo.blockpolygon.edit':BlockPolygonFormPage,
})