<template>
  <div>
    <!-- direction="vertical" -->
    <el-steps :active="stepsCurrent" finish-status="success" :direction="vertical?'vertical':'horizontal'">
      <el-step title="制单">
        <div slot="description">
          <div>{{ orderInfo.creator.name }}</div>
          <div>{{ orderInfo.createTime }}</div>
        </div>
      </el-step>
      <el-step title="提交审批">
        <div slot="description">
          <div>{{ orderInfo.submitUser.name }}</div>
          <div>{{ orderInfo.submitTime }}</div>
        </div>
      </el-step>
      <el-step :title="approvalResultTitle">
        <div slot="description" v-if="orderInfo.handleTime">
          <div>{{ orderInfo.handleUser.name }}</div>
          <div>审批意见:{{ orderInfo.handleMessage }}</div>
          <div>{{ orderInfo.handleTime }}</div>
        </div>
        <div slot="description" v-else>
          {{ approvalResultTitle }}
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => {},
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    stepsCurrent() {
      let res = 0;
      if (this.orderInfo.createTime) {
        res = 0;
      }
      if (this.orderInfo.submitTime) {
        res = 1;
      }
      if (this.orderInfo.handleTime) {
        res = 2;
      }
      return res;
    },
    approvalResultTitle() {
      let approvalStatus = this.orderInfo.orderApprovalStatusEnum.Name;
      if (approvalStatus == "Draft") {
        return "未提交审批";
      }
      if (approvalStatus == "Pending") {
        return "审批中";
      }
      if (approvalStatus == "Approval") {
        return "审批通过";
      }
      if (approvalStatus == "Reject") {
        return "审批拒绝";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
