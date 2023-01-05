<template>
  <div>
    <el-table
      :data="commoditySaleList"
      @row-click="toDetail"
      :cell-style="$thinking.getCellFontColor"
    >
      <el-table-column label="单号" align="center" prop="orderNo" width="120">
        <template slot-scope="{ row }">
          {{ row.orderNo || "草稿" }}
        </template>
      </el-table-column>
      <el-table-column
        label="客户编号"
        align="center"
        prop="customer.customerNo"
        width="120"
      />
      <el-table-column
        label="客户姓名"
        align="center"
        prop="customerName"
      />
      <el-table-column
        label="客户电话"
        align="center"
        prop="customerPhoneNumber"
        width="150"
      />
      <el-table-column
        label="客户地址"
        align="center"
        prop="customerAddress"
      />
      <el-table-column
        label="出库状态"
        align="center"
        prop="commodityOutputProgressEnum.Desc"
      />
      <el-table-column
        label="收款状态"
        align="center"
        prop="fundCollectProgressEnum.Desc"
      />
      <el-table-column
        label="审批状态"
        fixed="right"
        prop="orderApprovalStatusEnum.Desc"
        align="center"
      />
      <el-table-column
        label="单据金额"
        prop="orderAmount"
        align="center"
        sortable
        width="100"
      >
        <template slot-scope="scope">
          <span>￥{{ scope.row.orderAmount | thousandSymbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单信息" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.creator.name + " " + scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    commoditySaleList: Array,
  },
  methods: {
    toDetail(row) {
      // this.$router.push({
      //   name: "sale-detail",
      //   query: { orderId: row.id },
      // });
    },
  },
};
</script>
