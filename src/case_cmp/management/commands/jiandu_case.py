# encoding:utf-8
from django.core.management.base import BaseCommand
from inspector.models import Inspector
from dianzi_weilan.warning import check_inspector
from django.conf import settings
from case_cmp.spider.jiandu import JianDuSpider
from case_cmp.models import JianduCase
from django.contrib.gis.geos import Polygon,Point
from .alg.geo2 import cord2loc
from django.utils.timezone import datetime
import time
import json

if getattr(settings,'DEV_STATUS',None)=='dev':
    import wingdbstub

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def add_arguments(self, parser):
        #parser.add_argument('mintime', nargs='?',)
        parser.add_argument('-s', nargs='?')
        parser.add_argument('-e', nargs='?')
        
    def handle(self, *args, **options):
        #mintime = options.get('mintime')
        today = datetime.now().strftime('%Y-%m-%d')
        
        end= options.get('e') or today
        mintime = end
        last_case = JianduCase.objects.order_by('-subtime').first()
        if last_case:
            mintime=last_case.subtime
        
        start = options.get('s') or mintime[0:10]
        spd = JianDuSpider(start,end)
        count = 0
        for row in spd.get_data():
            subtime = row[4]
            count +=1
            if count % 50 ==0:
                print(count)
            if subtime >= mintime:
                return
            
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

