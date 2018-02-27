# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2018-02-27 01:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('geoscope', '0002_blockgroup_belong'),
        ('inspector', '0007_inspectorcase_update_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='InspectorGroupAndWeilanRel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blocks', models.ManyToManyField(to='geoscope.BlockPolygon', verbose_name='\u76f8\u5173\u533a\u57df')),
                ('group', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='inspector.InspectorGrop', verbose_name='\u76d1\u7763\u5458\u7ec4')),
            ],
        ),
    ]
