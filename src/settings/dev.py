from base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'zhaoxiang_gis',
        'USER': 'postgres',
        'PASSWORD': '123',
        'HOST': '127.0.0.1', 
        'PORT': '5432', 
    },
}

DATA_PROXY ={
    'http': 'socks5://localhost:10899',
} 


XUNCHA_HOST = "http://localhost:8001"

DEV_STATUS='dev'

GDAL_LIBRARY_PATH = r'C:\Program Files (x86)\GDAL\gdal202'