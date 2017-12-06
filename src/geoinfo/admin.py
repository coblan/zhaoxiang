# encoding:utf-8

from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.db_tools import to_dict
from helpers.director.shortcut import ModelTable,TablePage,page_dc,FormPage,ModelFields,model_dc,RowSort,RowFilter,RowSearch,permit_list,has_permit
# Register your models here.
from .models import BlockPolygon
from django.contrib.gis.geos import Polygon
import json

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
        
        def __init__(self, dc={}, pk=None, crt_user=None, nolimit=False):
            dc = self._adapt_polygon(dc)
            super(self.__class__,self).__init__(dc,pk,crt_user,nolimit)
        
        def _adapt_polygon(self,dc):
            
            display= dc.get('display',None)
            if display:
                display= json.loads(display)
                if display[-1] !=display[0]:
                    display.append(display[0])
                dc['display']= Polygon(display)            
            return dc
        
        def get_row(self):
            display = list(self.instance.display.coords[0])
            display.pop()
            dc={
                'display':json.dumps(display )
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