import Vue from "vue";
import store from "@/store";
import { Notification, MessageBox, Message, Loading } from "element-ui";

// 判断权限
const checkAuth = (value) => {
  if (value) {
    const all_permission = "*:*:*";
    const permissions = store.getters.permissions || [];
    const hasPermissions = permissions.some((permission) => {
      return (
        all_permission === permission ||
        (value instanceof Array
          ? value.includes(permission)
          : value == permission)
      );
    });
    return hasPermissions;
  } else {
    throw new Error(`请设置操作权限标签值`);
  }
};
// 判断权限 暂时用不到
const checkAuthAsync = async (userAuthItemCode) => {
  return new Promise((resolve, reject) => {
    if (checkAuth(userAuthItemCode)) {
      resolve(true);
    } else {
      Message({
        message: "无权访问此页面，请联系管理页！",
        type: "error",
        duration: 5 * 1000,
      });
      Vue.prototype.$router.navigateTo(-1);
    }
  });
};
// 如果是老板
const currentUserIsBoss = () => {
  let userInfo = store.getters.userInfo;
  return (
    userInfo && userInfo.userTypeEnum && userInfo.userTypeEnum.Name === "Boss"
  );
};
// // 获取卡片的水印
// const getMarkImg = (type) => {
// 	if (type == 'Approval') {
// 		return "/static/image/card/adopt.png";
// 	} else if (type == 'Reject') {
// 		return "/static/image/card/not.png";
// 	} else if (type == 'Draft') {
// 		return "/static/image/card/draft.png";
// 	} else if (type == 'Pending') {
// 		return "/static/image/card/approval.png";
// 	}
// }

const getCheckType = (enumName) => {
  if (!enumName) {
    return null;
  }
  if (enumName === "Draft") {
    return "color:#E6A23C;";
  } else if (enumName === "Pending") {
    return "color:#409EFF;";
  } else if (enumName === "Approval") {
    return "color:#67C23A;";
  } else if (enumName === "Reject") {
    return "color:#F56C6C;";
  }
};
const toOrderPage = (orderName, orderId) => {
  if (!orderName || !orderId) {
    uni.showToast({
      icon: "none",
      position: "top",
      title: "单据跳转参数不能为空",
    });
    return;
  }
  let url = null;
  if (orderName.indexOf("OtherIncomeOrder") > -1) {
    url = "/pages/application/orders/otherOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("ExpenseOrder") > -1) {
    url = "/pages/application/orders/expensesOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("TransferOrder") > -1) {
    url = "/pages/application/orders/rotationOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("CommodityLossOrder") > -1) {
    url = "/pages/application/orders/lossOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("PreCollectOrder") > -1) {
    url = "/pages/application/orders/preColletOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("PrePayOrder") > -1) {
    url = "/pages/application/orders/preAdvanceOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("SaleOrder") > -1) {
    url = "/pages/application/orders/saleOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("SaleReturnOrder") > -1) {
    url = "/pages/application/orders/returnOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("PurchaseOrder") > -1) {
    url = "/pages/application/orders/purchaseOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("PurchaseReturnOrder") > -1) {
    url =
      "/pages/application/orders/purchaseReturnOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("CommodityInputOrder") > -1) {
    url =
      "/pages/application/orders/commodityInputOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("CommodityOutputOrder") > -1) {
    url =
      "/pages/application/orders/commodityOutOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("FundPayOrder") > -1) {
    url = "/pages/application/orders/funPayOrder/detail?orderId=" + orderId;
  } else if (orderName.indexOf("FundCollectOrder") > -1) {
    url = "/pages/application/orders/funCollectOrder/detail?orderId=" + orderId;
  }
  if (url) {
    uni.navigateTo({
      url,
    });
  } else {
    uni.showToast({
      icon: "none",
      position: "top",
      title: "单据跳转失败，请检查参数合规性",
    });
  }
};
const getOrderApprovalStatusEnumTagType = function (enumName) {
  if (!enumName) {
    return null;
  }
  if (enumName === "Draft") {
    return "warning";
  } else if (enumName === "Pending") {
    return "primary";
  } else if (enumName === "Approval") {
    return "success";
  } else if (enumName === "Reject") {
    return "error";
  }
};
const compareDataDictItemValue = (dict, itemCode, value) => {
  if (!dict || !dict.dataDictItemList || !dict.dataDictItemList.length > 0) {
    return null;
  }
  let resList = dict.dataDictItemList.filter((item) => {
    return item.code === itemCode;
  });
  return resList && resList.length > 0 && resList[0].value === value;
};
// 打开图片
const previewImg = (url) => {
  const urls = [url];
  uni.previewImage({
    urls,
  });
};

// 图片缓存
const requestImageCache = (src) => {
  // #ifndef APP-PLUS
  return src;
  // #endif

  // 图片缓存key
  let storageKey = Vue.prototype.$config.imageCachePrefix + src;
  // 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
  let tempPathStorage = uni.getStorageSync(storageKey);
  if (tempPathStorage) {
    return tempPathStorage;
  }
  return new Promise((resolve, reject) => {
    try {
      // 如果没有，执行下载，并存储起来后
      uni.downloadFile({
        url: src,
        success: (res) => {
          if (res.statusCode === 200) {
            // 再进行本地保存
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (res2) => {
                uni.setStorageSync(storageKey, res2.savedFilePath);
                resolve(res2.savedFilePath);
              },
              fail: () => {
                console.log("本地保存失败");
                reject(src);
              },
            });
          } else {
            console.log("图片缓存失败", storageKey, res);
            reject(res.tempFilePath);
          }
        },
        fail: () => {
          reject("图片缓存失败");
        },
      });
    } catch (e) {
      console.error("getImageCache", src, e);
      reject("图片缓存异常");
    }
  })
    .then((res) => {
      console.log("返回res", res);
      return res;
    })
    .catch((err) => {
      console.log("返回src", src);
      return src;
    });
};
// 清除图片缓存
const clearImageKeyCache = () => {
  const res = uni.getStorageInfoSync();
  if (res && res.keys) {
    res.keys
      .filter((item) => item.startsWith(Vue.prototype.$config.imageCachePrefix))
      .forEach((item) => {
        uni.removeStorageSync(item);
      });
  }
  uni.getSavedFileList({
    success: function (res) {
      res.fileList.forEach((item) => {
        uni.removeSavedFile({
          filePath: item.filePath,
          complete: function (res) {
            console.log(res);
          },
        });
      });
    },
  });
};

const getImageCache = (src) => {
  return requestImageCache(src);
};

const formatFileSize = (size) => {
  let kb = 1024;
  let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(size) / Math.log(kb));
  // let unit = size < 1024 ? 'KB' : size < 1024*1024 ? 'MB'
  return (size / Math.pow(kb, i)).toPrecision(3) + " " + unit[i];
};

let allowStorageKey = [
  "token",
  "historyList",
  "userAuthGroup",
  "userInfo",
  "rememberPassword",
];

const clearAllStorageCache = () => {
  allowStorageKey.forEach((item) => {
    uni.removeStorageSync(item);
  });
};
// 动态渲染表格字体颜色
function getCellFontColor({ row, column, rowIndex, columnIndex }) {
  if (column.label) {
    let label = column.label;
    if (label.indexOf("审批") != -1) {
      let type = row.orderApprovalStatusEnum.Name;
      if (type == "Approval") {
        return "color:#67C23A";
      } else if (type == "Reject") {
        return "color:#F56C6C;";
      } else if (type == "Draft") {
        return "color:#E6A23C";
      } else if (type == "Pending") {
        return "color:#409EFF";
      }
    }
    // 包含出库
    else if (label.indexOf("出库") != -1) {
      if (
        row.commodityOutputProgressEnum &&
        row.commodityOutputProgressEnum.Desc == "全部出库"
      ) {
        return "color:#67C23A";
      }
      //
    }
    // 包含入库
    else if (label.indexOf("入库") != -1) {
      if (
        row.commodityInputProgressEnum &&
        row.commodityInputProgressEnum.Desc == "全部入库"
      ) {
        return "color:#67C23A";
      }
      //
    }
    // 包含收款
    else if (label.indexOf("收款") != -1) {
      if (
        row.fundCollectProgressEnum &&
        row.fundCollectProgressEnum.Desc == "全部收款"
      ) {
        return "color:#67C23A";
      }
      //
    }
    // 包含付款
    else if (label.indexOf("付款") != -1) {
      if (
        row.fundPayProgressEnum &&
        row.fundPayProgressEnum.Desc == "全部付款"
      ) {
        return "color:#67C23A";
      }
      //
    }
  }
}

function downloadFile(blob, fileName) {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  // 此写法兼容可火狐浏览器
  document.body.appendChild(link);
  const evt = document.createEvent("MouseEvents");
  evt.initEvent("click", false, false);
  link.dispatchEvent(evt);
  document.body.removeChild(link);
}
// 将Base64文件转为 Blob
function buildBlobByByte(data) {
  const raw = window.atob(data);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array]);
}

// 二进制数组 生成文件
const downloadFileByByte = (data, fileName) => {
  const blob = buildBlobByByte(data);
  downloadFile(blob, fileName);
};

// 导出数据
const exportData = (name, data) => {
  var raw = window.atob(data);
  var uInt8Array = new Uint8Array(data.length);
  for (var i = 0; i < raw.length; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  const link = document.createElement("a");
  const blob = new Blob([uInt8Array], {
    type: "application/vnd.ms-excel",
  });
  link.style.display = "none";
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", name);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

export default {
  checkAuth,
  checkAuthAsync,
  currentUserIsBoss,
  getCheckType,
  toOrderPage,
  compareDataDictItemValue,
  getOrderApprovalStatusEnumTagType,
  previewImg,
  requestImageCache,
  clearImageKeyCache,
  getImageCache,
  clearAllStorageCache,
  formatFileSize,
  getCellFontColor,
  exportData,
  downloadFileByByte,
};
