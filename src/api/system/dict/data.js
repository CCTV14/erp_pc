import request from "@/utils/request";

// 查询字典数据列表
export function listData(data) {
  return request({
    url: "/dataDictItem/findByPage",
    method: "post",
    data: data,
  });
}

// 查询字典数据详细
export function getData(id) {
  return request({
    url: "/dataDictItem/findById",
    method: "get",
    params: { id: id },
  });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: "/system/dict/data/type/" + dictType,
    method: "get",
  });
}

// 新增字典数据
export function addData(data) {
  return request({
    url: "/dataDictItem/addNew",
    method: "post",
    data: data,
  });
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: "/dataDictItem/update",
    method: "post",
    data: data,
  });
}

// 删除字典数据
export function delData(id) {
  return request({
    url: "/dataDictItem/delete",
    method: "get",
    params: { id: id },
  });
}

// 切换冻结状态
export function changeFrozen(id) {
  return request({
    url: "/dataDictItem/changeFrozenStatus",
    method: "get",
    params: { id: id },
  });
}
