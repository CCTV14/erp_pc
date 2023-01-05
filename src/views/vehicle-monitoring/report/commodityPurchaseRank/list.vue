<template>
  <div>
    <el-table
      :data="purchaseList"
      @row-click="toDetail"
      :cell-style="$thinking.getCellFontColor"
    >
      <el-table-column label="单号" align="center" prop="orderNo" width="120">
        <template slot-scope="{ row }">
          {{ row.orderNo || "草稿" }}
        </template>
      </el-table-column>
      <el-table-column
        label="入库状态"
        align="center"
        prop="commodityInputProgressEnum.Desc"
      />
      <el-table-column
        label="付款状态"
        align="center"
        prop="fundPayProgressEnum.Desc"
      />
      <el-table-column
        label="供应商"
        align="center"
        prop="supplier.name"
        width="100"
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
    purchaseList: Array,
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
