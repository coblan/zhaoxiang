from django.shortcuts import render,HttpResponse
from .sango.inspector import InspectorCaseConnecter
from django.utils.timezone import datetime
from helpers.director.kv import get_value
import json
# Create your views here.
def inspector_case(request,code):
    # today = datetime.now().date()
    # today_str = unicode(today)    
    # case = InspectorCaseConnecter(today_str, today_str, code)
    value = get_value('inspector_case','[]')
    ls = json.loads(value)
    case_list=[]
    case_list.append(ls[0])
    for row in ls:
        if row[-3]==code:
            case_list.append(row)

    return render(request,'inspector/case.html',context={'case_list':case_list})