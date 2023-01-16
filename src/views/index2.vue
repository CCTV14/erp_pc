<template>
  <div class="app-container home">
    <!-- 最近使用 -->
    <!-- <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="card bornone">
          <div slot="header" class="title">
            <span>最近使用</span>
          </div>
          <div class="cont">
            <div v-for="(item, index) in historyList" :key="index">
              <el-image
                style="width: 70px; height: 70px"
                :src="item.imgUrl"
              ></el-image>
              <div class="mt15">销售单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row> -->
    <!-- 我的待办 -->
    <el-row :gutter="24" class="mt20 mb20">
      <el-col :span="24">
        <el-card class="card bornone flex-card" style="padding-bottom: 10px">
          <div slot="header" class="title">
            <span>我的待办</span>
          </div>
          <div
            class="agency"
            v-for="(item, index) in agencyList"
            :key="index"
            @click="toDetail(item.name)"
          >
            <el-image
              style="width: 80px; height: 85px"
              :src="item.imgUrl"
            ></el-image>
            <div class="descriptions">
              <div class="num">{{ item.count }}</div>
              <div class="desc mt5">{{ item.name }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 四个排行/分析 -->
    <el-row :gutter="14">
      <el-col :span="24">
        <sale-data />
      </el-col>
      <!-- <el-col :span="16">
        <sale-line />
      </el-col> -->
    </el-row>
    <!-- 排行 -->
    <el-row :gutter="14" class="mt20">
      <el-col :span="12">
        <sale-rank type="pay" />
      </el-col>
      <el-col :span="12">
        <sale-rank type="collect" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import data from "../components/Home/data.vue";
import line from "../components/Home/line.vue";
import rank from "../components/Home/rank.vue";
import {
  dynamicKanbanGetPendingOrderCount,
  dynamicKanbanGetCommodityInOutQuantity,
  dynamicKanbanGetFollowUpCount,
  dynamicKanbanGetCommoditySpecQuantityWarningCount,
} from "@/api/vehicle-monitoring/index";
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.3",
      // 我的待办
      agencyList: [
        {
          count: 8,
          name: "待审单据",
          imgUrl: require("../assets/images/home/pending_order.png"),
        },
        {
          count: 0,
          name: "待出入库",
          imgUrl: require("../assets/images/home/commodity_inout.png"),
        },
        {
          count: 23,
          name: "客户跟进",
          imgUrl: require("../assets/images/home/customer_floow.png"),
        },
        {
          count: 12,
          name: "库存预警",
          imgUrl: require("../assets/images/home/inventory_warning.png"),
        },
      ],
      // 历史使用
      historyList: [
        {
          name: "销售单",
          imgUrl: require("../assets/images/home/history/sale_order.png"),
        },
        {
          name: "采购单",
          imgUrl: require("../assets/images/home/history/purchase_order.png"),
        },
        {
          name: "跟进记录",
          imgUrl: require("../assets/images/home/history/floow_record.png"),
        },
        {
          name: "入库单",
          imgUrl: require("../assets/images/home/history/commodity_inputOrder.png"),
        },
        {
          name: "供应商",
          imgUrl: require("../assets/images/home/history/supplier_manager.png"),
        },
        {
          name: "商品管理",
          imgUrl: require("../assets/images/home/history/commodity_manager.png"),
        },
        {
          name: "客户公海池",
          imgUrl: require("../assets/images/home/history/customer_pool.png"),
        },
        {
          name: "其他收入",
          imgUrl: require("../assets/images/home/history/other_income.png"),
        },
        {
          name: "商品分类",
          imgUrl: require("../assets/images/home/history/commodity_cagetory.png"),
        },
      ],
    };
  },
  components: {
    saleData: data,
    saleLine: line,
    saleRank: rank,
  },
  mounted() {
    this.getPendingOrderCount();
    this.getCommodityInOutQuantity();
    this.getCommoditySpecQuantityWarningCount();
    this.getFollowUpCount();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    // 我的待办跳转到详情
    toDetail(name) {
      let data = {
        待审单据: "pending-order",
        库存预警: "inventory-warning",
        客户跟进: "customer-my",
        待出入库: "commodity-inout",
      };
      this.$router.push({ path: "vehicle/" + data[name] });
    },
    // 获取待审单据数量
    async getPendingOrderCount(args) {
      let res = await dynamicKanbanGetPendingOrderCount(args);
      if (res && res.success) {
        let count = 0;
        if (
          this.$thinking.checkAuth("FundAccountTransferOrder_ApprovalOrder")
        ) {
          count += res.data.fundAccountTransferOrderPendingCount;
        }
        if (this.$thinking.checkAuth("ExpenseOrder_ApprovalOrder")) {
          count += res.data.expenseOrderPendingCount;
        }
        if (this.$thinking.checkAuth("OtherIncomeOrder_ApprovalOrder")) {
          count += res.data.otherIncomeOrderPendingCount;
        }
        if (this.$thinking.checkAuth("PrePayOrder_ApprovalOrder")) {
          count += res.data.prePayOrderPendingCount;
        }
        if (this.$thinking.checkAuth("PreCollectOrder_ApprovalOrder")) {
          count += res.data.preCollectOrderPendingCount;
        }
        if (this.$thinking.checkAuth("SaleOrder_ApprovalOrder")) {
          count += res.data.saleOrderPendingCount;
        }
        if (this.$thinking.checkAuth("SaleReturnOrder_ApprovalOrder")) {
          count += res.data.saleReturnOrderPendingCount;
        }
        if (this.$thinking.checkAuth("PurchaseOrder_ApprovalOrder")) {
          count += res.data.purchaseOrderPendingCount;
        }
        if (this.$thinking.checkAuth("PurchaseReturnOrder_ApprovalOrder")) {
          count += res.data.purchaseReturnOrderPendingCount;
        }
        if (this.$thinking.checkAuth("CommodityOutputOrder_ApprovalOrder")) {
          count += res.data.commodityOutputOrderPendingCount;
        }
        if (this.$thinking.checkAuth("CommodityInputOrder_ApprovalOrder")) {
          count += res.data.commodityInputOrderPendingCount;
        }
        if (this.$thinking.checkAuth("FundCollectOrder_ApprovalOrder")) {
          count += res.data.fundCollectOrderPendingCount;
        }
        if (this.$thinking.checkAuth("FundPayOrder_ApprovalOrder")) {
          count += res.data.fundPayOrderPendingCount;
        }
        if (this.$thinking.checkAuth("CommodityLossOrder_ApprovalOrder")) {
          count += res.data.commodityLossOrderPendingCount;
        }
        this.agencyList[0].count = count;
      }
    },
    // 获取商品出入库数量
    async getCommodityInOutQuantity(args) {
      let res = await dynamicKanbanGetCommodityInOutQuantity(args);
      if (res && res.success) {
        let count = 0;
        if (
          this.$thinking.checkAuth("CommodityOutputOrder_DistributeDelivery")
        ) {
          count += res.data.unassignedOutputOrderCount;
        }
        if (this.$thinking.checkAuth("CommodityInputOutputOrder_Delivery")) {
          count += res.data.notStartOutputOrderCount;
          count += res.data.deliveringOutputOrderCount;
          count += res.data.notStartInputOrderCount;
          count += res.data.deliveringInputOrderCount;
        }
        if (this.$thinking.checkAuth("CommodityOutputOrder_ConfirmDelivery")) {
          count += res.data.confirmingOutputOrderCount;
        }
        if (this.$thinking.checkAuth("CommodityInputOrder_ConfirmDelivery")) {
          count += res.data.confirmingInputOrderCount;
        }
        this.agencyList[1].count = count;
      }
    },
    // 获取待处理客户跟进数量异常
    async getFollowUpCount(args) {
      let res = await dynamicKanbanGetFollowUpCount(args);
      if (res && res.success) {
        this.agencyList[2].count =
          res.data.timedOutCount + res.data.unReceivedRemindCount;
      }
      this.isSuceess = true;
    },
    // 获取库存预警的商品数量
    async getCommoditySpecQuantityWarningCount(args) {
      let res = await dynamicKanbanGetCommoditySpecQuantityWarningCount(args);
      if (res && res.success) {
        this.agencyList[3].count = res.data.commoditySpecCount;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: #fafafa;
  .card {
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #4a4a4a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    //   最近使用
    .cont {
      display: flex;
      justify-content: space-around;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4a4a4a;
      text-align: center;
    }

    .agency {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 25%;
      border-right: 1px solid #cccccc;

      .descriptions {
        display: flex;
        flex-direction: column;
        margin-left: 25px;

        .num {
          font-family: PingFangSC-Semibold;
          font-size: 34px;
          color: #378df5;
        }

        .desc {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4a4a4a;
        }
      }

      &:last-child {
        border: none;
        padding-left: 0;
      }
    }

    //
  }
}
</style>
