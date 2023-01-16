<template>
  <div class="app-container home">
    <div class="head mb10">
      <el-descriptions
        :title="
          detailForm.customerFollowUp.customer.name +
          '' +
          detailForm.customerFollowUp.customer.customerNo
        "
      >
        <el-descriptions-item label="当前余额"
          >￥{{
            detailForm.customerFollowUp.customer.balanceAmount | thousandSymbol
          }}</el-descriptions-item
        >
        <el-descriptions-item label="客户电话">{{
          detailForm.customerFollowUp.customer.phoneNumber
        }}</el-descriptions-item> 
        <el-descriptions-item label="客户分组">{{
          detailForm.customerFollowUp.customer.customerGroupEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="客户类型">{{
          detailForm.customerFollowUp.customer.customerTypeEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{
          detailForm.customerFollowUp.customer.address
        }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{
          detailForm.customerFollowUp.customer.remark
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="head mb10">
      <el-descriptions>
        <el-descriptions-item label="客户跟进状态">
          <span class="text-primary">{{
            detailForm.customerFollowUp.customerFollowUpStatusEnum.Desc
          }}</span></el-descriptions-item
        >
        <el-descriptions-item label="跟进记录类型">
          <span class="text-primary">{{
            detailForm.customerFollowUpDetailTypeEnum.Desc
          }}</span></el-descriptions-item
        >
        <el-descriptions-item label="跟进用户">{{
          detailForm.customerFollowUp.user.name
        }}</el-descriptions-item>
        <el-descriptions-item label="跟进时间">{{
          detailForm.followUpTime
        }}</el-descriptions-item>
        <el-descriptions-item label="客户类型变化"
          >{{ detailForm.originalCustomerTypeEnum.Desc }}
          <i class="el-icon-caret-right" />{{
            detailForm.newCustomerTypeEnum.Desc
          }}</el-descriptions-item
        >
        <el-descriptions-item label="客户分组变化"
          >{{ detailForm.originalCustomerGroupEnum.Desc }}
          <i class="el-icon-caret-right" />{{
            detailForm.originalCustomerGroupEnum.Desc
          }}</el-descriptions-item
        >
        <el-descriptions-item label="跟进内容">{{
          detailForm.followUpContent
        }}</el-descriptions-item>
        <el-descriptions-item label="是否继续跟进"
          ><span
            :class="
              detailForm.nextFollowUpTime ? 'text-success' : 'text-warning'
            "
            >{{ detailForm.nextFollowUpTime ? "继续跟进" : "停止跟进" }}</span
          ></el-descriptions-item
        >
        <el-descriptions-item label="预计下次跟进时间">{{
          detailForm.nextFollowUpTime
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import { customerFloowDetailFindById } from "@/api/vehicle-monitoring/customer.js";
export default {
  data() {
    return {
      customId: "",
      detailForm: {
        newCustomerTypeEnum: {},
        originalCustomerGroupEnum: {},
        originalCustomerTypeEnum: {},
        customerFollowUpDetailTypeEnum: {},
        customerFollowUp: {
          user: {},
          customerFollowUpStatusEnum: {},
          customer: {
            customerFollowUpStatusEnum: {},
            customerGroupEnum: {},
            customerTypeEnum: {},
          },
          customerGroupEnum: {},
          customerTypeEnum: {},
        },
      },
    };
  },
  mounted() {
    this.customId = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      customerFloowDetailFindById({
        id: this.customId,
      }).then((res) => {
        this.detailForm = {
          ...res.data,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .descript-mao .el-descriptions-item__label.has-colon::after {
  content: "";
}
.home {
  background: #fafafa;
  .head {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>
