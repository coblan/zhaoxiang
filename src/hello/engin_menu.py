# encoding:utf-8

from __future__ import unicode_literals

from helpers.director.engine import BaseEngine,page,fa,page_dc

class PcMenu(BaseEngine):
    url_name='zhaoxiang'
    menu=[
        {'label':'监督员','url':page('inspector.inspector'),'icon':fa('fa-user-secret'),
         'submenu':[
             {'label':'监督员名单','url':page('inspector.inspector')},
             {'label':'监督员分组','url':page('inspector.inspectorgroup')}
             ]},
        {'label':'GIS区域','url':page('geoinfo.blockpolygon'),'icon':fa('fa-map-o')},
    ]

PcMenu.add_pages(page_dc)