from helpers.director.shortcut import TablePage, ModelTable, page_dc, director, RowFilter
from case_cmp.models import JianduCase
from geoscope.models import BlockGroup, BlockPolygon
from django.db.models import F, Q, Case, When
from django.db.models.aggregates import Count,Sum

class KeyRegionStatic(TablePage):
    template = 'jb_admin/table.html'
    def get_label(self): 
        return '关键区域案件统计'
    
    class tableCls(ModelTable):
        model = BlockPolygon
        #fiel = ['loc', 'org_code', 'id']
        include = ['name']
        
        #def __init__(self, _page=1, row_sort=[], row_filter={}, row_search='', crt_user=None, perpage=None, **kw): 
            #page_dc
        
        def getExtraHead(self): 
            return [
                 {'name': 'total','label': '案件数',}, 
                 {'name': '0','label': '第一类案件',}, 
                 {'name': '1','label': '第二类案件',}, 
                 {'name': '2','label': '第三类案件',}, 
                 {'name': '3','label': '第四类案件',}, 
                 {'name': '4','label': '第五类案件',}, 
                 {'name': '5','label': '其他',}, 
                 {'name': 'nums_bujian','label': '部件',}, 
                 {'name': 'nums_shijian','label': '事件',}, 
                 {'name': 'jie_ratio','label': '结案率',}
            ]
        #def get_heads(self): 
            #return [
            #{'name': 'region','label': '区域',}, 
            #]
            
        def inn_filter(self, query): 
            return query.filter(blockgroup__belong = 'keyAera')
        
        def dict_row(self, inst): 
            poly = inst.bounding
            qq = JianduCase.objects.filter(loc__intersects = poly)
            total = qq.count()
            jie_total = qq.filter(status = 9).count()
            
            q1 = qq.values('litclass').annotate(nums_case = Count('id')).order_by('-nums_case')
            out = {}
            pre_num_case = 0
            for index, case in enumerate(q1):
                pre_num_case += case.get('nums_case')
                out[str(index)] = '%s(%s)' % (case.get('nums_case'), case.get('litclass') )
                if index >= 5:
                    out['5'] = total - pre_num_case
                    break
            bujian = qq.aggregate(nums_bujian = Count(Case(When(infotypeid = 0, then= 1))), \
                                  nums_shijian = Count(Case(When(infotypeid = 1, then= 1))))          
            out.update(bujian)
            out.update({
                 'total': total,
                 'jie_ratio': '%s%%' % round(100.0 * jie_total / total, 2),
            })
            
            return out
        
        
        #def get_query(self): 
            #ls = []
            #for row in JianduCase.objects.all().values('keepersn').annotate(nums_case = Count('id')):
                #ls.append(row)
            #return ls
            
        #def statistics(self, query): 
            #"""
            #"""
            #return query.values('keepersn', 'keepersn__name').exclude(Q(status = 5) | Q(status = 10))\
                   #.annotate(nums_case = Count('id'))\
                   #.annotate(nums_simple = Count(Case(When(Q(deptcode = F('executedeptcode')) & Q( deptcode = '20601'), then= 1)) ))\
                   #.annotate(nums_normal = F('nums_case') - F('nums_simple'))\
                   #.annotate(nums_bujian = Count(Case(When(infotypeid = 0, then= 1))))\
                   #.annotate(nums_shijian = Count(Case(When(infotypeid = 1, then= 1))))\
              
        
        class filters(RowFilter):
            range_fields = ['subtime']
    
director.update({
    'keyregion.caseStatistic': KeyRegionStatic.tableCls,
})
page_dc.update({
    'keyregion.caseStatistic': KeyRegionStatic,
})