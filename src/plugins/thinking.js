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
      if (row.commodityOutputProgressEnum.Desc == "全部出库") {
        return "color:#67C23A";
      }
      //
    }
    // 包含入库
    else if (label.indexOf("入库") != -1) {
      if (row.commodityInputProgressEnum.Desc == "全部入库") {
        return "color:#67C23A";
      }
      //
    }
    // 包含收款
    else if (label.indexOf("收款") != -1) {
      if (row.fundCollectProgressEnum.Desc == "全部收款") {
        return "color:#67C23A";
      }
      //
    }
    // 包含付款
    else if (label.indexOf("付款") != -1) {
      if (row.fundPayProgressEnum.Desc == "全部付款") {
        return "color:#67C23A";
      }
      //
    }
  }
}
export default {
  getCellFontColor,
};
