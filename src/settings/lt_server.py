from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'zhaoxiang_gis',
        'USER': 'root',
        'PASSWORD': 'root533',
        'HOST': '127.0.0.1', 
        'PORT': '5432', 
    },
}


XUNCHA_HOST = "http://10.235.80.249:8199"
XUNCHA_HOST = 'http://12.110.185.17:8199'
