from django.contrib import admin
from helpers.director.shortcut import TablePage, SimTable, page_dc, director, RowFilter
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

weixin = {
    '北崧居委': ['任远青', '俞晓勍', '谭伟明', '江洁', '吴滢', '陶惠芬', '朱惠萍', '查莉蕾', '李洪喜', '胡卓琳', 
                     '邹天宇', '陆伟峰', '史晓燕'],
    '金葫芦二居': ['汪芳', '汪萍', '张丽华', '吕晶', '陆雅雅', '李欣薇'],
    '大型社区': ['王佳伟', '沈旻欢', '翁剑锋', '朱健', '沈殷杰', '龚华', '曹斌', '毛斌康', '卫薛仁', '于澈', 
                     '夏超', '殷天骄', '徐梦亮', '王舒平', '曹莲', '陆姚华', '张柳青', '俞晓勍', '施忆'],
    '巷佳居委会': ['盛秀芳', '毛彩娟', '孙桂兰', '王秀萍', '吴宝娟', '谢玉芹', '徐宇', '闵广英', '陈建', '刘静', 
                        '钱珏', '俞建红', '吴文英'],
    '和睦村': ['陈超', '周雪清', '顾君涛', '徐忠伟', '王玲', '陈达军', '陆晓明', '周敏', '费建平', '徐国春', 
                  '方联根', '范琼花', '顾梦佳'],
    '金葫芦一居': ['李泽威', '吉丽华', '曹春阳', '王辉', '王国春', '沈秋芬', '周琛', '王雪林', '李芸', '陆蓓', 
                        '孙海萍', '费凤娟', '瞿爱芳', ],
    
    '方夏村': ['冯叶鑫', '王嘉麟', '费洁', '方一彬', '刘丽', '宋磊', '陆燕', '钱漪青', '朱建萍', '龚平芳', '沈莺',
                  '顾秋玲', '孟莉莉'],
    '中步村': ['江万明', '蒋春奉', '姜根新', '伍福娟', '林方元', '邵红明', '王炳林', '伍永明', '陈强', '陈家栋', 
                  '王礼', '伍莹楠', '蒋永峰', '赵扣红', '陶杰', '伍品权', '王惠民'],
    '新镇居委': ['周荣明', '杨建华', '张丽娜', '李林芳', '周拥军', '毛永龙', '陆萍娟', '黄佳彬', 
                        '叶敏', '吴义华', '潘星梅', '潘佩根', '吴雪芳'],
    '崧泽村': ['徐东锋', '王健', '孙毅', '顾丽娜', '黄付弟', '校建华', '汪爱民', '张彩英', '朱兆崔', 
                  '吴秋丰', '黄敏红', '刘绪娟', '丁章桂'],
    '赵巷居委': ['曹春雷', '孙进锋', '汤晓琴', '周建军', '陈玉婷', '沈越', '卞圣芳', '姜金娣', '周惠兰',
                        '费雪芳', '崔美芳', '唐九红', '李静'],
}

pda_map = {
    '新镇居委': ['张永泉', '徐洁'],
    '赵巷居委': ['俞凤雷', '汪建军'],
    '崧泽村': ['周明', '徐卫东'],
    '北崧居委': ['张彩军', '许雅俊'],
    '沈泾塘村': ['范超群', '王坚'],
    '和睦村': ['王陈佳', '瞿翠荣'],
    '金葫芦一居': ['姜嗣杰', '杨豪杰'],
    '金葫芦二居': ['崔文峰', '陈涛'],
    '方夏村': ['张建峰', '唐晨'],
    '中步村': ['万亮', '毛建林'],
    '大型社区': ['毛伟强', '陈建华', '王伟'],
}

class Hotline(TablePage):
    template = 'jb_admin/table.html'
    def get_label(self): 
        return '热线报表'
    
    class tableCls(SimTable):
        
        #@classmethod
        #def clean_search_args(cls, search_args):
            #today = timezone.now()
            #sp = timezone.timedelta(days=30)
            #last = today - sp
            #def_start = last.strftime('%Y-%m-%d')
            #def_end = today.strftime('%Y-%m-%d')
            #search_args['_start_data_time'] = search_args.get('_start_data_time') or def_start
            #search_args['_end_data_time'] = search_args.get('_end_data_time') or def_end
            #return search_args        
        
        def get_heads(self): 
            return [
                {'name': 'three','label': '三级部门','width': 120}, 
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
            if not self.search_args.get('_start_data_time') or not self.search_args.get('_end_data_time'):
                return []
            
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
            
            a2={'THREE': '崧泽村委会', 'SOU_COUNT': 5, 'FIRST_YES': 2, 'FIRST_NO': 0, 'REAL_SOLVE': 1, 'JIE_SOLVE': 4, 'MAN_YI': Decimal('0.8'), 'MAN_YI_TOTAL': 2}
            """
            rt_dc = json.loads(rt.text)
            a1 = [{k.lower(): v for (k, v) in row.items() } for row in rt_dc['a1'] ]
            a2 = [{k.lower(): v for (k, v) in row.items()} for row in rt_dc['a2'] ]
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
                if not row['three'] :
                    continue
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
                
                first_total = row.get('first_no', 0) + row.get('first_yes', 0)
                #first_total = first_total
                if not first_total:
        
                    row['first_ratio'] = ''
                    row['first_score'] = ''
                    first_score = 0
                else:
                    first_ratio = row.get('first_yes', 0) / first_total
                    row['first_score'] = 30.0 * first_ratio
                    row['first_score'] = round( row.get('first_score' , 0) , 2)
                    row['first_ratio'] = '%s%%' % round( first_ratio * 100)
                    first_score = 30.0 * first_ratio
                
                row['YuQiGongDan'] = 0
                row['AnShiBanJie_ratio'] = '100%'
                
                real_solve = row.get('real_solve', 0)
                jie_solve = row.get('jie_solve', 0)
                
                solve_total = ( real_solve + jie_solve ) * 1.0 
                if solve_total:
                    row['solve_score'] = 20
                    solve_score = 20
                    real_solve_ratio = real_solve / solve_total
                    jie_solve_ratio = jie_solve / solve_total
                    
                    row['real_solve_ratio'] = '%s%%' % round(real_solve_ratio * 100, 2)
                    row['jie_solve_ratio'] = '%s%%' % round(jie_solve_ratio * 100, 2)
                else:
                    solve_score = 0
                    row['real_solve_ratio'] = '' 
                    row['jie_solve_ratio'] = '' 
                    row['solve_score'] = ''
                
                
                
                manyi_total = row.get('man_yi_total', 0) * 1.0 
                if manyi_total:
                    row['man_yi_ratio'] = float( row.get('man_yi', 0) )/ manyi_total 
                    man_yi_score =  40 * row.get('man_yi_ratio', 0)   
                    row['man_yi_ratio'] = '%s%%' % round(row.get('man_yi_ratio', 0) * 100, 2)
                    row['man_yi_score'] =  round(man_yi_score , 2)
                else:
                    man_yi_score = 0
                    row['man_yi_ratio'] = ''
                    row['man_yi_score'] = ''   
                    
                row['total_score'] = row.get('shou_li_score', 0) + first_score + solve_score + man_yi_score
                row['total_score'] =  round(row.get('total_score', 0) , 3)
                
                row['three'] = name_map.get(row['three'], row['three'])
                
                
            return out_list
            
class GridReport(TablePage):
    template = 'jb_admin/table.html'
    def get_label(self): 
        return '网格化统计'
    
    class tableCls(SimTable):
        #@classmethod
        #def clean_search_args(cls, search_args):
            #today = timezone.now()
            #def_crt = today.strftime('%Y-%m-%d')
            #search_args['data_time'] = search_args.get('data_time') or def_crt
            #return search_args  
        
        def get_heads(self): 
            return [
                {'name': 'three','label': '派件部门',}, 
                {'name': 'count_all','label': '派件数',}, 
                {'name': 'count_shi','label': '事件',}, 
                {'name': 'count_bu','label': '部件',}, 
                {'name': 'count_cun','label': '村居采集',}, 
                {'name': 'count_wei','label': '微信上报',}, 
                {'name': 'count_keeper','label': 'PDA上报',}, 
            ]
        
        def get_operation(self): 
            return [
                {'fun': 'export_excel','editor': 'com-op-btn','label': '导出Excel','icon': 'fa-file-excel-o',}
            ]          
        
        def get_rows(self): 
            """
            a1 [{'three': '北崧居委会', 'count_all': 2, 'count_bu': 2, 'count_shi': 0}
            a2 [{'three': '崧泽村委会', 'count_cun': 15},
            a3 [{'reporter': '孙桂兰', 'count_wei': 4},
            a4 [{'keepername': '孙惠东', 'count_keeper': 34}
            
            """
            if not self.search_args.get('data_time'):
                return []
            
            url = settings.SANGO_BRIDGE+'/rq'
            data={
                'fun':'zhaoxiang_grid_report',
                'datestr': self.search_args.get('data_time')
            }
            
            rt = requests.post(url,data=json.dumps(data), proxies = proxies)
            rt_dc = json.loads(rt.text)
            row_dict = {}
            
            a1 = [{k.lower(): v for (k, v) in row.items() } for row in rt_dc['a1'] ]
            a2 = [{k.lower(): v for (k, v) in row.items()} for row in rt_dc['a2'] ]  
            a3 = [{k.lower(): v for (k, v) in row.items() } for row in rt_dc['a3'] ]
            a4 = [{k.lower(): v for (k, v) in row.items()} for row in rt_dc['a4'] ]            
            
            for row in a1:
                row_dict[row.get('three')] = row
            for row in a2:
                name = row.get('three')
                if name not in row_dict:
                    row_dict[name] = row
                else:
                    row_dict[name].update(row)
            
            rows = [v for (k, v) in row_dict.items()]
            
            for row in rows:
                row['three'] = name_map.get(row['three'], row['three'])
                
            weixin_dict = {}
            for report in a3:
                reporter_name = report['reporter'].replace(' ', '')
                for k, v in weixin.items():
                    if reporter_name in v:
                        weixin_dict[k] = weixin_dict.get(k, 0) + report['count_wei']
                        break
            pda_dict = {}
            for keeper in a4:
                keeper_name = keeper['keepername'].replace(' ', '')
                for k, v in pda_map.items():
                    if keeper_name in v:
                        pda_dict[k] = pda_dict.get(k, 0) + keeper['count_keeper']
            
            for row in rows:
                row['count_wei'] = weixin_dict.get(row['three'], 0)
                row['count_keeper'] = pda_dict.get(row['three'], 0)
            row_names = [row['three'] for row in rows]
            for k, v in weixin_dict.items():
                if k not in row_names:
                    rows.append({
                        'three': k,
                        'count_wei': v,
                    })
            return rows
        
        def getRowFilters(self): 
            return [
                {'name': 'data_time','label': '日期','editor': 'com-filter-date',}
            ]
        
        
            
            
director.update({
    'hotline_report': Hotline.tableCls,
    'GridReport': GridReport.tableCls,
})

page_dc.update({
    'hotline_report': Hotline,
    'GridReport': GridReport,
})