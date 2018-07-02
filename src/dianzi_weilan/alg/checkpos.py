
from inspector.models import Inspector,InspectorWorkGroup


def removeInvalidPos(keeper, posList): 
    """
    移除非工作时间的数据
    """
    worktimes = inspectorWorkTime(keeper)
    leftPos = [x for x in posList if isInWorktime( x.get('pos'), worktimes )]
    return leftPos

def noPosCheck(keeper,posList):
    """
    检查工作时间内，没有数据的点
    """
    pass

def outBoxCheck(keeper,posList):
    """
     {'id': 217972371, 'coordy': -8007.0, 'inserttime': '2018-06-28', 'coordx': -25830.0, 'errordesc': '', 'errorcode': '0', 'tracktime': '2018-06-28', 'keepersn': '31189521', 'workgridcode': ''}

    """
    for pos in posList:
        # 不在围栏内，需要报警
        #x,y=cordToloc(pos.get('coordx'),pos.get('coordy'))
        #pos = Point(float(x),float(y))
        if not in_the_block(pos, inspector):
            pass


def isInWorktime(tracktime, worktimes): 
    for worktime in worktimes:
        lt, gt = worktime.split('-')
        if lt <= worktime <= gt:
            return True
    return False

def inspectorWorkTime(keeper):
    ls=[]
    for workgroup in keeper.inspectorworkgroup_set.all():
        ls.extend(workgroup.work_time.split(';'))
    return ls

def in_the_block(pos,inspector):
    out_blocks=[]
    for group in inspector.inspectorgrop_set.all():
        for rel in group.inspectorgroupandweilanrel_set.all():
            polygon = rel.block.bounding
            # 经纬度坐标之distance*100大致等于公里数。因为不准确性的存在，warning_distance是按照公里数来判断的。
            if pos.distance(polygon)*100< float( get_value('warning_distance','0.3') ):
                return True
            else:
                out_blocks.append(polygon)
    # 某些监督员没有指定区域，尽管没有被框在某个block里面，但是被认为没有 出界
    if not out_blocks:
        return True
    else:
        return False
