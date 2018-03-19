# encoding:utf-8
from django.core.management.base import BaseCommand
from inspector.models import Inspector
from dianzi_weilan.warning import check_inspector
from django.conf import settings
from case_cmp.spider.jiandu import JianDuSpider
from case_cmp.models import JianduCase
from django.contrib.gis.geos import Polygon,Point
from inspector.management.commands.alg.geo import cord2loc

import json

import wingdbstub

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def handle(self, *args, **options):
        spd = JianDuSpider()
        for row in spd.get_data():
            taskid=row[2]
        
            obj , _ = JianduCase.objects.get_or_create(taskid=taskid)
            obj.subtime=row[4]
            obj.bigclass = row[6]
            obj.litclass=row[7]
            obj.addr=row[10]
        
            x,y = row[-1].split(',')
            loc_x,loc_y = cord2loc(float( x ),float( y ))
            obj.loc=Point(x=loc_x,y=loc_y)
            
            obj.org_code = json.dumps(row)
            obj.save()
            
            print(obj.taskid,obj.subtime)

