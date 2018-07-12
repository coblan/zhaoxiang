# encoding:utf-8

from __future__ import unicode_literals

from helpers.director.shortcut import page_dc
from helpers.director.engine import BaseEngine,page,fa

from helpers.maintenance.update_static_timestamp import js_stamp

class PcMenu(BaseEngine):
    url_name='zhaoxiang'
    brand='Z.X.Z'
    mini_brand='ZXZ'
    menu=[
        {'label':'监督员','url':page('inspector.inspector'),'icon':fa('fa-user-secret'),
         'submenu':[
             {'label':'实时点位','url':page('inspector.inspector_map')},
             {'label':'监督员列表','url':page('inspector.inspector')},
             {'label':'监督员分组','url':page('inspector.inspectorgroup')}, 
             {'label':'监督员排班','url':page('dianzi_weilan.workinspector')}, 
            
           
             ]},
        # {'label':'GIS区域','url':page('geoinfo.blockpolygon'),'icon':fa('fa-map-o')},
        #{'label':'区域编辑','url':page('geoscope.blockgroup'),'icon':fa('fa-map-o')},
        {'label':'案件对比','url':page('case_cmp.duchacase'),'icon':fa('fa-search')},
        {'label':'电子围栏','icon':fa('fa-object-group'),
             'submenu':[
                    {'label':'围栏告警','url':page('dianzi_weilan.warning')},
                    #{'label':'围栏区域','url':page('dianzi_weilan.blockgroup')},
                    {'label':'围栏信息','url':page('dianzi_weilan.groupweilanrel')},
                     {'label':'告警时段组','url':page('inspectorWorkGroup')}, 
                    #{'label':'上班排单','url':page('dianzi_weilan.workinspector')}
                    ]},           
        {'label':'重点区域','icon':fa('fa-key'),
             'submenu':[
                 {'label':'重点巡查区域','url':page('key_region.forcast')},
                 ]},
        #{'label':'参数设置','url':page('kv'),'icon':fa('fa-map-o')},
        
        
    ]
    
    def custome_ctx(self, ctx):
        ctx['js_stamp']=js_stamp
        if not 'table_fun_config' in ctx:
            ctx['table_fun_config'] ={
                'detail_link': '详情', #'<i class="fa fa-info-circle" aria-hidden="true" title="查看详情"></i>'#,
            }
        return ctx      

PcMenu.add_pages(page_dc)


class ProgramerMenu(BaseEngine):
    url_name='Programer'
    brand='Programer'
    mini_brand='Programer'
    menu=[
        
        #{'label':'GIS区域','url':page('geoinfo.blockpolygon'),'icon':fa('fa-map-o')},
        {'label':'区域编辑','url':page('geoscope.blockgroup'),'icon':fa('fa-map-o')},
 
        {'label':'参数设置','url':page('kv'),'icon':fa('fa-map-o')},
        
        
    ]  
    
    def custome_ctx(self, ctx):
        ctx['js_stamp']=js_stamp
        if not 'table_fun_config' in ctx:
            ctx['table_fun_config'] ={
                'detail_link': '详情', #'<i class="fa fa-info-circle" aria-hidden="true" title="查看详情"></i>'#,
            }
        return ctx 

ProgramerMenu.add_pages(page_dc)
