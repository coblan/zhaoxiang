# encoding:utf-8
from __future__ import unicode_literals

from django.db import models
from inspector.models import InspectorGrop
from geoscope.models import BlockPolygon
# Create your models here.
class InspectorGroupAndWeilanRel(models.Model):
    block = models.OneToOneField(BlockPolygon,verbose_name='围栏名称',null=True,blank=True)
    groups = models.ManyToManyField(InspectorGrop ,verbose_name='应用对象',null=True,blank=True)
     