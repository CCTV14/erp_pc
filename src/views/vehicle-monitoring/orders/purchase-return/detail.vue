<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="采购退货单详情" :column="4">
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
        <el-descriptions-item label="供应商">{{
          head.supplier.name
        }}</el-descriptions-item>
        <el-descriptions-item label="业务员">{{
          saleUserNameList
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 商品列表 -->
    <div
      class="commodity_list mb15"
      v-if="detailForm.itemList[0].relatedPurchaseOrderItem.commodity.name"
    >
      <el-descriptions title="所选商品">
        <el-descriptions-item
          label=""
          :labelStyle="{ display: 'none' }"
          :contentStyle="{ width: '100%' }"
        >
          <el-table :data="detailForm.itemList" stripe v-loading="loading">
            <el-table-column
              prop="relatedPurchaseOrderItem.commodity.name"
              label="商品名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="relatedPurchaseOrderItem.commodity.color"
              label="颜色"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="relatedPurchaseOrderItem.commoditySpec.specName"
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
                    scope.row.relatedPurchaseOrderItem.commodity
                      .imageNameList[0]
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="总进货价" align="center">
              <template slot-scope="scope">
                ￥{{ scope.row.commodityRetailTotalAmount | priceFixedTwo }}
              </template>
            </el-table-column>
            <el-table-column label="退货数量" align="center">
              <template slot-scope="{ row }">
                {{
                  row.itemQuantity +
                  " " +
                  row.relatedPurchaseOrderItem.commodity.unit
                }}
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
            <span>金额信息</span>
          </div>
          <el-descriptions title="" :column="2">
            <el-descriptions-item label="单据金额"
              ><span class="text-primary"
                >￥{{ head.orderAmount | priceFixedTwo }}</span
              ></el-descriptions-item
            >
            <el-descriptions-item label="总进货价"
              >￥{{
                head.commodityRetailTotalAmount | priceFixedTwo
              }}</el-descriptions-item
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
            <el-descriptions-item label="全部收款时间" :span="2">{{
              head.fullCollectTime || "暂无"
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>出库进度</span>
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
            <el-descriptions-item label="全部出库时间" :span="3">{{
              head.fullOutputTime || "暂无"
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card pointer">
          <div slot="header" class="clearfix" @click="toOrderDetail">
            <span>关联采购单信息</span>
            <span style="float: right">{{
              head.relatedPurchaseOrderHead.orderNo
            }}</span>
          </div>
          <!-- 采购单 -->
          <div @click="toOrderDetail">
            <el-descriptions title="" :column="2">
              <el-descriptions-item label="审批状态">
                <span
                  :style="
                    $thinking.getCheckType(
                      head.relatedPurchaseOrderHead.orderApprovalStatusEnum.Name
                    )
                  "
                >
                  {{
                    head.relatedPurchaseOrderHead.orderApprovalStatusEnum.Desc
                  }}
                </span>
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
                  head.relatedPurchaseOrderHead.orderAmount | priceFixedTwo
                }}
              </el-descriptions-item>
              <el-descriptions-item label="制单信息">
                {{ head.creator.name }} {{ head.createTime }}
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
          <div class="mb5">商品名称：{{ commodity.name || "" }}</div>
          <div class="mb5">颜色：{{ commodity.color || "" }}</div>
          <div class="mb5">规格：{{ commoditySpec.specName || "" }}</div>
        </div>
      </div>
      <el-descriptions title="信息" :column="1">
        <el-descriptions-item label="单位">
          {{ commodity.unit }}</el-descriptions-item
        >
        <el-descriptions-item label="进货价">
          ￥{{ commoditySpec.retailPrice | priceFixedTwo }}
        </el-descriptions-item>
        <el-descriptions-item label="退货数量">
          {{ currentRow.itemQuantity }}
        </el-descriptions-item>
        <el-descriptions-item label="总进货价">
          ￥{{ currentRow.commodityRetailTotalAmount | priceFixedTwo }}
        </el-descriptions-item>
        <el-descriptions-item label="出库进度">
          <span class="mr10">待出库 {{ currentRow.toBeOutputQuantity }}</span>
          <span class="mr10">出库中 {{ currentRow.outputingQuantity }}</span>
          <span class="mr10"
            >已出库 {{ currentRow.completedOutputQuantity }}</span
          >
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPurchaseReturnOrderDetailById } from "@/api/vehicle-monitoring/order";
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
          orderApprovalStatusEnum: {},
          customer: {},
          relatedPurchaseOrderHead: {
            orderApprovalStatusEnum: {},
            fundPayProgressEnum: {},
            commodityInputProgressEnum: {},
            supplier: {},
          },
          fundCollectProgressEnum: {},
          commodityOutputProgressEnum: {},
          creator: {},
          supplier: {},
          submitUser: {},
          handleUser: {},
        },
        itemList: [
          {
            relatedPurchaseOrderItem: {
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
        ...this.detailForm.itemList[this.currentIndex].relatedPurchaseOrderItem
          .commodity,
        ...this.detailForm.itemList[this.currentIndex].relatedPurchaseOrderItem
          .snapshot.commodity,
      };
    },
    commoditySpec() {
      return {
        ...this.detailForm.itemList[this.currentIndex].relatedPurchaseOrderItem
          .commoditySpec,
        ...this.detailForm.itemList[this.currentIndex].relatedPurchaseOrderItem
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
  created() {
    this.loading = false;
    this.mode = this.$route.query.mode;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getPurchaseReturnOrderDetailById({ id: this.$route.query.orderId }).then(
        (res) => {
          console.log(!res.data.itemList);
          if (res.data.itemList.length == 0) {
            this.detailForm.head = res.data.head;
          } else {
            this.detailForm = res.data;
          }
        }
      );
    },
    // 点击查看
    handleSee(row, index) {
      console.log(row);
      this.currentRow = row;
      this.currentIndex = index;
      this.detailVisble = true;
    },
    // 跳转详情
    toOrderDetail() {
      this.$router.push({
        path: "purchase-detail",
        query: {
          orderId: this.head.relatedPurchaseOrderHead.id,
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
