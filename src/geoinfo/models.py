# encoding:utf-8

from __future__ import unicode_literals

# from django.db import models
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

# Create your models here.

class BlockPolygon(models.Model):
    label=models.CharField('冗长名字',max_length=300)
    name=models.CharField('名字',max_length=100)
    display=models.PolygonField(verbose_name='显示多边形',null=True)
    bounding=models.PolygonField(verbose_name='探测多边形',null=True)
