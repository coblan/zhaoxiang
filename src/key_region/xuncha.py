import requests
from django.conf import settings
import urlparse
import json

xuncha_host = getattr(settings,'XUNCHA_HOST')
class XunCha(object):
    def forcast(self):
        url = urlparse.urljoin(xuncha_host,'forcast?jiezheng=14')
        rt = requests.get(url)
        return json.loads(rt.content)
        
        