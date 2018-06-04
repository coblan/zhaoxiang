from django.conf import settings
import requests
import json

class JianduPort(object):
    def __init__(self, start, end): 
        self.start = start
        self.end = end

    def get_data(self):
        url = settings.SANGO_BRIDGE+'/rq'
        has_next = True
        page = 1
        while has_next:
            data={
                'fun':'get_jiandu',
                'start': self.start,
                'end': self.end,
                'page':page, 
                'perpage':200
            }
            rt = requests.post(url,data=json.dumps(data))
            case_list = json.loads(rt.text)
            for item in case_list:
                yield item
            
            if len(case_list) < 200:
                has_next = False
            else:
                page += 1
