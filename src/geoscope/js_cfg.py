from helpers.maintenance.update_static_timestamp import js_stamp
from helpers.director.base_data import js_lib

js_lib.update({
    'geoscope_pack_js':'/static/js/geoscope.pack.js?t=%s'%js_stamp.geoscope_pack_js
})