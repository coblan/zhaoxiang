hotline_secod = """
SELECT
	TASKID 任务号,
	TO_CHAR ( PERCREATETIME, 'yyyy-mm-dd hh24:mi' ) 受理时间,
	INFOTYPENAME 案件属性,
	UPKEEPERNAME 监督员姓名,
	TO_CHAR ( CREATETIME, 'yyyy-mm-dd hh24:mi' ) 立案时间,
	CITYGRID.F_REC_MAINDEPTNAME ( EXECUTEDEPTCODE, DEPTCODE, TASKID ) 主责部门,
	CITYGRID.F_REC_THREEDEPTNAME ( EXECUTEDEPTCODE, DEPTCODE, TASKID ) 三级主责部门,
CASE
	ISFIRSTCONTACT 
	WHEN 1 THEN
	'是' 
	WHEN 0 THEN
	'否' 
	WHEN 2 THEN
	'未评价' 
	END 先行联系,
	ResultTypename_bf 解决情况,
	ALLMANYINAME_BF 综合满意度,
	TO_CHAR ( ENDTIME, 'yyyy-mm-dd hh24:mi' ) 结案时间,
	CaseValuationName 结案评判 
FROM
	CITYGRID.T_TASKINFO main 
WHERE
	1 = 1 
	AND discovertime BETWEEN TO_DATE ( '2018-07-10 00:00:00', 'yyyy-MM-dd HH24:mi:ss' ) 
	AND TO_DATE ( '2018-07-10 23:59:59', 'yyyy-MM-dd HH24:mi:ss' ) 
	AND ( STATUS IN ( 100 ) OR STATUS IN ( 3, 4, 5, 6, 7, 8, 9 ) ) 
	AND InfoSourceid IN ( 1 ) 
	AND STREETCODE IN ( '1806' ) 
	AND (
	EXISTS (
SELECT
	1 
FROM
	CITYGRID.t_info_solving ts 
WHERE
	( ts.executedeptcode = '20601' OR ts.DeptCode = '20601' ) 
	AND ts.taskid = main.taskid 
	AND ts.STATUS != 3 
	) 
	OR main.deptcode = '20601' 
	)
"""

grid_first = """
SELECT
	TASKID 任务号,
	TO_CHAR ( PERCREATETIME, 'yyyy-mm-dd hh24:mi' ) 受理时间,
	INFOTYPENAME 案件属性,
	UPKEEPERNAME 监督员姓名,
	TO_CHAR ( CREATETIME, 'yyyy-mm-dd hh24:mi' ) 立案时间,
	CITYGRID.F_REC_MAINDEPTNAME ( EXECUTEDEPTCODE, DEPTCODE, TASKID ) 主责部门,
	CITYGRID.F_REC_THREEDEPTNAME ( EXECUTEDEPTCODE, DEPTCODE, TASKID ) 三级主责部门,
CASE
	ISFIRSTCONTACT 
	WHEN 1 THEN
	'是' 
	WHEN 0 THEN
	'否' 
	WHEN 2 THEN
	'未评价' 
	END 先行联系,
	ResultTypename_bf 解决情况,
	ALLMANYINAME_BF 综合满意度,
	TO_CHAR ( ENDTIME, 'yyyy-mm-dd hh24:mi' ) 结案时间,
	CaseValuationName 结案评判 
FROM
	CITYGRID.T_TASKINFO main 
WHERE
	1 = 1 
	AND discovertime BETWEEN TO_DATE ( '2018-07-10 00:00:00', 'yyyy-MM-dd HH24:mi:ss' ) 
	AND TO_DATE ( '2018-07-10 23:59:59', 'yyyy-MM-dd HH24:mi:ss' ) 
	AND (
	status IN ( 100 ) 
	OR status IN ( 3, 4, 5, 6, 7, 8, 9 )) 
	AND InfoSourceid IN ( 1 ) 
	AND STREETCODE IN ( '1806' ) 
	AND (
	EXISTS (
SELECT
	1 
FROM
	CITYGRID.t_info_solving ts 
WHERE
	( ts.executedeptcode = '20601' OR ts.DeptCode= '20601' ) 
	AND ts.taskid= main.taskid 
	AND ts.status != 3 
	) 
	OR main.deptcode = '20601')
"""
grid_second = """
SELECT
	TASKID 任务号,
	INFOSOURCENAME 案件来源,
	TO_CHAR ( PERCREATETIME, 'yyyy-mm-dd hh24:mi' ) 受理时间,
	INFOTYPENAME 案件属性,
	UPKEEPERNAME 监督员姓名,
	REPORTER 诉求联系人,
	TO_CHAR ( CREATETIME, 'yyyy-mm-dd hh24:mi' ) 立案时间,
	CITYGRID.F_REC_MAINDEPTNAME ( EXECUTEDEPTCODE, DEPTCODE, TASKID ) 主责部门,
	CITYGRID.F_REC_THREEDEPTNAME ( EXECUTEDEPTCODE, DEPTCODE, TASKID ) 三级主责部门,
CASE
	ISFIRSTCONTACT 
	WHEN 1 THEN
	'是' 
	WHEN 0 THEN
	'否' 
	WHEN 2 THEN
	'未评价' 
	END 先行联系,
	ResultTypename_bf 解决情况,
	ALLMANYINAME_BF 综合满意度,
	TO_CHAR ( ENDTIME, 'yyyy-mm-dd hh24:mi' ) 结案时间,
	CaseValuationName 结案评判 
FROM
	CITYGRID.T_TASKINFO main 
WHERE
	1 = 1 
	AND discovertime BETWEEN TO_DATE ( '2018-07-01 00:00:00', 'yyyy-MM-dd HH24:mi:ss' ) 
	AND TO_DATE ( '2018-07-10 23:59:59', 'yyyy-MM-dd HH24:mi:ss' ) 
	AND ( STATUS IN ( 100 ) OR STATUS IN ( 3, 4, 5, 6, 7, 8, 9 ) ) 
	AND InfoSourceid IN ( 1, 36, 61 ) 
	AND STREETCODE IN ( '1806' ) 
	AND (
	EXISTS (
SELECT
	1 
FROM
	CITYGRID.t_info_solving ts 
WHERE
	( ts.executedeptcode = '20601' OR ts.DeptCode = '20601' ) 
	AND ts.taskid = main.taskid 
	AND ts.STATUS != 3 
	) 
	OR main.deptcode = '20601' 
	)
"""