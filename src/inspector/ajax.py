# encoding:utf-8

from __future__ import unicode_literals
from sango.inspector import InspectorCaseConnecter
from django.utils.timezone import datetime

def get_global():
    return globals()

def get_case_number(code):
    today = datetime.now().date()
    today_str = unicode(today)
    case_query = InspectorCaseConnecter(today_str,today_str,code)
    return case_query.get_number()

