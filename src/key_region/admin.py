from django.contrib import admin
from helpers.director.shortcut import page_dc
from alg import polygon2circle
from xuncha import XunCha
from geoinfo.polygon import dict2poly
# Register your models here.
class Forcast(object):
    template='key_region/forcast.html'
    def __init__(self,*args,**kw):
        pass
    
    def get_context(self):
        xun_sys = XunCha()
        poly_list = xun_sys.forcast()
        out = []
        for poly_dc in poly_list:
            poly_cods =poly_dc['polygon']
            poly = dict2poly(poly_cods)
            circle = polygon2circle(poly)
            out.append(circle)
        return {
            'circles':out
        }



page_dc.update({
    'key_region.forcast':Forcast,
})