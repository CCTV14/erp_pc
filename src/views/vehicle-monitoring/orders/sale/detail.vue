<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="销售单详情">
        <el-descriptions-item label="单号">
          <span>{{ head.orderNo }}</span>
          <span
            class="ml10"
            :style="$thinking.getCheckType(head.orderApprovalStatusEnum.Name)"
            >{{ head.orderApprovalStatusEnum.Desc }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="单据日期">{{
          head.orderDate
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 商品列表 -->
    <div class="commodity_list mb15" v-if="commodity.name">
      <el-descriptions title="所选商品">
        <el-descriptions-item
          label=""
          :labelStyle="{ display: 'none' }"
          :contentStyle="{ width: '100%' }"
        >
          <el-table :data="detailForm.itemList" stripe v-loading="loading">
            <el-table-column
              prop="commodity.name"
              label="商品名称"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="commodity.color" label="颜色" align="center">
            </el-table-column>
            <el-table-column
              prop="commoditySpec.specName"
              label="规格"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" align="center">
              <template slot-scope="scope">
                <ImagePreview
                  height="60px"
                  width="65px"
                  :src="scope.row.commodity.imageNameList[0]"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="commoditySpec.buyingPrice"
              label="单价"
              align="center"
            >
              <template slot-scope="scope">
                ￥{{ scope.row.commoditySpec.buyingPrice | priceFixedTwo }}
              </template>
            </el-table-column>
            <el-table-column prop="buyNum" label="购买数量" align="center">
              <template slot-scope="{ row }">
                {{ row.itemQuantity + " " + row.commodity.unit }}
              </template>
            </el-table-column>
            <el-table-column
              prop="commodityBuyingTotalAmount"
              label="总零售价"
              align="center"
            >
              <template slot-scope="scope">
                ￥{{ scope.row.commodityBuyingTotalAmount | priceFixedTwo }}
              </template>
            </el-table-column>
            <el-table-column prop="itemAmount" label="成交价" align="center">
              <template slot-scope="scope">
                ￥{{ scope.row.itemAmount | priceFixedTwo }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleSee(scope.row, scope.$index)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>商品信息</span>
          </div>
          <el-descriptions title="" :column="1">
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
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>客户信息</span>
            <span style="float: right"
              >客户编号：{{ head.customer.customerNo }}</span
            >
          </div>
          <el-descriptions title="" :column="2">
            <el-descriptions-item label="客户姓名">{{
              head.customer.name || ""
            }}</el-descriptions-item>
            <el-descriptions-item label="客户电话">{{
              head.customerPhoneNumber
            }}</el-descriptions-item>
            <el-descriptions-item label="客户地址">{{
              head.customerAddress
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>业务员:{{ head.saleUserList.length }}人</span>
          </div>
          {{ saleUserNameList }}
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>金额信息</span>
          </div>
          <el-descriptions title="" :column="2">
            <el-descriptions-item label="单据金额"
              ><span class="text-primary"
                >￥{{ head.orderAmount | priceFixedTwo }}</span
              ></el-descriptions-item
            >
            <el-descriptions-item label="总零售价"
              >￥{{
                head.commodityBuyingTotalAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="折扣金额"
              >￥{{ head.disCountAmount | priceFixedTwo }}</el-descriptions-item
            >
            <el-descriptions-item label="收款进度">{{
              head.fundCollectProgressEnum.Desc
            }}</el-descriptions-item>
            <el-descriptions-item label="待收金额"
              >￥{{
                head.toBeCollectAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="收款中金额"
              >￥{{
                head.collectingAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="已收金额"
              >￥{{
                head.completedCollectAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="收款优惠金额"
              >￥{{
                head.collectDisCountAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="退款中金额"
              >￥{{
                head.returningAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="已退款金额"
              >￥{{
                head.completedReturnAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="全部收款时间" :span="2">{{
              head.fullCollectTime || "暂无"
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>关联预收单信息</span>
            <span
              style="float: right"
              v-if="
                head.relatedPreCollectOrderList &&
                head.relatedPreCollectOrderList.length > 0
              "
            >
              共{{ head.relatedPreCollectOrderList.length }}个 预收金额{{
                getPreCollectAmount | priceFixedTwo
              }}
            </span>
          </div>
          <div
            v-if="
              !head.relatedPreCollectOrderList ||
              head.relatedPreCollectOrderList.length === 0
            "
          >
            暂无预收单信息
          </div>
          <div
            v-else-if="
              head.relatedPreCollectOrderList &&
              head.relatedPreCollectOrderList.length > 0
            "
          >
            <el-descriptions title="" :column="2">
              <el-descriptions-item label="审批状态">
                <span
                  :style="
                    $thinking.getCheckType(
                      relatedPreCollectOrderListComputed.orderApprovalStatusEnum
                        .Name
                    )
                  "
                  >{{
                    relatedPreCollectOrderListComputed.orderApprovalStatusEnum
                      .Desc
                  }}</span
                >
              </el-descriptions-item>
              <el-descriptions-item label="单号">
                {{ relatedPreCollectOrderListComputed.orderNo }}
              </el-descriptions-item>
              <el-descriptions-item label="使用状态">
                {{
                  relatedPreCollectOrderListComputed.relatedSaleOrderHeadId
                    ? relatedPreCollectOrderListComputed.orderNo || "草稿销售单"
                    : "未使用"
                }}
              </el-descriptions-item>
              <el-descriptions-item label="客户编号">
                {{ relatedPreCollectOrderListComputed.customer.customerNo }}
              </el-descriptions-item>
              <el-descriptions-item label="客户姓名">
                {{ relatedPreCollectOrderListComputed.customerName }}
              </el-descriptions-item>
              <el-descriptions-item label="客户电话">
                {{ relatedPreCollectOrderListComputed.customerPhoneNumber }}
              </el-descriptions-item>
              <el-descriptions-item label="客户地址" :span="3">
                {{ relatedPreCollectOrderListComputed.customerAddress }}
              </el-descriptions-item>
              <el-descriptions-item label="单据金额" :span="2">
                ￥{{
                  relatedPreCollectOrderListComputed.orderAmount
                    | thousandSymbol
                }}
              </el-descriptions-item>
              <el-descriptions-item label="制单信息">
                {{ relatedPreCollectOrderListComputed.creator.name }}
                {{ relatedPreCollectOrderListComputed.createTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>审批信息</span>
          </div>
          <OrderStep :orderInfo="detailForm.head" />
        </el-card>
      </el-col>
    </el-row>
    <!--  -->
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      title="商品详情"
      :visible.sync="detailVisble"
      width="500px"
      append-to-body
    >
      <div class="info mb20">
        <ImagePreview
          height="80px"
          width="80px"
          :src="commodity.imageNameList[0]"
        />
        <div class="ml20">
          <div class="mb5">商品名称：{{ commodity.name }}</div>
          <div class="mb5">颜色：{{ commodity.color }}</div>
          <div class="mb5">规格：{{ commoditySpec.specName }}</div>
        </div>
      </div>
      <el-descriptions title="信息" :column="1">
        <el-descriptions-item label="单位">
          {{ commodity.unit }}</el-descriptions-item
        >
        <el-descriptions-item label="零售价"
          >￥{{
            commoditySpec.buyingPrice | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="购买数量">
          {{ currentRow.itemQuantity }}</el-descriptions-item
        >
        <el-descriptions-item label="总零售价">
          ￥{{
            currentRow.commodityBuyingTotalAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="折扣金额">
          ￥
          {{ currentRow.disCountAmount | priceFixedTwo }}</el-descriptions-item
        >
        <el-descriptions-item label="成交价">
          ￥{{ currentRow.itemAmount | priceFixedTwo }}</el-descriptions-item
        >
        <el-descriptions-item label="出库进度">
          <span class="mr10">待出库 {{ currentRow.toBeOutputQuantity }}</span>
          <span class="mr10">出库中 {{ currentRow.outputingQuantity }}</span>
          <span class="mr10"
            >已出库 {{ currentRow.completedOutputQuantity }}</span
          >
          <span class="mr10">退货中 {{ currentRow.returningQuantity }}</span>
          <span>已退货 {{ currentRow.completedReturnQuantity }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSaleOrderDetailById } from "@/api/vehicle-monitoring/order";
export default {
  data() {
    return {
      mode: "view",
      currentIndex: 0,
      currentRow: {
        commodity: {
          imageNameList: [],
        },
        commoditySpec: {},
      },
      loading: true,
      detailVisble: false,
      detailForm: {
        head: {
          saleUserList: [],
          orderApprovalStatusEnum: {},
          customer: {},
          fundCollectProgressEnum: {},
          commodityOutputProgressEnum: {},
          creator: {},
          submitUser: {},
          handleUser: {},
        },
        itemList: [
          {
            commodity: {
              imageNameList: [""],
            },
            snapshot: {
              commodity: {
                imageNameList: [""],
              },
              commoditySpec: {},
            },
            commoditySpec: {},
          },
        ],
      },
    };
  },
  computed: {
    canEdit() {
      return this.mode === "addNew" || this.mode === "update";
    },
    commodity() {
      return this.canEdit
        ? this.detailForm.itemList[this.currentIndex].commodity
        : this.detailForm.itemList[this.currentIndex].snapshot.commodity;
    },
    commoditySpec() {
      return this.canEdit
        ? this.detailForm.itemList[this.currentIndex].commoditySpec
        : this.detailForm.itemList[this.currentIndex].snapshot.commoditySpec;
    },
    relatedPreCollectOrderListComputed() {
      console.log(this.detailForm.head);
      return this.detailForm.head.relatedPreCollectOrderList[0].preCollectOrder;
    },
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
    getPreCollectAmount() {
      if (
        this.detailForm.head.relatedPreCollectOrderList &&
        this.detailForm.head.relatedPreCollectOrderList.length > 0
      ) {
        let res = 0;
        this.detailForm.head.relatedPreCollectOrderList.forEach((item) => {
          res += item.preCollectOrder.orderAmount;
        });
        return res;
      }
    },
  },
  mounted() {
    this.loading = false;
    this.mode = this.$route.query.mode;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getSaleOrderDetailById({ id: this.$route.query.orderId }).then((res) => {
        this.detailForm = res.data;
      });
    },
    // 点击查看
    handleSee(row, index) {
      console.log(index);
      this.currentRow = row;
      this.currentIndex = index;
      this.detailVisble = true;
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
  .head {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
.info {
  display: flex;
  align-items: center;
}
</style>
