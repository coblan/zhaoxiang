# encoding:utf-8
from __future__ import unicode_literals

from django.db import models
from inspector.models import InspectorGrop
from geoscope.models import BlockPolygon
# Create your models here.
class InspectorGroupAndWeilanRel(models.Model):
    group = models.OneToOneField(InspectorGrop,verbose_name='监督员组')
    blocks = models.ManyToManyField(BlockPolygon,verbose_name='相关区域')