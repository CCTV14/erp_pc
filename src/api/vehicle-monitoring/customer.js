import request from "@/utils/request";

// 获取我的客户数据
export function getCustomerMyData(data) {
  return request({
    url: "/customerFollowUp/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
//客户管理 列表
export function getCustomerData(data) {
  return request({
    url: "/customer/findPageForManage",
    method: "post",
    data: data,
  });
}
//客户公海池数据
export function getCustomerPoolData(data) {
  return request({
    url: "/customerPool/findPageForManage",
    method: "post",
    data: data,
  });
}
// 客户跟进状态
export function getCustomerFollowUpStatusEnumList() {
  return request({
    url: "/enum/getCustomerFollowUpStatusEnumList",
    method: "get",
  });
}
//客户类型
export function getCustomerTypeEnumList() {
  return request({
    url: "/enum/getCustomerTypeEnumList",
    method: "get",
  });
}
//客户分组
export function getCustomerGroupEnumList() {
  return request({
    url: "/enum/getCustomerGroupEnumList",
    method: "get",
  });
}
// 客户跟进记录类型
export function getCustomerFollowUpDetailTypeEnumList() {
  return request({
    url: "/enum/getCustomerFollowUpDetailTypeEnumList",
    method: "get",
  });
}
// 客户跟进记录列表 page
export function getCustomerFollowUpDetailFindPageForManageList(data) {
  return request({
    url: "/customerFollowUpDetail/findPageForManage",
    method: "post",
    data: data,
  });
}
// 编辑客户
export function customerUpdate(data) {
  return request({
    url: "/customer/updateCustomer",
    method: "post",
    data: data,
  });
}
// 新增客户
export function customerAdd(data) {
  return request({
    url: "/customer/addNewCustomer",
    method: "post",
    data: data,
  });
}
// 客户详情信息
export function getCustomerDetailById(params) {
  return request({
    url: "/customer/findById",
    method: "get",
    params: params,
  });
}
// 客户余额明细 根据用户查询
export function customerBalanceDetailFindPageByCustomer(data) {
  return request({
    url: "/customerBalanceDetail/findPageByCustomer",
    method: "post",
    data: data,
  });
}
// 客户跟进记录 据客户查询 customer
export function customerFollowUpDetailFindPageByCustomer(data) {
  return request({
    url: "/customerFollowUpDetail/findPageByCustomer",
    method: "post",
    data: data,
  });
}
// 跟进记录 据跟进记录详情查
export function findPageByFollowUp(data) {
  return request({
    url: "/customerFollowUpDetail/findPageByFollowUp",
    method: "post",
    data: data,
  });
}
// 跟进记录详情
export function customerFloowFindById(params) {
  return request({
    url: "/customerFollowUp/findById",
    method: "get",
    params: params,
  });
}
// 客户跟进提醒  分页查询
export function customerFollowUpRemindFindByPage(data) {
  return request({
    url: "/customerFollowUpRemind/findByPage",
    method: "post",
    data: data,
  });
}
// 客户公海池  查找可以添加至公海池的客户（未被跟进中且公海池中不存在的）
export function customerPoolFindCanAddCustomerPage(data) {
  return request({
    url: "/customerPool/findCanAddCustomerPage",
    method: "post",
    data: data,
  });
}
// 客户公海池  将公海池客户分配给用户
export function customerPoolDistributePoolToUser(data) {
  return request({
    url: "/customerPool/distributePoolToUser",
    method: "post",
    data: data,
  });
}
// 用户 - 分页查询 - 选择用户页面分页查询
export function userFindPageForSelect(data) {
  return request({
    url: "/user/findPageForSelect",
    method: "post",
    data: data,
  });
}

// 客户跟进记录 详情 findById
export function customerFloowDetailFindById(params) {
  return request({
    url: "/customerFollowUpDetail/findById",
    method: "get",
    params: params,
  });
}
//将客户添加至公海池
export function customerPoolAddCustomerToPool(data) {
  return request({
    url: "/customerPool/addCustomerToPool",
    method: "post",
    data: data,
  });
}
//将客户分配给用户 公海池
export function customerPoolDistributeCustomerToUser(data) {
  return request({
    url: "/customerPool/distributeCustomerToUser",
    method: "post",
    data: data,
  });
}
// 客户公海池 - findById
export function customerPoolFindById(params) {
  return request({
    url: "/customerPool/findById",
    method: "get",
    params: params,
  });
}
// 客户公海池 修改客户公海池信息
export function customerPoolUpdateCustomerPool(data) {
  return request({
    url: "/customerPool/updateCustomerPool",
    method: "post",
    data: data,
  });
}
// 客户跟进提醒 - 新增跟进提醒
export function customerFollowUpRemindAddNewRemind(data) {
  return request({
    url: "/customerFollowUpRemind/addNewRemind",
    method: "post",
    data: data,
  });
}
