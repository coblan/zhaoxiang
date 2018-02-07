# encoding:utf-8

from __future__ import unicode_literals

from helpers.director.engine import BaseEngine,page,fa,page_dc
from helpers.maintenance.update_static_timestamp import js_stamp

class PcMenu(BaseEngine):
    url_name='zhaoxiang'
    brand='Z.X.Z'
    menu=[
        {'label':'监督员','url':page('inspector.inspector'),'icon':fa('fa-user-secret'),
         'submenu':[
             {'label':'实时点位','url':page('inspector.inspector_map')},
             {'label':'监督员名单','url':page('inspector.inspector')},
             {'label':'监督员分组','url':page('inspector.inspectorgroup')}
             ]},
        {'label':'GIS区域','url':page('geoinfo.blockpolygon'),'icon':fa('fa-map-o')},
        {'label':'重点区域','icon':fa('fa-user-secret'),
             'submenu':[
                 {'label':'重点巡查区域','url':page('key_region.forcast')},
                 ]},        
        
    ]
    
    def custome_ctx(self, ctx):
        ctx['js_stamp']=js_stamp
        ctx['table_fun_config'] ={
            'detail_link': '详情', #'<i class="fa fa-info-circle" aria-hidden="true" title="查看详情"></i>'#,
        }
        return ctx      

PcMenu.add_pages(page_dc)