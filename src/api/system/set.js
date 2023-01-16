import request from "@/utils/request";

// 根据code获取配置项数据
export function findByCode(code) {
  return request({
    url: "/sysConfig/findByCode",
    method: "get",
    params: { code: code },
  });
}
// 修改系统配置项的值
export function updateValue(data) {
  return request({
    url: "/sysConfig/updateValue",
    method: "post",
    data: data,
  });
}
