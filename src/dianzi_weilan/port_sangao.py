from django.conf import settings
import requests
import json

import logging
log = logging.getLogger('task')

proxies = getattr(settings, 'DATA_PROXY', {})

def getKeeperTrack(keeper,start,end):
     """
     {'coordx': -24790.0, 'coordy': -8363.0, 'tracktime': '2018-07-02 00:00:49'}
     """
     
     url =settings.SANGO_BRIDGE+'/rq'
     postData={
            'fun':'keeperTrack',
            'keeper':keeper, 
            'startTime':start,
            'endTime':end,
        } 
     rt = requests.post(url,data=json.dumps(postData),proxies=proxies)
     ls = json.loads(rt.text)
     return ls