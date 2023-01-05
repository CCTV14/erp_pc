<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="销售单详情">
        <el-descriptions-item label="单号"
          ><span :style="$thinking.getCheckType(head.orderApprovalStatusEnum.Name)"
            >{{ head.orderApprovalStatusEnum.Desc }} </span
          ><span class="ml5">{{ head.orderNo }}</span></el-descriptions-item
        >
        <el-descriptions-item label="客户">{{
          (head.customer.customerNo || "") + " " + (head.customer.name || "")
        }}</el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{
          head.customerPhoneNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="客户电话">{{
          head.customerPhoneNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="客户地址">{{
          head.customerAddress
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 商品列表 -->
    <div class="commodity_list mb15">
      <el-descriptions title="所选商品">
        <el-descriptions-item
          label=""
          :labelStyle="{ display: 'none' }"
          :contentStyle="{ width: '100%' }"
        >
          <el-table :data="detailForm.itemList" stripe v-loading="loading">
            <el-table-column
              prop="snapshot.commodity.name"
              label="商品名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="snapshot.commodity.color"
              label="颜色"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="snapshot.commoditySpec.specName"
              label="规格"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" align="center">
              <template slot-scope="scope">
                <ImagePreview
                  height="60px"
                  width="65px"
                  :src="scope.row.snapshot.commodity.imageNameList[0]"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="snapshot.commoditySpec.buyingPrice"
              label="单价"
              align="center"
            >
              <template slot-scope="scope">
                ￥{{ scope.row.commoditySpec.buyingPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="buyNum" label="购买数量" align="center">
              <template slot-scope="{ row }">
                {{ row.itemQuantity + " " + row.snapshot.commodity.unit }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commodityBuyingTotalAmount"
              label="总零售价"
              align="center"
            >
              <template slot-scope="scope">
                ￥{{ scope.row.commodityBuyingTotalAmount }}
              </template>
            </el-table-column>
            <el-table-column prop="itemAmount" label="成交价" align="center">
              <template slot-scope="scope">
                ￥{{ scope.row.itemAmount }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 详细信息 -->
    <div class="description mb20">
      <el-descriptions title="">
        <el-descriptions-item label="单据金额"
          ><span class="text-primary"
            >￥{{ head.orderAmount }}</span
          ></el-descriptions-item
        >
        <el-descriptions-item label="总零售价"
          >￥{{ head.commodityBuyingTotalAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="折扣金额"
          >￥{{ head.disCountAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="收款进度">{{
          head.fundCollectProgressEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="待收金额"
          >￥{{ head.toBeCollectAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="收款中金额"
          >￥{{ head.collectingAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="已收金额"
          >￥{{ head.completedCollectAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="收款优惠金额"
          >￥{{ head.collectDisCountAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="退款中金额"
          >￥{{ head.returningAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="已退款金额"
          >￥{{ head.completedReturnAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="全部收款时间" :span="2">{{
          head.fullCollectTime || "暂无"
        }}</el-descriptions-item>
        <el-descriptions-item label="出库进度">{{
          "(共 " +
          (head.totalQuantity || 0) +
          " 件 , " +
          (head.commodityOutputProgressEnum.Desc || "") +
          ")"
        }}</el-descriptions-item>
        <el-descriptions-item label="待出库数量">{{
          head.toBeOutputQuantity || 0
        }}</el-descriptions-item>
        <el-descriptions-item label="出库中数量">{{
          head.outputingQuantity || 0
        }}</el-descriptions-item>
        <el-descriptions-item label="已出库数量">{{
          head.completedOutputQuantity || 0
        }}</el-descriptions-item>
        <el-descriptions-item label="退货中数量">{{
          head.returningQuantity || 0
        }}</el-descriptions-item>
        <el-descriptions-item label="已退货数量">{{
          head.completedReturnQuantity || 0
        }}</el-descriptions-item>
        <el-descriptions-item label="全部出库时间" :span="3">{{
          head.fullOutputTime || "暂无"
        }}</el-descriptions-item>
        <el-descriptions-item label="业务员" :span="3">{{
          saleUserNameList
        }}</el-descriptions-item>
        <el-descriptions-item label="制单人">{{
          head.creator.name
        }}</el-descriptions-item>
        <el-descriptions-item label="制单时间" :span="2">{{
          head.createTime || "暂无"
        }}</el-descriptions-item>
        <el-descriptions-item label="提交人">{{
          head.submitUser.name
        }}</el-descriptions-item>
        <el-descriptions-item label="提交时间" :span="2">{{
          head.submitTime || "暂无"
        }}</el-descriptions-item>
        <el-descriptions-item label="审批人">{{
          head.handleUser.name
        }}</el-descriptions-item>
        <el-descriptions-item label="审批意见">{{
          head.handleMessage
        }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{
          head.handleTime
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import { getSaleOrderDetailById } from "@/api/vehicle-monitoring/order";
export default {
  data() {
    return {
      loading: true,
      detailForm: {
        head: {
          orderApprovalStatusEnum: {},
          customer: {},
          fundCollectProgressEnum: {},
        },
      },
    };
  },
  mounted() {
    this.loading = false;
    this.getDetail();
  },
  computed: {
    head() {
      return this.detailForm.head;
    },
    saleUserNameList() {
      if (
        this.detailForm.head.saleUserList &&
        this.detailForm.head.saleUserList.length > 0
      ) {
        return this.detailForm.head.saleUserList
          .map((item) => {
            return item.user.name;
          })
          .join("、");
      }
    },
  },
  methods: {
    getDetail() {
      getSaleOrderDetailById({ id: this.$route.query.orderId }).then((res) => {
        this.detailForm = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: #fafafa;

  .head,
  .commodity_list,
  .description {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>
