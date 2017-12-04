# encoding:utf-8

from __future__ import unicode_literals

from helpers.director.engine import BaseEngine,page,fa,page_dc

class PcMenu(BaseEngine):
    url_name='zhaoxiang'
    menu=[
        {'label':'GIS区域','url':page('geoinfo.blockpolygon'),'icon':fa('fa-home')},
    ]

PcMenu.add_pages(page_dc)