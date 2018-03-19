# encoding:utf-8
from __future__ import unicode_literals
from django.contrib import admin
from helpers.director.shortcut import page_dc,regist_director,TablePage,FormPage,ModelTable,ModelFields,model_dc
from .models import DuchaCase,JianduCase
from django.contrib.gis.measure import D
from helpers.director.db_tools import to_dict
# Register your models here.
class CaseCmpPage(TablePage):
    """
    ���ݿⰴ�վ�������
    https://stackoverflow.com/questions/19703975/django-sort-by-distance
    """
    class tableCls(ModelTable):
        model=DuchaCase
        exclude=['pic','audio','loc','KEY']
    
    def get_context(self):
        ctx = TablePage.get_context(self)
        ctx['table_fun_config'] ={
               'detail_link': '对比', 
           }
        return ctx

class CaseCmpFormPage(FormPage):
    template='case_cmp/casecmp_form.html'
    class fieldsCls(ModelFields):
        class Meta:
            model=DuchaCase
            exclude=[]
    
        def get_row(self):
            row = ModelFields.get_row(self)
            loc = row['loc']
            row['loc'] = row['loc'].x, row['loc'].y
            
            distance = 3200 
            ref_location = loc
            ls = []
            for case in  JianduCase.objects.filter(loc__distance_lte=(ref_location, D(m=distance))):
                ls.append(
                    to_dict(case,filt_attr=lambda case :{'loc':[case.loc.x,case.loc.y]},exclude=['org_code'])
                )
            
            row['near_case']=ls
            return row
        

page_dc.update({
    'case_cmp.duchacase':CaseCmpPage,
    'case_cmp.duchacase.edit':CaseCmpFormPage,
    
})
    