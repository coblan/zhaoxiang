# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-08-02 23:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspector', '0012_auto_20180717_1516'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inspector',
            name='code',
            field=models.CharField(blank=True, max_length=50, unique=True, verbose_name='编号'),
        ),
    ]
