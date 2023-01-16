<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb15">
      <el-descriptions title="其他收入单详情" :column="4">
        <el-descriptions-item label="单号">
          <span>{{ detailForm.orderNo }}</span>
          <span
            class="ml10"
            :style="
              $thinking.getCheckType(detailForm.orderApprovalStatusEnum.Name)
            "
            >{{ detailForm.orderApprovalStatusEnum.Desc }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="单据日期">{{
          detailForm.orderDate
        }}</el-descriptions-item>
        <el-descriptions-item label="业务员">{{
          saleUserNameList
        }}</el-descriptions-item>
        <el-descriptions-item label="收入类型">{{
          detailForm.incomeType
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 详细信息 -->
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card mb10">
          <div slot="header" class="clearfix">
            <span>单据信息</span>
          </div>
          <el-descriptions title="" :column="1">
            <el-descriptions-item label="单据金额"
              >￥{{
                detailForm.orderAmount | priceFixedTwo
              }}</el-descriptions-item
            >
            <el-descriptions-item label="资金账户">
              <div style="display: flex; flex-wrap: wrap">
                <div
                  v-for="(item, index) in detailForm.fundAccountList"
                  :key="index"
                  class="mb20 mr20"
                >
                  <div class="mb5">
                    {{
                      "[" +
                      item.fundAccount.fundAccountTypeEnum.Desc +
                      "] " +
                      item.fundAccount.name
                    }}
                  </div>
                  <div>收入金额：￥{{ item.itemAmount | priceFixedTwo }}</div>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="备注">
              {{ detailForm.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>收款凭证</span>
          </div>
          <ImagePreview
            height="80px"
            width="80px"
            v-for="(item, index) in detailForm.incomeVoucherImageNameList"
            :key="index"
            order="income"
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
          <OrderStep :orderInfo="detailForm" />
        </el-card>
      </el-col>
    </el-row>
    <!--  -->
  </div>
</template>

<script>
import { getIncomeOrderFindById } from "@/api/vehicle-monitoring/order";
export default {
  data() {
    return {
      mode: "view",
      detailForm: {
        orderApprovalStatusEnum: {},
        fundAccountList: [],
        creator: {},
        submitUser: {},
      },
    };
  },
  computed: {
    canEdit() {
      return this.mode === "addNew" || this.mode === "update";
    },
    saleUserNameList() {
      if (
        this.detailForm.saleUserList &&
        this.detailForm.saleUserList.length > 0
      ) {
        return this.detailForm.saleUserList
          .map((item) => {
            return item.user.name;
          })
          .join("、");
      }
    },
  },
  mounted() {
    this.mode = this.$route.query.mode;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getIncomeOrderFindById({ id: this.$route.query.orderId }).then((res) => {
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
  .head {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
.info {
  display: flex;
  align-items: center;
}
</style>
