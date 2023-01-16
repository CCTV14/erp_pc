<template>
  <div class="app-container">
    <el-form
      :model="searchParam"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-radio-group v-model="value" @change="selectDate">
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="本年"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectQueryDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" prop="supplierName">
            <el-input
              v-model="searchParam.supplierName"
              placeholder="请输入名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="电话" prop="supplierPhoneNumber">
            <el-input
              v-model="searchParam.supplierPhoneNumber"
              placeholder="请输入供应商电话"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="地址" prop="supplierAddress">
            <el-input
              v-model="searchParam.supplierAddress"
              placeholder="请输入供应商地址"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 数据 -->
    <div class="count_flow mb15">
      <div class="in">
        <div>采购总额</div>
        <div class="price">￥{{ reportData.purchaseOrderSumAmount }}</div>
      </div>
      <div class="out">
        <div>采购单数量</div>
        <div class="price">
          {{ reportData.purchaseOrderCount }}
        </div>
      </div>
      <div class="out">
        <div>退货总额</div>
        <div class="price">￥{{ reportData.purchaseReturnOrderSumAmount | priceFixedTwo}}</div>
      </div>
      <div class="out">
        <div>采购退货单数量</div>
        <div class="price">
          {{ reportData.purchaseReturnOrderCount }}
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="reportData.itemList">
      <el-table-column label="供应商名称" align="center" prop="supplier.name" />
      <el-table-column
        label="采购单数量"
        align="center"
        prop="purchaseOrderCount"
      />
      <el-table-column
        label="采购退货单数量"
        align="center"
        prop="purchaseReturnOrderCount"
      />
      <el-table-column label="采购金额" align="center" sortable>
        <template slot-scope="scope">
          <span>￥{{ scope.row.purchaseOrderSumAmount | thousandSymbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货金额" align="center" sortable>
        <template slot-scope="scope">
          <span
            >￥{{
              scope.row.purchaseReturnOrderSumAmount | thousandSymbol
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-if="
              (scope.row.purchaseOrderHeadList &&
                scope.row.purchaseOrderHeadList.length > 0) ||
              (scope.row.purchaseReturnOrderHeadList &&
                scope.row.purchaseReturnOrderHeadList.length > 0)
            "
            >单据清单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击详情表格 -->
    <el-dialog title="单据清单" :visible.sync="listVisble" width="65%">
      <list :detailObj="detailObj" />
    </el-dialog>
  </div>
</template>

<script>
import * as dates from "@/utils/date.js";
import { getSupplierRank } from "@/api/vehicle-monitoring/report";
import list from "./list.vue";
export default {
  data() {
    return {
      detailObj: {},
      listVisble: false,
      // 遮罩层
      loading: true,
      // 日期单选框选择项
      value: "本月",
      // 日期范围
      dateRange: [],
      // 查询参数
      searchParam: {
        supplierName: null,
        supplierPhoneNumber: null,
        supplierAddress: null,
        startDate: "",
        endDate: "",
      },
      // 数据
      reportData: {
        purchaseOrderSumAmount: 0,
        purchaseOrderCount: 0,
        purchaseReturnOrderSumAmount: 0,
        purchaseReturnOrderCount: 0,
      },
      // 渲染参数
      params: {
        current: 0,
        needShowCount: 5,
        data: {
          orderCount: 0,
          sumAmount: 0,
          showList: [],
        },
      },
      // 查询参数
      postForm: {
        endDate: "",
        startDate: "",
      },
    };
  },
  components: {
    list,
  },
  mounted() {
    this.selectDate("本月");
  },
  methods: {
    // 选择日期
    selectDate(val) {
      var date = "";
      switch (val) {
        case "本周":
          date = dates.getWeekStartEndDate();
          break;
        case "本月":
          date = dates.getMonthStartEndDate();
          break;
        case "本年":
          date = dates.getYearStartEndDate();
          break;
      }
      this.dateRange = date;
      this.searchParam.startDate = date[0];
      this.searchParam.endDate = date[1];
      this.handleQuery();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.searchParam.startDate = "";
      this.searchParam.endDate = "";
      this.handleQuery();
    },
    // 搜索
    async handleQuery() {
      this.loading = true;
      let res = await getSupplierRank(this.searchParam);
      if (res && res.success) {
        this.loading = false;
        this.reportData = res.data;
      }
    },
    handleDetail(row) {
      this.detailObj = {
        purchaseOrderHeadList: row.purchaseOrderHeadList,
        purchaseReturnOrderHeadList: row.purchaseReturnOrderHeadList,
      };
      this.listVisble = true;
    },
    // 选择查询日期
    selectQueryDate(val) {
      if (!val) {
        this.postForm.startDate = "";
        this.postForm.endDate = "";
        return;
      }
      this.postForm.startDate = val[0];
      this.postForm.endDate = val[1];
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .count_flow {
    display: flex;
    justify-content: space-around;
    // padding: 0 12px 0 12rpx;

    .in,
    .out {
      display: flex;
      // align-items: end;
      align-items: center;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      flex-direction: column-reverse;
      .price {
        font-size: 18px;
        color: #4d8dee;
        font-weight: 500;
        padding-bottom: 3px;
      }
    }
  }
}
</style>
