from django.conf import settings
import requests
import json

proxies = getattr(settings, 'DATA_PROXY')

def getKeeperTrack(keepers,start,end):
     """
     {'id': 217972371, 'coordy': -8007.0, 'inserttime': '2018-06-28', 'coordx': -25830.0, 'errordesc': '', 'errorcode': '0', 'tracktime': '2018-06-28', 'keepersn': '31189521', 'workgridcode': ''}

     """
     url =settings.SANGO_BRIDGE+'/rq'
     postData={
            'fun':'keeperTrack',
            'keepers':keepers, 
            'startTime':'2018-06-28',
            'endTime':'2018-06-30',
        } 
     rt = requests.post(url,data=json.dumps(postData),proxies=proxies)
     dc = json.loads(rt.text)
     return dc