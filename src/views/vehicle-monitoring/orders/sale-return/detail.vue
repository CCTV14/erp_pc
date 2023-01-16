<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="销售退货单详情">
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
        <el-descriptions-item label="业务员">{{
          saleUserNameList
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
              prop="relatedSaleOrderItem.commodity.name"
              label="商品名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="relatedSaleOrderItem.commodity.color"
              label="颜色"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="relatedSaleOrderItem.commoditySpec.specName"
              label="规格"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" align="center">
              <template slot-scope="scope">
                <ImagePreview
                  height="60px"
                  width="65px"
                  :src="
                    scope.row.relatedSaleOrderItem.commodity.imageNameList[0]
                  "
                />
              </template>
            </el-table-column>
            <el-table-column prop="buyNum" label="退货数量" align="center">
              <template slot-scope="{ row }">
                {{
                  row.itemQuantity +
                  " " +
                  row.relatedSaleOrderItem.commodity.unit
                }}
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
      </el-col>
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
            <el-descriptions-item label="付款进度">{{
              head.fundPayProgressEnum.Desc
            }}</el-descriptions-item>
            <el-descriptions-item label="待付金额"
              >￥{{ head.toBePayAmount | priceFixedTwo }}</el-descriptions-item
            >
            <el-descriptions-item label="付款中金额"
              >￥{{ head.payingAmount | priceFixedTwo }}</el-descriptions-item
            >
            <el-descriptions-item label="已付金额"
              >￥{{
                head.completedPayAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="付款优惠金额"
              >￥{{
                head.payDisCountAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="全部付款时间" :span="2">{{
              head.fullPayTime || "暂无"
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>入库信息</span>
          </div>
          <el-descriptions title="" :column="2">
            <el-descriptions-item label="入库进度"
              ><span class="text-primary">{{
                head.commodityInputProgressEnum.Desc
              }}</span></el-descriptions-item
            >
            <el-descriptions-item label="待入库数量">
              {{ head.toBeInputQuantity || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="入库中数量">
              {{ head.inputingQuantity || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="已入库数量">
              {{ head.completedInputQuantity || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="全部入库时间">
              {{ head.fullInputTime || "暂无" }}
            </el-descriptions-item>
            <el-descriptions-item label="是否发货">
              {{ head.shippedMark ? "已发货" : "未发货" }}
            </el-descriptions-item>
            <el-descriptions-item label="是否收款">
              {{ head.collectedMark ? "已收款" : "未收款" }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card pointer">
          <div slot="header" class="clearfix" @click="toOrderDetail">
            <span>关联销售单信息</span>
            <span style="float: right">{{
              head.relatedSaleOrderHead.orderNo
            }}</span>
          </div>
          <div @click="toOrderDetail">
            <el-descriptions title="" :column="3">
              <el-descriptions-item label="审批状态">
                <span
                  :style="
                    $thinking.getCheckType(
                      head.relatedSaleOrderHead.orderApprovalStatusEnum.Name
                    )
                  "
                  >{{
                    head.relatedSaleOrderHead.orderApprovalStatusEnum.Desc
                  }}</span
                >
              </el-descriptions-item>
              <el-descriptions-item label="收款状态">
                {{ head.relatedSaleOrderHead.fundCollectProgressEnum.Desc }}
              </el-descriptions-item>
              <el-descriptions-item label="出库状态">
                {{ head.relatedSaleOrderHead.commodityOutputProgressEnum.Desc }}
              </el-descriptions-item>
              <el-descriptions-item label="客户编号">
                {{ head.relatedSaleOrderHead.customer.customerNo }}
              </el-descriptions-item>
              <el-descriptions-item label="客户姓名">
                {{ head.relatedSaleOrderHead.customerName }}
              </el-descriptions-item>
              <el-descriptions-item label="客户电话">
                {{ head.relatedSaleOrderHead.customerPhoneNumber }}
              </el-descriptions-item>
              <el-descriptions-item label="客户地址" :span="3">
                {{ head.relatedSaleOrderHead.customerAddress }}
              </el-descriptions-item>
              <el-descriptions-item label="单据金额">
                ￥{{ head.relatedSaleOrderHead.orderAmount | priceFixedTwo }}
              </el-descriptions-item>
              <el-descriptions-item label="制单信息">
                {{ head.relatedSaleOrderHead.creator.name }}
                {{ head.relatedSaleOrderHead.createTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt10">
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
        <el-descriptions-item label="退货数量">
          {{ currentRow.itemQuantity }}</el-descriptions-item
        >
        <el-descriptions-item label="总零售价">
          ￥{{
            currentRow.commodityBuyingTotalAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="入库进度">
          <span class="mr10"
            >待入库 {{ currentRow.completedInputQuantity }}</span
          >
          <span class="mr10">入库中 {{ currentRow.inputingQuantity }}</span>
          <span class="mr10">已入库 {{ currentRow.toBeInputQuantity }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSaleReturnOrderDetailById } from "@/api/vehicle-monitoring/order";
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
          customer: {},
          fundPayProgressEnum: {
            Desc: "",
          },
          submitUser: {},
          relatedSaleOrderHead: {
            orderApprovalStatusEnum: {},
            fundCollectProgressEnum: {},
            customer: {},
            commodityOutputProgressEnum: {},
            creator: {},
          },
          orderApprovalStatusEnum: {
            Desc: "",
            Name: "",
          },
          commodityInputProgressEnum: {},
          creator: {},
        },
        itemList: [
          {
            relatedSaleOrderItem: {
              commodity: {
                imageNameList: [""],
              },
              snapshot: {
                commodity: {
                  imageNameList: [""],
                },
              },
            },
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
      return {
        ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
          .commodity,
        ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
          .snapshot.commodity,
      };
    },
    commoditySpec() {
      return {
        ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
          .commoditySpec,
        ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
          .snapshot.commoditySpec,
      };
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
  },
  mounted() {
    this.loading = false;
    this.mode = this.$route.query.mode;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getSaleReturnOrderDetailById({ id: this.$route.query.orderId }).then(
        (res) => {
          this.detailForm = res.data;
        }
      );
    },
    // 点击查看
    handleSee(row, index) {
      console.log(index);
      this.currentRow = row;
      this.currentIndex = index;
      this.detailVisble = true;
    },
    // 跳转详情
    toOrderDetail() {
      this.$router.push({
        path: "sale-detail",
        query: {
          orderId: this.head.relatedSaleOrderHead.id,
          mode: "view",
        },
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
  .head {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
.info {
  display: flex;
  align-items: center;
}
</style>
