# encoding:utf-8
from __future__ import unicode_literals
from inspector.models import Inspector
from django.contrib.gis.geos import Polygon,Point
from .models import OutBlockWarning
from django.utils.timezone import datetime,make_aware

def check_inspector(inspector):
    if inspector.last_loc and inspector.last_loc !='NaN':
        x,y=inspector.last_loc.split(',')
        pos = Point(float(x),float(y))
        if not in_the_block(pos, inspector):
            if not has_warning(inspector):
                make_warning(inspector)

def in_the_block(pos,inspector):
    out_blocks=[]
    for group in inspector.inspectorgrop_set.all():
        for rel in group.inspectorgroupandweilanrel_set.all():
            polygon = rel.block.bounding
            if polygon.contains(pos):
                return True
            else:
                out_blocks.append(polygon)
    # 某些监督员没有指定区域，尽管没有被框在某个block里面，但是被认为没有 出界
    if not out_blocks:
        return True
    else:
        return False

def has_warning(inspector):
    today=datetime.today()
    today = make_aware( today.replace(hour=0,minute=0) )
    if OutBlockWarning.objects.filter(inspector=inspector,create_time__gt=today,proc_status='unprocess')\
        .exists():
        return True
    return False

def make_warning(inspector):
    OutBlockWarning.objects.create(inspector=inspector)

