from helpers.director.shortcut import FieldsPage, Fields, page_dc, director
from helpers.director.kv import get_value, set_value
import json

class PDAPage(FieldsPage):
    template = 'jb_admin/fields.html'
    class  fieldsCls(Fields): 
        def get_heads(self): 
            return [
                {'name': 'pad_name_list','label': "微信名单",'editor': 'com-field-table-list',
                 'table_heads': [
                     {'name':'dpt_name','label':'部门名称','editor':'com-table-pop-fields-local', 'width': 200,}, 
                     {'name': 'name_list', 'label': '人员名单','width': 400,}, 
                     ],
                 'fields_heads': [
                     {'name': 'dpt_name', 'label': '部门名称','editor':'linetext', 'required': True,}, 
                     {'name': 'name_list', 'label': '人员名单', 'editor': 'blocktext', 'required': True,'help_text': '使用英文逗号分隔，例(张三,李四)',}
                                    ],}
            ]
        
        def get_row(self): 
            return {
                '_director_name': self.get_director_name(),
                'pad_name_list': get_value('pad_name_list', '[]'),
            }
        
        def save_form(self): 
            bb = self.kw.get('pad_name_list')
            bb = bb.replace('，', ',')
            bb = bb.replace(' ', '')
            set_value('pad_name_list', bb)


director.update({
    'pad_name_list': PDAPage.fieldsCls,
})

page_dc.update({
    'pad_name_list': PDAPage,
})