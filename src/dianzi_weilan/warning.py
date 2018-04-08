# encoding:utf-8
from __future__ import unicode_literals
from inspector.models import Inspector
from django.contrib.gis.geos import Polygon,Point
from .models import OutBlockWarning,WorkInspector
from django.utils.timezone import datetime,make_aware
from helpers.director.kv import get_value
from django.utils.timezone import datetime,localtime


def check_inspector(inspector):
    """
    python manage.py check_inspector_pos 命令调用该函数
    
    该函数作用是检查inspector是否在自己所属的电子围栏类，如果不在，则make warning
    inspector的电子围栏来自于所属的group
    """
    if has_warning(inspector):
        return
    
    now = datetime.now()
    in_worktime=False
    work_time = get_value('work_time','8:30-12:30;14:00-18:00')
    ls =work_time.split(';')
    for span in ls:
        start,end = span.split('-')
        start,end = (to_datetime(start),to_datetime(end))
        if start <= now <=end:
            in_worktime=True
    if not in_worktime:
        return
    today = now.date()
    
    try:
        workgroup = WorkInspector.objects.get(date=today)
        inspector_list = list(workgroup.inspector.all())
        # 不是上班组，不报警
        if inspector not in inspector_list:
            return
        # 不在围栏内，不需要报警
        if not list(block_list(inspector)):
            return    
    except WorkInspector.DoesNotExist:
        print('[error]working group of %s is not set'%today)
        # 没设置上班组时，不报警
        return 
    
    # 没有坐标，需要报警
    if inspector.last_loc =='NaN':
            make_warning(inspector) 
            
    # 不在围栏内，需要报警
    x,y=inspector.last_loc.split(',')
    pos = Point(float(x),float(y))
    if not in_the_block(pos, inspector):
        make_warning(inspector)

def block_list(inspector):
    for group in inspector.inspectorgrop_set.all():
        for rel in group.inspectorgroupandweilanrel_set.all():
            yield rel.block.bounding


def in_the_block(pos,inspector):
    out_blocks=[]
    for group in inspector.inspectorgrop_set.all():
        for rel in group.inspectorgroupandweilanrel_set.all():
            polygon = rel.block.bounding
            # 经纬度坐标之distance*100大致等于公里数。因为不准确性的存在，warning_distance是按照公里数来判断的。
            if pos.distance(polygon)*100< float( get_value('warning_distance','0.3') ):
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



def to_datetime(time_str):
    mm = datetime.strptime(time_str,'%H:%M')
    now = datetime.now()
    return mm.replace(year=now.year,month=now.month,day=now.day)