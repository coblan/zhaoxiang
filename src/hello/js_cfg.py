from helpers.director.base_data import js_tr_list, js_lib_list
from django.utils.translation import ugettext as _
from helpers.maintenance.update_static_timestamp import js_stamp_dc

#def get_tr():
    #return {
        #'base_setting':_('Basic Setting'),
        #'language':_('Language'),
        #'back':_('back'),
        #'search':_('Search'),
        #'change_password':_('Change Password'),
        #'logout':_('LogOut'),
        #'login':_('LogIn'), 
        
    #}

#js_tr_list.append(get_tr)

def get_lib(request): 
    dc = {
        'zhaoxiang': '/static/js/zhaoxiang.pack.js?t=%s'%js_stamp_dc.get('zhaoxiang_pack_js'),
    }
    return dc

js_lib_list.append(get_lib)