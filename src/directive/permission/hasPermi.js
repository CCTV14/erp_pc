/**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 ruoyi
 */

import store from "@/store";
// 判断权限
// 如果是老板 暂时不用，因为修改新权限了
// const currentUserIsBoss = () => {
//   let userInfo = store.getters.userInfo;
//   // console.log(userInfo);
//   return (
//     userInfo && userInfo.userTypeEnum && userInfo.userTypeEnum.Name === "Boss"
//   );
// };

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = (store.getters && store.getters.permissions) || [];


    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }

  },
};
