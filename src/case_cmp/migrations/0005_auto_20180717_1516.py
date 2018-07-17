# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-17 15:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('case_cmp', '0004_auto_20180401_1806'),
    ]

    operations = [
        migrations.AddField(
            model_name='jianducase',
            name='description',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='jianducase',
            name='infotypeid',
            field=models.IntegerField(default=0, help_text='0:部件，1：事件'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jianducase',
            name='keepersn',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='jianducase',
            name='status',
            field=models.IntegerField(default=0, help_text='5:待受理;9:结案;10:已作废'),
            preserve_default=False,
        ),
    ]
