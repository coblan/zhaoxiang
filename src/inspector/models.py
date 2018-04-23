# encoding:utf-8
from __future__ import unicode_literals

from django.db import models
# from geoinfo.models import BlockPolygon

# Create your models here.

GEN=(
    ('male','男'),
    ('female','女')
)


class Inspector(models.Model):
    name=models.CharField('姓名',max_length=50,blank=False)
    code=models.CharField('编号',max_length=50,blank=True)
    gen=models.CharField('性别',max_length=30,choices=GEN,blank=True)
    # scope=models.ManyToManyField(BlockPolygon,verbose_name='工作区域',blank=True)
    PDA=models.CharField('PDA号码',max_length=100,blank=True)
    head=models.CharField('头像',max_length=300,blank=True)
    # group=models.ForeignKey(InspectorGrop,verbose_name='从属组',blank=True,on_delete=None,null=True)
    
    last_loc=models.CharField('上次坐标',max_length=100,blank=True)
    track_time= models.DateTimeField(verbose_name='追踪时间',blank=True,null=True)
    
    def __unicode__(self):
        return self.name
    
class InspectorGrop(models.Model):
    name=models.CharField('监督员组',max_length=100,unique=True,blank=False)
    inspector=models.ManyToManyField(Inspector,verbose_name='监督员',blank=True)
    
    def __unicode__(self):
        return self.name

class InspectorCase(models.Model):
    code = models.CharField('编号',max_length=100,unique=True)
    page = models.TextField('案子页面',blank=True)
    update_time = models.DateTimeField('更新时间',auto_now=True)


