<template>
  <div>
    <div class="content">
      <div class="cont" v-for="(item, index) in penData" :key="index">
        <div class="title">{{ item.title }}</div>
        <div style="display: flex; flex-wrap: wrap; padding-left: 3px">
          <div
            class="cell"
            v-for="(crr, index2) in item.list"
            :key="index2"
            @click="toList(crr.targetUrl, crr.text)"
          >
            <div class="name">{{ crr.text }}</div>
            <div class="info">
              {{ crr.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dynamicKanbanGetPendingOrderCount } from "@/api/vehicle-monitoring/index";
export default {
  data() {
    return {
      pendingOrderCountData: {
        unassignedOutputOrderCount: 0,
        unassignedOutputQuantity: 0,
        notStartOutputOrderCount: 0,
        notStartOutputQuantity: 0,
        deliveringOutputOrderCount: 0,
        deliveringOutputQuantity: 0,
        confirmingOutputOrderCount: 0,
        confirmingOutputQuantity: 0,
        notStartInputOrderCount: 0,
        notStartInputQuantity: 0,
        deliveringInputOrderCount: 0,
        deliveringInputQuantity: 0,
        confirmingInputOrderCount: 0,
        confirmingInputQuantity: 0,
      },
    };
  },
  computed: {
    penData() {
      return [
        {
          title: "销售",
          list: [
            {
              text: "销售单",
              show: this.$thinking.checkAuth("SaleOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.saleOrderPendingCount,
              targetUrl: "/pages/application/orders/saleOrder/list",
            },
          ],
        },
        {
          title: "采购",
          list: [
            {
              text: "采购单",
              show: this.$thinking.checkAuth("PurchaseOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.purchaseOrderPendingCount,
              targetUrl: "/pages/application/orders/purchaseOrder/list",
            },
          ],
        },
        {
          title: "退货",
          list: [
            {
              text: "销售退货单",
              show: this.$thinking.checkAuth("SaleReturnOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.saleReturnOrderPendingCount,
              targetUrl: "/pages/application/orders/returnOrder/list",
            },
            {
              text: "采购退货单",
              show: this.$thinking.checkAuth(
                "PurchaseReturnOrder_ApprovalOrder"
              ),
              value: this.pendingOrderCountData.purchaseReturnOrderPendingCount,
              targetUrl: "/pages/application/orders/purchaseReturnOrder/list",
            },
          ],
        },
        {
          title: "库存",
          list: [
            {
              text: "出库单",
              show: this.$thinking.checkAuth(
                "CommodityOutputOrder_ApprovalOrder"
              ),
              value:
                this.pendingOrderCountData.commodityOutputOrderPendingCount,
              targetUrl: "/pages/application/orders/commodityOutOrder/list",
            },
            {
              text: "入库单",
              show: this.$thinking.checkAuth(
                "CommodityInputOrder_ApprovalOrder"
              ),
              value: this.pendingOrderCountData.commodityInputOrderPendingCount,
              targetUrl: "/pages/application/orders/commodityInputOrder/list",
            },
            {
              text: "报损单",
              show: this.$thinking.checkAuth(
                "CommodityLossOrder_ApprovalOrder"
              ),
              value: this.pendingOrderCountData.commodityLossOrderPendingCount,
              targetUrl: "/pages/application/orders/lossOrder/list",
            },
          ],
        },
        {
          title: "资金",
          list: [
            {
              text: "资金互转单",
              show: this.$thinking.checkAuth(
                "FundAccountTransferOrder_ApprovalOrder"
              ),
              value:
                this.pendingOrderCountData.fundAccountTransferOrderPendingCount,
              targetUrl: "/pages/application/orders/rotationOrder/list",
            },
            {
              text: "收款单",
              show: this.$thinking.checkAuth("FundCollectOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.fundCollectOrderPendingCount,
              targetUrl: "/pages/application/orders/funCollectOrder/list",
            },
            {
              text: "付款单",
              show: this.$thinking.checkAuth("FundPayOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.fundPayOrderPendingCount,
              targetUrl: "/pages/application/orders/funPayOrder/list",
            },
            {
              text: "预收单",
              show: this.$thinking.checkAuth("PreCollectOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.preCollectOrderPendingCount,
              targetUrl: "/pages/application/orders/preColletOrder/list",
            },
            {
              text: "预付单",
              show: this.$thinking.checkAuth("PrePayOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.prePayOrderPendingCount,
              targetUrl: "/pages/application/orders/preAdvanceOrder/list",
            },
            {
              text: "其他收入单",
              show: this.$thinking.checkAuth("OtherIncomeOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.otherIncomeOrderPendingCount,
              targetUrl: "/pages/application/orders/otherOrder/list",
            },
            {
              text: "费用支出单",
              show: this.$thinking.checkAuth("ExpenseOrder_ApprovalOrder"),
              value: this.pendingOrderCountData.expenseOrderPendingCount,
              targetUrl: "/pages/application/orders/expensesOrder/list",
            },
          ],
        },
      ];
    },
  },
  mounted() {
    this.getPendingOrderData();
  },
  methods: {
    toList(targetUrl, text) {
      uni.navigateTo({
        url:
          targetUrl +
          "?awaitEventChannel=true" +
          (text ? "&title=待审" + text : ""),
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("acceptDataFromOpenerPage", {
            onlyPendingOrder: true,
          });
        },
      });
    },
    getPendingOrderData() {
      dynamicKanbanGetPendingOrderCount().then((res) => {
        if (res && res.success) {
          this.pendingOrderCountData = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 26px;

  .cont {
    .title {
      font-size: 18px;
      color: #333333;
      padding-top: 5px;
      padding-bottom: 10px;
      font-weight: bold;
    }

    .cell {
      display: flex;
      flex-wrap: wrap;
      width: 105px;
      padding: 15px;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-bottom: 9px;
      margin-right: 10px;
      background: white;
      border-radius: 8px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      // width: 50%;

      .name {
        justify-content: center;
        font-size: 15px;
        color: rgb(48, 49, 51);
        margin-bottom: 7px;
        font-weight: bold;
      }

      .info {
        font-size: 16px;
        color: #3c9cff;
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>
