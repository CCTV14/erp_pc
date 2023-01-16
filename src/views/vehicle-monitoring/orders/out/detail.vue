<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="出库单详情" :column="4">
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
        <el-descriptions-item label="出库类型">{{
          head.commodityOutputOrderTypeEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="供应商" v-if="!isSaleOrderOutput">{{
          head.customerSupplierName
        }}</el-descriptions-item>
        <el-descriptions-item label="是否配送" v-if="isSaleOrderOutput">{{
          head.needDelivery ? "需要配送" : "无需配送"
        }}</el-descriptions-item>
        <el-descriptions-item label="出库说明">{{
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
                <span v-if="isSaleOrderOutput">{{
                  row.relatedSaleOrderItem.commodity.name
                }}</span>
                <span v-else>{{
                  row.relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem
                    .commodity.name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="颜色" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleOrderOutput">{{
                  row.relatedSaleOrderItem.commodity.color
                }}</span>
                <span v-else>{{
                  row.relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem
                    .commodity.color
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleOrderOutput">{{
                  row.relatedSaleOrderItem.commoditySpec.specName
                }}</span>
                <span v-else>{{
                  row.relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem
                    .commoditySpec.specName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" align="center">
              <template slot-scope="scope">
                <ImagePreview
                  height="60px"
                  width="65px"
                  :src="
                    isSaleOrderOutput
                      ? scope.row.relatedSaleOrderItem.commodity
                          .imageNameList[0]
                      : scope.row.relatedPurchaseReturnOrderItem
                          .relatedPurchaseOrderItem.commodity.imageNameList[0]
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleOrderOutput"
                  >￥{{
                    row.relatedSaleOrderItem.commoditySpec.buyingPrice
                      | priceFixedTwo
                  }}</span
                >
                <span v-else
                  >￥{{
                    row.relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem
                      .commoditySpec.buyingPrice | priceFixedTwo
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="出库数量" align="center">
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
      <el-col :span="24" v-if="isSaleOrderOutput">
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
            <span v-if="isSaleOrderOutput">关联销售单信息</span>
            <span v-if="!isSaleOrderOutput">关联采购退货单信息</span>
            <span style="float: right">{{
              isSaleOrderOutput
                ? head.relatedSaleOrderHead.orderNo
                : head.relatedPurchaseReturnOrderHead.orderNo
            }}</span>
          </div>
          <!-- 采购退货单 -->
          <div v-if="!isSaleOrderOutput" @click="toOrderDetail">
            <el-descriptions title="" :column="2">
              <el-descriptions-item label="审批状态">
                <span
                  :style="
                    $thinking.getCheckType(
                      head.relatedPurchaseReturnOrderHead
                        .orderApprovalStatusEnum.Name
                    )
                  "
                  >{{
                    head.relatedPurchaseReturnOrderHead.orderApprovalStatusEnum
                      .Desc
                  }}</span
                >
              </el-descriptions-item>
              <el-descriptions-item label="收款状态">
                {{
                  head.relatedPurchaseReturnOrderHead.fundCollectProgressEnum
                    .Desc
                }}
              </el-descriptions-item>
              <el-descriptions-item label="出库状态">
                {{
                  head.relatedPurchaseReturnOrderHead
                    .commodityOutputProgressEnum.Desc
                }}
              </el-descriptions-item>
              <el-descriptions-item label="供应商">
                {{ head.relatedPurchaseReturnOrderHead.supplier.name }}
              </el-descriptions-item>
              <el-descriptions-item label="关联采购单">
                {{ head.relatedPurchaseReturnOrderHead.orderNo }}
              </el-descriptions-item>
              <el-descriptions-item label="单据金额" :span="2">
                ￥{{
                  head.relatedPurchaseReturnOrderHead.orderAmount
                    | priceFixedTwo
                }}
              </el-descriptions-item>
              <el-descriptions-item label="制单信息">
                {{ head.creator.name }} {{ head.createTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!-- 销售单出库 -->
          <div @click="toOrderDetail" v-else>
            <el-descriptions title="" :column="2">
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
              <el-descriptions-item label="单据金额" :span="2">
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
      <el-col :span="12" v-if="isSaleOrderOutput && head.needDelivery">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>配送信息</span>
          </div>
          <el-descriptions title="" :column="2">
            <el-descriptions-item label="配送状态">{{
              head.commodityDeliverStatusEnum.Desc || ""
            }}</el-descriptions-item>
            <el-descriptions-item label="配送员">{{
              deliveryUserNameList
            }}</el-descriptions-item>
            <el-descriptions-item
              label="回传备注"
              v-if="
                head.commodityDeliverStatusEnum.Name === 'Complete' ||
                head.commodityDeliverStatusEnum.Name === 'Confirming'
              "
              >{{ head.postBackRemark }}</el-descriptions-item
            >
            <el-descriptions-item label="完成配送时间">{{
              head.completeDeliverTime
            }}</el-descriptions-item>
            <el-descriptions-item label="回传图片">
              <ImagePreview
                height="80px"
                width="80px"
                v-for="(item, index) in head.postBackImageNameList"
                :key="index"
                order="outpostBack"
                :src="item"
              />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
      <el-col :span="12" v-if="head.paperImageNameList">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>纸质单据</span>
          </div>
          <ImagePreview
            height="80px"
            width="80px"
            v-for="(item, index) in head.paperImageNameList"
            :key="index"
            order="outpaper"
            :src="item"
          />
        </el-card>
      </el-col>
      <el-col :span="12" v-if="head.placementImageNameList">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>摆放位置</span>
          </div>
          <ImagePreview
            height="80px"
            width="80px"
            v-for="(item, index) in head.placementImageNameList"
            :key="index"
            order="outaddress"
            :src="item"
          />
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
        <el-descriptions-item label="关联单据行项目出库进度">
          <span class="mr5"
            >待出库 {{ relatedOrderItem.toBeOutputQuantity }}</span
          >
          <span class="mr5"
            >出库中 {{ relatedOrderItem.outputingQuantity }}</span
          >
          <span>已出库 {{ relatedOrderItem.completedOutputQuantity }} </span>
        </el-descriptions-item>
        <el-descriptions-item label="出库数量">
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
import { getOutOrderDetailById } from "@/api/vehicle-monitoring/order";
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
          commodityOutputOrderTypeEnum: {},
          orderApprovalStatusEnum: {},
          customer: {},
          fundCollectProgressEnum: {},
          commodityOutputProgressEnum: {},
          creator: {},
          submitUser: {},
          relatedPurchaseReturnOrderHead: {
            orderApprovalStatusEnum: {},
            fundCollectProgressEnum: {},
            commodityOutputProgressEnum: {},
            supplier: {},
          },
          relatedSaleOrderHead: {
            orderApprovalStatusEnum: {},
            fundCollectProgressEnum: {},
            commodityOutputProgressEnum: {},
            supplier: {},
          },
          handleUser: {},
        },
        itemList: [
          {
            relatedSaleOrderItem: {
              commodity: {
                imageNameList: [""],
              },
              commoditySpec: {},
              snapshot: {
                commodity: {
                  imageNameList: [""],
                },
                commoditySpec: {},
              },
            },
            relatedPurchaseReturnOrderItem: {
              relatedPurchaseOrderItem: {
                commodity: {
                  imageNameList: [""],
                },
                commoditySpec: {},
                snapshot: {
                  commodity: {
                    imageNameList: [""],
                  },
                  commoditySpec: {},
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
      return this.isSaleOrderOutput
        ? {
            ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
              .snapshot.commodity,
            ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
              .commodity,
          }
        : {
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem.snapshot
              .commodity,
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem
              .commodity,
          };
    },
    commoditySpec() {
      return this.isSaleOrderOutput
        ? {
            ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
              .snapshot.commoditySpec,
            ...this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
              .commoditySpec,
          }
        : {
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem.snapshot
              .commoditySpec,
            ...this.detailForm.itemList[this.currentIndex]
              .relatedPurchaseReturnOrderItem.relatedPurchaseOrderItem
              .commoditySpec,
          };
    },
    // 是否是销售单出库
    isSaleOrderOutput() {
      return (
        this.detailForm.head.commodityOutputOrderTypeEnum.Name === "SaleOrder"
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
      return this.isSaleOrderOutput
        ? this.detailForm.itemList[this.currentIndex].relatedSaleOrderItem
        : this.detailForm.itemList[this.currentIndex]
            .relatedPurchaseReturnOrderItem;
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
      getOutOrderDetailById({ id: this.$route.query.orderId }).then((res) => {
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
      let path = this.isSaleOrderOutput
        ? "sale-detail"
        : "purchasereturn-detail";
      let id = this.isSaleOrderOutput
        ? this.head.relatedSaleOrderHead.id
        : this.head.relatedPurchaseReturnOrderHead.id;
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
