# encoding:utf-8
from __future__ import unicode_literals
from django.core.management.base import BaseCommand
from django.conf import settings
from case_cmp.spider.ducha import DuchaCaseSpider
from case_cmp.models import DuchaCase
import json
from inspector.management.commands.alg.geo import cord2loc
from django.contrib.gis.geos import Polygon,Point

import wingdbstub

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def handle(self, *args, **options):
        spd = DuchaCaseSpider()
        for row in spd.get_data():
            taskid=row[1]
            
            obj , _ = DuchaCase.objects.get_or_create(taskid=taskid)
            obj.subtime=row[7]
            obj.bigclass = row[4]
            obj.litclass=row[5]
            obj.addr=row[8]
            
            obj.KEY=row[-2]
            dc = row[-1]
            #obj.coord='%s,%s'%(dc.get('x'),dc.get('y'))
            loc_x,loc_y = cord2loc(float( dc.get('x') ),float( dc.get('y') ))
            obj.loc=Point(x=loc_x,y=loc_y)
            pic = [x['src'] for x in json.loads(dc.get('pic'))]
            obj.pic= pic
            audio = [x['src'] for x in json.loads(dc.get('audio'))]
            obj.audio= audio
            
            
            obj.save()
            
            print(obj.taskid,obj.subtime)
            
            
            

