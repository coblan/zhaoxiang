from django.shortcuts import render,HttpResponse
from .sango.inspector import InspectorCaseConnecter
from django.utils.timezone import datetime
# Create your views here.
def inspector_case(request,code):
    today = datetime.now().date()
    today_str = unicode(today)    
    case = InspectorCaseConnecter(today_str, today_str, code)
    return HttpResponse(case.get_page() ,content_type='text/html; charset=utf-8')