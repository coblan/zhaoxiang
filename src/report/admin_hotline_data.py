from helpers.director.shortcut import FieldsPage, Fields, director, page_dc
from helpers.director.kv import get_value, set_value
class HotlineData(FieldsPage):
    template = 'jb_admin/fields.html'
    def get_label(self): 
        return '热线数据设置'
    
    class fieldsCls(Fields):
        def get_heads(self): 
            
            return [
                {'name': 'cunwei_names','label': '村委名单','editor': 'blocktext','help_text': '名字以;(分号)相隔',}, 
                {'name': 'enterprise_names', 'label': '事业单位','editor': 'blocktext','help_text': '名字以;(分号)相隔',}, 
                 {'name': 'hotline_name_map','label': '三级主责<br>部门映射','editor': 'com-field-table-list',
                  'table_heads': [
                      {'name':'org_name','label':'原名称','editor':'com-table-pop-fields-local', 'width': 200,}, 
                      {'name': 'new_name', 'label': '新名称','width': 200,}, 
                      #{'name': 'op', 'label': '', 'editor': 'com-table-change-order',}
                      ],
                  'fields_heads': [
                      {'name': 'org_name', 'label': '原名称','editor':'linetext', 'required': True,}, 
                      {'name': 'new_name', 'label': '新名称', 'editor': 'linetext', 'required': True,}
                      ],}, 
                 
            ]
        
        def get_row(self): 
            return {
                '_director_name': self.get_director_name(),
                'cunwei_names': get_value('cunwei_names'),
                'enterprise_names': get_value('enterprise_names'),
                'hotline_name_map': get_value('hotline_name_map'),
                
            }
        
        def save_form(self): 
            ls = ['cunwei_names', 'enterprise_names', 'hotline_name_map']
            for k, v in self.kw.items():
                if k in ls:
                    set_value(k, v)

director.update({
    'HotlineData': HotlineData.fieldsCls,
})

page_dc.update({
    'HotlineData': HotlineData,
})