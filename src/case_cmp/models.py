# encoding:utf-8

from __future__ import unicode_literals

#from django.db import models
from django.contrib.gis.db import models
#from helpers.base.jsonfield import JsonField

# Create your models here.

class DuchaCase(models.Model):
    taskid=models.CharField('任务号',max_length=20,blank=True)
    subtime=models.CharField('发现时间',max_length=20,blank=True)
    bigclass=models.CharField('大类',max_length=30,blank=True)
    litclass=models.CharField('小类',max_length=30,blank=True)
    addr=models.CharField('地址',max_length=500,blank=True)
    pic=models.TextField('图片',blank=True)
    audio=models.TextField('音频',blank=True)
    KEY=models.CharField('KEY',max_length=30,blank=True)
    loc = models.PointField(verbose_name='经纬度',blank=True,null=True)
    
    def __unicode__(self):
        return self.taskid
    

class JianduCase(models.Model):
    taskid=models.CharField('任务号',max_length=20,blank=True)
    subtime=models.CharField('发现时间',max_length=20,blank=True)
    bigclass=models.CharField('大类',max_length=30,blank=True)
    litclass=models.CharField('小类',max_length=30,blank=True)
    addr=models.CharField('地址',max_length=500,blank=True)
    loc = models.PointField(verbose_name='经纬度',blank=True,null=True)
    org_code =models.TextField('原始抓取数据',blank=True)
    