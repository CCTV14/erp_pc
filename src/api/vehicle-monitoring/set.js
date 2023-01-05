import request from "@/utils/request";

//获取数据字典
export function findDictionaries(params) {
	return http.get('dataDict/findVoByCode', params)
}
//更新数据字典
export function updateDictionaries(params) {
	return http.post('dataDictItem/update', params)
}
