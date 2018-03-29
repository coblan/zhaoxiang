# encoding:utf-8
from django.core.management.base import BaseCommand
from inspector.models import Inspector
from dianzi_weilan.warning import check_inspector
from django.conf import settings
if getattr(settings,'DEV_STATUS',None)=='dev':
    import wingdbstub

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def handle(self, *args, **options):
        for person in Inspector.objects.all():
            check_inspector(person)

    