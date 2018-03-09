# encoding:utf-8
from __future__ import unicode_literals
from inspector.models import Inspector
from django.contrib.gis.geos import Polygon,Point

def check_inspector(inspector):
    if inspector.last_loc:
        x,y=inspector.last_loc.split(',')
        pos = Point(x,y)
        for block in inspector.groups
