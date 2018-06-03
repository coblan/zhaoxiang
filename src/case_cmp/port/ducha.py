from django.conf import settings
import requests
import json

class DuchaPort(object):
    def get_data(self):
        url = settings.get('SANGO')+'/rq'
        data={
            'model':'TInsCaseMain',
            'filters':{
                'streetcode':1806,
                'status__in':[3 ,-2,-1],
            },
            'end':20
        }
        rt = requests.post(url,data=json.dumps(data))
        dc = json.loads(rt.content)
        return dc
