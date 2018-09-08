from django.contrib import admin
from helpers.director.shortcut import TablePage, SimTable, page_dc, director
import requests
from django.conf import settings
import json
from django.utils import timezone

proxies = getattr(settings,'DATA_PROXY',{})

# Register your models here.


name_map = {
    '金葫芦二区居委会（垂姚）': '金葫芦二居',
    '金葫芦一区居委会（南崧）': '金葫芦一居',
    '特色居住区第二居委筹备组': '佳辉居委',
    '特色居住区第一居委筹备组': '佳煌居委',
    '赵巷二居委筹备组': '巷佳居委',
    '中步村委会': '中步村',
    '赵巷居委会': '赵巷居委',
    '新镇居委会': '新镇居委',
    '崧泽村委会': '崧泽村',
    '金汇村居委': '金汇村',
    '和睦村委会': '和睦村',
    '方夏村委会': '方夏村',
    '北崧居委会': '北崧居委',
    '沈泾塘村委会': '沈泾塘村',
    '安全管理事务中心': '安管中心',
    '房管办': '房管所',
    '规划建设和环境保护办公室': '规保办',
    '环境卫生管理所': '巷馨公司',
    '经济发展办公室': '经发办',
    '农业综合服务中心': '农服中心',
    '社会事业发展办公室': '社发办',
    '物业管理': '物业公司',
    '赵巷城管中队': '城管中队',
    '赵巷市场监督管理所': '市场监管所',
    '赵巷镇河长办': '河长办',
}

class Hotline(TablePage):
    template = 'jb_admin/table.html'
    def get_label(self): 
        return '热线报表'
    
    class tableCls(SimTable):
        
        @classmethod
        def clean_search_args(cls, search_args):
            today = timezone.now()
            sp = timezone.timedelta(days=30)
            last = today - sp
            def_start = last.strftime('%Y-%m-%d')
            def_end = today.strftime('%Y-%m-%d')
            search_args['_start_data_time'] = search_args.get('_start_data_time') or def_start
            search_args['_end_data_time'] = search_args.get('_end_data_time') or def_end
            return search_args        
        
        def get_heads(self): 
            return [
                {'name': 'three','label': '三级部门','width': 80}, 
                {'name': 'shou_li','label': '受理量',}, 
                
                {'name': 'shou_li_score','label': '受理量得分','width': 90,}, 
                {'name': 'first_ratio','label': '先行联系率','width': 18*5}, 
                {'name': 'first_score','label': '先行联系率得分','width': 18*6,}, 
                
                {'name': 'sou_count', 'label': '办结量',}, 
                {'name': 'YuQiGongDan','label': '逾期工单量','width': 18*5}, 
                {'name': 'AnShiBanJie_ratio','label': '按时办结率','width': 18*5}, 
                {'name': 'JianFen','label': '减分情况',}, 
                
                {'name': 'real_solve','label': '实际解决数','width': 18*5}, 
                {'name': 'real_solve_ratio','label': '实际解决率','width': 18*5}, 
                {'name': 'jie_solve','label': '解释说明数','width': 18*5}, 
                {'name': 'jie_solve_ratio','label': '解释说明率','width': 18*5}, 
                {'name': 'solve_score','label': '诉求解决得分','width': 18*6}, 
                
                {'name': 'man_yi_ratio','label': '市民满意率','width': 18*5}, 
                {'name': 'man_yi_score','label': '市民满意得分','width': 18*6}, 
                
                {'name': 'total_score','label': '总得分',}
                
            ]
        
        def getRowFilters(self): 
            return [
                {'name': 'data_time','label': '日期','editor': 'com-date-datetimefield-range-filter',}
            ]
        
        def get_operation(self): 
            return [
                {'fun': 'export_excel','editor': 'com-op-btn','label': '导出Excel','icon': 'fa-file-excel-o',}
            ]        
        
        def get_rows(self): 
            url = settings.SANGO_BRIDGE+'/rq'
            data={
                'fun':'zhaoxiang_hotline_report',
                'start': self.search_args.get('_start_data_time'),
                'end': self.search_args.get('_end_data_time'),
            }
            
            rt = requests.post(url,data=json.dumps(data), proxies = proxies)
            """
            a1={'three': '崧泽村委会', 'shou_li': 9}, {'three': '综合协管大队', 'shou_li': 5}
            a2={'three': '崧泽村委会',  'first_yes': 3, 'first_no': 0, 'first_total': 3, 'first_ratio': 1.0, 'real_solve': 2, 'jie_solve': 6, 'total_solve': 8, 'real_solve_ratio': 0.25, 'jie_solve_ratio': 0.75, 'man_yi': 1.6, 'man_yi_total': 3, 'man_yi_ratio': 0.5333333333333333}
            """
            rt_dc = json.loads(rt.text)
            a1 = rt_dc['a1']
            a2 = rt_dc['a2']
            out_list = []

            for row2 in a2:
                for row1 in a1:
                    if row1['three'] == row2['three']:
                        row = row2
                        row.update(row1)
                        a1.remove(row1)
                        out_list.append(row)
 
                        break
            out_list.extend(a1)
            
            cun_list = []
            other_list = []            
            for row in out_list:
                if '村委' in row['three'] or '居委' in row['three']:
                    cun_list.append(row)
                else:
                    other_list.append(row)
            
            cun_total = sum([row.get('shou_li', 0) for row in cun_list])
            other_total = sum([row.get('shou_li', 0) for row in other_list])
            
            for row in cun_list:
                row['shou_li_score'] = round(5.0 * row.get('shou_li', 0) / cun_total, 3)
            for row in other_list:
                row['shou_li_score'] = round( 5.0 * row.get('shou_li', 0) / other_total, 3)
            
            out_list = cun_list + other_list
            for row in out_list:
                row['first_score'] = 30.0 * row.get('first_ratio' , 0)
                row['first_ratio'] = '%s%%' % round( row.get('first_ratio', 0) * 100)
                
                row['YuQiGongDan'] = 0
                row['AnShiBanJie_ratio'] = '100%'
                
                row['solve_score'] = 20
                row['man_yi_score'] = 40 * row.get('man_yi_ratio', 0)
                row['total_score'] = row.get('shou_li_score') + row.get('first_score') + row.get('solve_score') + row.get('man_yi_score')
                
                
                row['real_solve_ratio'] = '%s%%' % round(row.get('real_solve_ratio', 0) * 100, 2)
                row['jie_solve_ratio'] = '%s%%' % round(row.get('jie_solve_ratio', 0) * 100, 2)
                
                row['first_score'] = round( row.get('first_score' , 0) , 2)
                row['man_yi_ratio'] = '%s%%' % round(row.get('man_yi_ratio', 0) * 100, 2)
                row['man_yi_score'] =  round(row.get('man_yi_score', 0) , 2)
                
                row['total_score'] =  round(row.get('total_score', 0) , 3)
                
                row['three'] = name_map.get(row['three'], row['three'])
                
            return out_list
            
            
            
            
director.update({
    'hotline_report': Hotline.tableCls,
})

page_dc.update({
    'hotline_report': Hotline,
})