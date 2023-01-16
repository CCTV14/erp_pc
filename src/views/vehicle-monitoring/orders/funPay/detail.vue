<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="付款单详情">
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
        <el-descriptions-item label="付款类型">{{
          head.fundPayOrderTypeEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="供应商" v-if="!isSaleReturnOrderPay">{{
          head.customerSupplierName
        }}</el-descriptions-item>
        <el-descriptions-item label="业务员">{{
          saleUserNameList
        }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{
          head.remark
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 单据列表 -->
    <div class="commodity_list mb15">
      <el-descriptions title="所选付款单据">
        <el-descriptions-item
          label=""
          :labelStyle="{ display: 'none' }"
          :contentStyle="{ width: '100%' }"
        >
          <el-table :data="detailForm.itemList" stripe v-loading="loading">
            <el-table-column label="单号" align="center" width="150">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  {{ row.relatedSaleReturnOrderHead.orderNo }}
                </span>
                <span v-else>
                  {{ row.relatedPurchaseOrderHead.orderNo }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="付款状态" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  {{ row.relatedSaleReturnOrderHead.fundPayProgressEnum.Desc }}
                </span>
                <span v-else>
                  {{ row.relatedPurchaseOrderHead.fundPayProgressEnum.Desc }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="单据金额" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥{{
                    row.relatedSaleReturnOrderHead.orderAmount | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥{{
                    row.relatedPurchaseOrderHead.orderAmount | priceFixedTwo
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="付款中" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥{{
                    row.relatedSaleReturnOrderHead.payingAmount | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥{{
                    row.relatedPurchaseOrderHead.payingAmount | priceFixedTwo
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="已付" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥{{
                    row.relatedSaleReturnOrderHead.completedPayAmount
                      | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥{{
                    row.relatedPurchaseOrderHead.completedPayAmount
                      | priceFixedTwo
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="付款优惠" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥{{
                    row.relatedSaleReturnOrderHead.payDisCountAmount
                      | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥{{
                    row.relatedPurchaseOrderHead.payDisCountAmount
                      | priceFixedTwo
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="待付" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥{{
                    row.relatedSaleReturnOrderHead.toBePayAmount | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥{{
                    row.relatedPurchaseOrderHead.toBePayAmount | priceFixedTwo
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="退款中" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥{{
                    row.relatedSaleReturnOrderHead.returningAmount
                      | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥{{
                    row.relatedPurchaseOrderHead.returningAmount | priceFixedTwo
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="已退款" align="center">
              <template slot-scope="{ row }">
                <span v-if="isSaleReturnOrderPay">
                  ￥
                  {{
                    row.relatedSaleReturnOrderHead.completedReturnAmount
                      | priceFixedTwo
                  }}
                </span>
                <span v-else>
                  ￥
                  {{
                    row.relatedPurchaseOrderHead.completedReturnAmount
                      | priceFixedTwo
                  }}
                </span>
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
      <el-col :span="12" v-if="isSaleReturnOrderPay">
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
            <el-descriptions-item label="优惠金额"
              >￥{{ head.disCountAmount | priceFixedTwo }}</el-descriptions-item
            >
            <el-descriptions-item label="付款总额"
              >￥{{ head.payTotalAmount | priceFixedTwo }}</el-descriptions-item
            >
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
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
            order="funpaypaper"
            :src="item"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>付款凭证</span>
          </div>
          <ImagePreview
            height="80px"
            width="80px"
            v-for="(item, index) in head.voucherImageNameList"
            :key="index"
            order="funpaycomprobante"
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
      title="单据详情"
      :visible.sync="detailVisble"
      width="500px"
      append-to-body
    >
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="付款单据">
          <div
            style="display: flex; width: 100%; cursor: pointer"
            @click="toSaleDetail"
          >
            <div class="mr5">{{ relatedOrderHead.orderNo }}</div>
            <div style="position: relative; bottom: 3px">
              <el-tag>{{ relatedOrderHead.fundPayProgressEnum.Desc }}</el-tag>
            </div>
          </div>
          <div style="position: relative; bottom: 3px">
            <i class="el-icon-arrow-right"></i>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="单据金额">
          ￥{{
            relatedOrderHead.orderAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="已付金额">
          ￥{{
            relatedOrderHead.completedPayAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="待付金额">
          ￥{{
            relatedOrderHead.toBePayAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="退款金额">
          ￥{{
            relatedOrderHead.returnAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="本次付款金额">
          ￥{{ currentRow.payAmount | priceFixedTwo }}</el-descriptions-item
        >
        <el-descriptions-item label="折扣金额">
          ￥{{
            currentRow.disCountAmount | priceFixedTwo
          }}</el-descriptions-item
        >
        <el-descriptions-item label="本次实付金额">
          ￥{{ currentRow.itemAmount | priceFixedTwo }}</el-descriptions-item
        >
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFunPayOrderDetailById } from "@/api/vehicle-monitoring/order";
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
          fundPayOrderTypeEnum: {},
          creator: {},
          submitUser: {},
          paperImageNameList: [],
          orderApprovalStatusEnum: {},
        },
        itemList: [
          {
            relatedSaleReturnOrderHead: {
              fundPayProgressEnum: {},
            },
            relatedPurchaseOrderHead: {
              fundPayProgressEnum: {},
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
    // 如果是销售退货单付款
    isSaleReturnOrderPay() {
      return (
        this.detailForm &&
        this.detailForm.head.fundPayOrderTypeEnum &&
        this.detailForm.head.fundPayOrderTypeEnum.Name === "SaleReturnOrder"
      );
    },
    relatedOrderHead() {
      return this.isSaleReturnOrderPay
        ? this.detailForm.itemList[this.currentIndex].relatedSaleReturnOrderHead
        : this.detailForm.itemList[this.currentIndex].relatedPurchaseOrderHead;
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
      getFunPayOrderDetailById({ id: this.$route.query.orderId }).then(
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
    toSaleDetail() {
      let path = this.isSaleReturnOrderPay
        ? "salereturn-detail"
        : "purchase-detail";
      this.$router.push({
        path: path,
        query: {
          orderId: this.currentRow.relatedOrderHeadId,
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
