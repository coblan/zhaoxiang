from .base import *
from .logging import*

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

ALLOWED_HOSTS=['10.231.18.23']
#SANGO_BRIDGE='http://12.110.185.17:8499'
SANGO_BRIDGE='http://10.231.18.23:8499'

#XUNCHA_HOST = "http://10.235.80.249:8199"
XUNCHA_HOST = 'http://10.231.18.23:8199'

RABBIT_SERVER = '10.231.18.23'
RABBIT_USER='zhaoxiang'
RABBIT_PSWD='zhaoxiang'

