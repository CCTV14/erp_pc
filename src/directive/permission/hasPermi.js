/**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 ruoyi
 */

import store from "@/store";
// 判断权限
// 如果是老板
const currentUserIsBoss = () => {
  let userInfo = store.getters.userInfo;
  // console.log(userInfo);
  return (
    userInfo && userInfo.userTypeEnum && userInfo.userTypeEnum.Name === "Boss"
  );
};

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const all_permission = "*:*:*";
    if (!value || value.length === 0) {
      return false;
    }
    if (currentUserIsBoss()) {
      console.log("进入")
      return true;
    }
    let authGroupList = (store.getters && store.getters.permissions) || [];
    const hasPermissions =
      authGroupList.findIndex((authGroup) => {
        return (
          authGroup.authGroupAuthList.findIndex((authGroupAuth) => {
            if (typeof userAuthItemCode === "string") {
              return userAuthItemCode === authGroupAuth.userAuthItem.code;
            } else {
              return (
                userAuthItemCode.indexOf(authGroupAuth.userAuthItem.code) > -1
              );
            }
          }) > -1
        );
      }) > -1;
    if (!hasPermissions) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  },
};
