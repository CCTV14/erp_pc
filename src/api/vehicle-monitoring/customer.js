import request from '@/utils/request'

// 获取我的客户数据
export function getCustomerMyData(data) {
  return request({
    url: '/customerFollowUp/findPageForCurrentUser',
    method: 'post',
    data: data
  })
}
//客户管理 列表
export function getCustomerData(data) {
  return request({
    url: '/customer/findPageForManage',
    method: 'post',
    data: data
  })
}
//客户公海池数据
export function getCustomerPoolData(data) {
  return request({
    url: '/customerPool/findPageForManage',
    method: 'post',
    data: data
  })
}
// 客户跟进状态
export function getCustomerFollowUpStatusEnumList() {
  return request({
    url: '/enum/getCustomerFollowUpStatusEnumList',
    method: 'get'
  })
}
//客户类型
export function getCustomerTypeEnumList() {
  return request({
    url: '/enum/getCustomerTypeEnumList',
    method: 'get'
  })
}
//客户分组
export function getCustomerGroupEnumList() {
  return request({
    url: '/enum/getCustomerGroupEnumList',
    method: 'get'
  })
}
// 客户跟进记录类型
export function getCustomerFollowUpDetailTypeEnumList() {
  return request({
    url: '/enum/getCustomerFollowUpDetailTypeEnumList',
    method: 'get'
  })
}
// 客户跟进记录列表 page
export function getCustomerFollowUpDetailFindPageForManageList(data) {
  return request({
    url: '/customerFollowUpDetail/findPageForManage',
    method: 'post',
    data: data
  })
}