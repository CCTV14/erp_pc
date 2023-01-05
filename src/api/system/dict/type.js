import request from "@/utils/request";

// 查询字典类型列表
export function listType(data) {
  return request({
    url: "/dataDict/findByPage",
    method: "post",
    data: data,
  });
}

// 查询字典类型详细
export function getType(id) {
  return request({
    url: "/dataDict/findById",
    method: "get",
    params: { id: id },
  });
}

// 切换冻结状态
export function changeFrozen(id) {
  return request({
    url: "/dataDict/changeFrozenStatus",
    method: "get",
    params: { id: id },
  });
}

// 新增字典类型
export function addType(data) {
  return request({
    url: "/dataDict/addNew",
    method: "post",
    data: data,
  });
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: "/dataDict/update",
    method: "post",
    data: data,
  });
}

// 删除字典类型
export function delType(id) {
  return request({
    url: "/dataDict/delete",
    method: "get",
    params: { id: id },
  });
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: "/system/dict/type/refreshCache",
    method: "delete",
  });
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: "/system/dict/type/optionselect",
    method: "get",
  });
}
