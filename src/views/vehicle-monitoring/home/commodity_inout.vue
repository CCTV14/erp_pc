<template>
  <div class="main">
    <!-- 点击跳转到详情暂时还没加 -->
    <p class="title">出库</p>
    <el-row :gutter="20">
      <el-col
        :span="12"
        :offset="0"
        v-for="(item, index) in params.data.slice(0, 4)"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.title }}</span>
          </div>
          <div class="cont">
            <div>
              <p>单据数量</p>
              <span class="num">{{ item.orderCount }}</span>
            </div>
            <div>
              <p>商品数量</p>
              <span class="num">{{ item.commodityCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <p class="title">入库</p>
    <el-row :gutter="20">
      <el-col
        :span="12"
        :offset="0"
        v-for="(item, index) in params.data.slice(4, 7)"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.title }}</span>
          </div>
          <div class="cont">
            <div>
              <p>单据数量</p>
              <span class="num">{{ item.orderCount }}</span>
            </div>
            <div>
              <p>商品数量</p>
              <span class="num">{{ item.commodityCount }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dynamicKanbanGetCommodityInOutQuantity } from "@/api/vehicle-monitoring";
export default {
  data() {
    return {
      params: {
        data: [],
      },
    };
  },
  mounted() {
    this.getInOutInfo();
  },
  methods: {
    getInOutInfo() {
      dynamicKanbanGetCommodityInOutQuantity({}).then((res) => {
        if (res && res.success) {
          var data = [
            {
              title: "未分配配送员",
              show: this.$thinking.checkAuth(
                "CommodityOutputOrder_DistributeDelivery"
              ),
              onlyUnassignedOrder: true,
              orderCount: res.data.unassignedOutputOrderCount,
              commodityCount: res.data.unassignedOutputQuantity,
            },
            {
              title: "已分配未配送",
              show: this.$thinking.checkAuth(
                "CommodityInputOutputOrder_Delivery"
              ),
              onlyNotStartOrder: true,
              orderCount: res.data.notStartOutputOrderCount,
              commodityCount: res.data.notStartOutputQuantity,
            },
            {
              title: "配送中",
              show: this.$thinking.checkAuth(
                "CommodityInputOutputOrder_Delivery"
              ),
              onlyDeliveringOrder: true,
              orderCount: res.data.deliveringOutputOrderCount,
              commodityCount: res.data.deliveringOutputQuantity,
            },
            {
              title: "配送完成待确认",
              show: this.$thinking.checkAuth(
                "CommodityOutputOrder_ConfirmDelivery"
              ),
              onlyConfirmingOrder: true,
              orderCount: res.data.confirmingOutputOrderCount,
              commodityCount: res.data.confirmingOutputQuantity,
            },
            {
              title: "待配送",
              show: this.$thinking.checkAuth(
                "CommodityInputOutputOrder_Delivery"
              ),
              onlyNotStartOrder: true,
              orderCount: res.data.notStartInputOrderCount,
              commodityCount: res.data.notStartInputQuantity,
            },
            {
              title: "配送中",
              show: this.$thinking.checkAuth(
                "CommodityInputOutputOrder_Delivery"
              ),
              onlyDeliveringOrder: true,
              orderCount: res.data.deliveringInputOrderCount,
              commodityCount: res.data.deliveringInputQuantity,
            },
            {
              title: "配送完成待确认",
              show: this.$thinking.checkAuth(
                "CommodityInputOrder_ConfirmDelivery"
              ),
              onlyConfirmingOrder: true,
              orderCount: res.data.confirmingInputOrderCount,
              commodityCount: res.data.confirmingInputQuantity,
            },
            {
              hidden: true,
            },
          ];
          this.params.data = data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  .title {
    font-size: 20px;
  }
  .box-card {
    margin-bottom: 20px;
    .clearfix {
      font-size: 18px;
    }
    .cont {
      display: flex;
      justify-content: space-around;
      text-align: center;
      p {
        font-size: 18px;
      }
      .num {
        font-size: 18px;
        color: #3c9cff;
        text-align: center;
        font-weight: bold;
      }
      // div{
      //   t
      // }
    }
  }
}
</style>
