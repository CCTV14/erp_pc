<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="入库单详情">
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
        <el-descriptions-item label="入库类型">{{
          head.commodityInputOrderTypeEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="供应商" v-if="!isSaleReturnOrderInput">{{
          head.customerSupplierName
        }}</el-descriptions-item>
        <el-descriptions-item label="是否配送" v-if="isSaleReturnOrderInput">{{
          head.needDelivery ? "需要配送" : "无需配送"
        }}</el-descriptions-item>
        <el-descriptions-item label="入库说明">{{
          head.remark
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
            <el-table-column label="商品名称" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderInput">{{
                  row.relatedSaleReturnOrderItem.relatedSaleOrderItem.commodity
                    .name
                }}</span>
                <span v-else>{{
                  row.relatedPurchaseOrderItem.commodity.name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="颜色" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderInput">{{
                  row.relatedSaleReturnOrderItem.relatedSaleOrderItem.commodity
                    .color
                }}</span>
                <span v-else>{{
                  row.relatedPurchaseOrderItem.commodity.color
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderInput">{{
                  row.relatedSaleReturnOrderItem.relatedSaleOrderItem
                    .commoditySpec.specName
                }}</span>
                <span v-else>{{
                  row.relatedPurchaseOrderItem.commoditySpec.specName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" align="center">
              <template slot-scope="scope">
                <ImagePreview
                  height="60px"
                  width="65px"
                  :src="
                    isSaleReturnOrderInput
                      ? scope.row.relatedSaleReturnOrderItem
                          .relatedSaleOrderItem.commodity.imageNameList[0]
                      : scope.row.relatedPurchaseOrderItem.commodity
                          .imageNameList[0]
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderInput"
                  >￥{{
                    row.relatedSaleReturnOrderItem.relatedSaleOrderItem
                      .commoditySpec.buyingPrice | priceFixedTwo
                  }}</span
                >
                <span v-else
                  >￥{{
                    row.relatedPurchaseOrderItem.commoditySpec.buyingPrice
                      | priceFixedTwo
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="入库数量" align="center">
              <template slot-scope="{ row }">
                {{ row.itemQuantity }}
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
      <el-col :span="24" v-if="isSaleReturnOrderInput">
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
              head.customerSupplierPhoneNumber
            }}</el-descriptions-item>
            <el-descriptions-item label="客户地址">{{
              head.customerSupplierAddress
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
      <el-col :span="12">
        <el-card class="box-card pointer">
          <div slot="header" class="clearfix" @click="toOrderDetail">
            <span v-if="isSaleReturnOrderInput">关联销售退货单信息</span>
            <span v-if="!isSaleReturnOrderInput">关联采购单信息</span>
            <span style="float: right">{{
              isSaleReturnOrderInput
                ? head.relatedSaleReturnOrderHead.orderNo
                : head.relatedPurchaseOrderHead.orderNo
            }}</span>
          </div>
          <!-- 采购单 -->
          <div v-if="!isSaleReturnOrderInput" @click="toOrderDetail">
            <el-descriptions title="" :column="2">
              <el-descriptions-item label="审批状态">
                <span
                  :style="
                    $thinking.getCheckType(
                      head.relatedPurchaseOrderHead.orderApprovalStatusEnum.Name
                    )
                  "
                  >{{
                    head.relatedPurchaseOrderHead.orderApprovalStatusEnum.Desc
                  }}</span
                >
              </el-descriptions-item>
              <el-descriptions-item label="付款状态">
                {{ head.relatedPurchaseOrderHead.fundPayProgressEnum.Desc }}
              </el-descriptions-item>
              <el-descriptions-item label="入库状态">
                {{
                  head.relatedPurchaseOrderHead.commodityInputProgressEnum.Desc
                }}
              </el-descriptions-item>
              <el-descriptions-item label="供应商">
                {{ head.relatedPurchaseOrderHead.supplier.name }}
              </el-descriptions-item>
              <el-descriptions-item label="单据金额" :span="2">
                ￥{{
                  head.relatedPurchaseOrderHead.orderAmount | thousandSymbol
                }}
              </el-descriptions-item>
              <el-descriptions-item label="制单信息">
                {{ head.creator.name }} {{ head.createTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!-- 销售退货单出库 -->
          <div v-else @click="toOrderDetail">
            <el-descriptions title="" :column="2">
              <el-descriptions-item label="审批状态">
                <span
                  :style="
                    $thinking.getCheckType(
                      head.relatedSaleReturnOrderHead.orderApprovalStatusEnum
                        .Name
                    )
                  "
                  >{{
                    head.relatedSaleReturnOrderHead.orderApprovalStatusEnum.Desc
                  }}</span
                >
              </el-descriptions-item>
              <el-descriptions-item label="付款状态">
                {{ head.relatedSaleReturnOrderHead.fundPayProgressEnum.Desc }}
              </el-descriptions-item>
              <el-descriptions-item label="入库状态">
                {{
                  head.relatedSaleReturnOrderHead.commodityInputProgressEnum
                    .Desc
                }}
              </el-descriptions-item>
              <el-descriptions-item label="客户编号">
                {{ head.relatedSaleReturnOrderHead.customer.customerNo }}
              </el-descriptions-item>
              <el-descriptions-item label="客户姓名">
                {{ head.relatedSaleReturnOrderHead.customerName }}
              </el-descriptions-item>
              <el-descriptions-item label="客户电话">
                {{ head.relatedSaleReturnOrderHead.customerPhoneNumber }}
              </el-descriptions-item>
              <el-descriptions-item label="客户地址" :span="3">
                {{ head.relatedSaleReturnOrderHead.customerAddress }}
              </el-descriptions-item>
              <el-descriptions-item label="单据金额" :span="2">
                ￥{{
                  head.relatedSaleReturnOrderHead.orderAmount | thousandSymbol
                }}
              </el-descriptions-item>
              <el-descriptions-item label="制单信息">
                {{ head.relatedSaleReturnOrderHead.creator.name }}
                {{ head.relatedSaleReturnOrderHead.createTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>纸质单据</span>
          </div>
          <ImagePreview
            height="80px"
            width="80px"
            v-for="(item, index) in head.paperImageNameList"
            :key="index"
            order="inpaper"
            :src="item"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
      <el-col :span="24" v-if="isSaleReturnOrderInput && head.needDelivery">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>配送信息</span>
          </div>
          <el-descriptions title="" :column="3">
            <el-descriptions-item label="配送状态">{{
              head.commodityDeliverStatusEnum.Desc || ""
            }}</el-descriptions-item>
            <el-descriptions-item label="配送员">{{
              deliveryUserNameList
            }}</el-descriptions-item>
            <el-descriptions-item label="完成配送时间">{{
              head.completeDeliverTime || "暂无"
            }}</el-descriptions-item>
          </el-descriptions>
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
        <el-descriptions-item label="当前库存">
          <div>
            <div class="mb5">
              可用 {{ commoditySpec.availableQuantity }} , 虚拟
              {{ commoditySpec.fictitiousQuantity }}
            </div>
            <div class="mb5">
              待入 {{ commoditySpec.toBeInputQuantity }} , 入库中
              {{ commoditySpec.inputingQuantity }}
            </div>
            <div class="mb5">
              待出 {{ commoditySpec.toBeOutputQuantity }} , 出库中
              {{ commoditySpec.outputingQuantity }}
            </div>
            <div>
              报损中 {{ commoditySpec.lossingQuantity }} , 已报损
              {{ commoditySpec.completedLossQuantity }}
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="单位">
          {{ commodity.unit }}</el-descriptions-item
        >
        <el-descriptions-item label="关联单据行项目入库进度">
          <span class="mr5"
            >待入库 {{ relatedOrderItem.toBeInputQuantity }}</span
          >
          <span class="mr5"
            >入库中 {{ relatedOrderItem.inputingQuantity }}</span
          >
          <span>已入库 {{ relatedOrderItem.completedInputQuantity }} </span>
        </el-descriptions-item>
        <el-descriptions-item label="入库数量">
          {{ relatedOrderItem.itemQuantity }}</el-descriptions-item
        >
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getInOrderDetailById } from "@/api/vehicle-monitoring/order";
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
          relatedPurchaseOrderHead: {
            fundPayProgressEnum: {},
            commodityInputProgressEnum: {},
            supplier: {},
            orderApprovalStatusEnum: {},
          },
          orderApprovalStatusEnum: {},
          customer: {},
          fundCollectProgressEnum: {},
          commodityInputProgressEnum: {},
          commodityInputOrderTypeEnum: {},
          creator: {},
          submitUser: {},
          handleUser: {},
        },
        itemList: [
          {
            relatedPurchaseOrderItem: {
              snapshot: {
                commodity: {
                  imageNameList: [""],
                },
                commoditySpec: {},
              },
              commodity: {
                imageNameList: [""],
              },
              commoditySpec: {},
            },
            relatedSaleReturnOrderItem: {
              relatedSaleOrderItem: {
                snapshot: {
                  commodity: {
                    imageNameList: [""],
                  },
                  commoditySpec: {},
                },
                commodity: {
                  imageNameList: [""],
                },
                commoditySpec: {},
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
      return this.isSaleReturnOrderInput
        ? {
            ...this.detailForm.itemList[this.currentIndex]
              .relatedSaleReturnOrderItem.relatedSaleOrderItem.snapshot
              .commodity,
            ...this.detailForm.itemList[this.currentIndex]
              .relatedSaleReturnOrderItem.relatedSaleOrderItem.commodity,
          }
        : {
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseOrderItem.snapshot.commodity,
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseOrderItem.commodity,
          };
    },
    commoditySpec() {
      return this.isSaleReturnOrderInput
        ? {
            ...this.detailForm.itemList[this.currentIndex]
              .relatedSaleReturnOrderItem.relatedSaleOrderItem.snapshot
              .commoditySpec,
            ...this.detailForm.itemList[this.currentIndex]
              .relatedSaleReturnOrderItem.relatedSaleOrderItem.commoditySpec,
          }
        : {
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseOrderItem.snapshot.commoditySpec,
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseOrderItem.commoditySpec,
          };
    },
    // 是否是销售退货单入库
    isSaleReturnOrderInput() {
      return (
        this.detailForm.head.commodityInputOrderTypeEnum.Name ===
        "SaleReturnOrder"
      );
    },
    deliveryUserNameList() {
      if (
        this.detailForm.head.deliveryUserList &&
        this.detailForm.head.deliveryUserList.length > 0
      ) {
        return this.detailForm.head.deliveryUserList
          .map((item) => {
            return item.user.name;
          })
          .join("、");
      }
    },
    relatedOrderItem() {
      return this.isSaleReturnOrderInput
        ? this.detailForm.itemList[this.currentIndex].relatedSaleReturnOrderItem
        : this.detailForm.itemList[this.currentIndex].relatedPurchaseOrderItem;
    },
    head() {
      return this.detailForm.head;
    },
  },
  mounted() {
    this.loading = false;
    this.mode = this.$route.query.mode;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getInOrderDetailById({ id: this.$route.query.orderId }).then((res) => {
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
    // 跳转详情
    toOrderDetail() {
      let path = this.isSaleReturnOrderInput
        ? "salereturn-detail"
        : "purchase-detail";
      let id = this.isSaleReturnOrderInput
        ? this.head.relatedSaleReturnOrderHead.id
        : this.head.relatedPurchaseOrderHead.id;
      this.$router.push({
        path: path,
        query: {
          orderId: id,
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
