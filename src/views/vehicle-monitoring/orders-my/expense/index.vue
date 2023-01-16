<template>
  <div class="app-container">
    <el-form
      :model="params"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="单号" prop="quickSearchInfoList[1].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          placeholder="请输入单号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="支出类型"
        prop="quickSearchInfoList[2].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          placeholder="请输入支出类型"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="quickSearchInfoList[3].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[3].quickSearchValue"
          placeholder="请输入备注"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="制单人"
        prop="quickSearchInfoList[4].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[4].quickSearchValue"
          placeholder="请输入制单人名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批状态" prop="orderApprovalStatusEnumList">
        <el-select
          v-model="params.orderApprovalStatusEnumList"
          collapse-tags
          multiple
          placeholder="请选择审批状态"
          clearable
          style="width: 240px"
          @change="handleQuery"
        >
          <!-- <el-option label="不限" :value="[]"></el-option> -->
          <el-option
            v-for="(item, index) in selectOrderApprovalStatusListTemp"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单据金额">
        <div style="display: flex">
          <el-input
            style="width: 108px"
            v-model="params.minOrderAmount"
            placeholder="不限"
            clearable
            @keyup.enter.native="handleQuery"
          />
          <div class="ml10 mr10">-</div>
          <el-input
            style="width: 108px"
            v-model="params.maxOrderAmount"
            placeholder="不限"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </div>
      </el-form-item>
      <el-form-item label="排序方式" prop="sortInfo">
        <el-select
          v-model="sortName"
          placeholder="请选择排序方式"
          clearable
          style="width: 240px"
          @change="selectSortType"
        >
          <el-option label="最近创建 [默认]" value=""></el-option>
          <el-option label="最早创建" :value="1"></el-option>
          <el-option label="单据金额倒序" :value="2"></el-option>
          <el-option label="单据金额正序" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="制单日期">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectQueryDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="flex-end">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          v-hasPermi="['vehicle:expenseordermy:query']"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      :cell-style="$thinking.getCellFontColor"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="单号" align="center" prop="orderNo" width="130">
        <template slot-scope="{ row }">
          {{ row.orderNo || "草稿" }}
        </template>
      </el-table-column>
      <el-table-column
        label="支出类型"
        align="center"
        prop="expenseType"
        width="120"
      />
      <el-table-column label="单据金额" align="center" sortable width="100">
        <template slot-scope="scope">
          <span>￥{{ scope.row.orderAmount | thousandSymbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单信息" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.creator.name + " " + scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        fixed="right"
        prop="orderApprovalStatusEnum.Desc"
        align="center"
      />
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
            icon="el-icon-top-right"
            v-hasPermi="['vehicle:expenseordermy:submit']"
            v-if="scope.row.orderApprovalStatusEnum.Name === 'Draft'"
            @click="handleSubmitById(scope.row.id)"
            >提交</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['vehicle:expenseordermy:delete']"
            v-if="
              scope.row.orderApprovalStatusEnum.Name === 'Draft' ||
              scope.row.orderApprovalStatusEnum.Name === 'Reject'
            "
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="params.pageInfo.page"
      :limit.sync="params.pageInfo.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getOrderApprovalStatusEnumList } from "@/api/vehicle-monitoring/order.js";

import {
  myExpenseOrderFindPageForManage,
  myExpenseOrderSubmitById,
  deleteExpenseOrder,
} from "@/api/vehicle-monitoring/order-my.js";

export default {
  name: "ExpenseMy",
  data() {
    return {
      // 排序方式名称
      sortName: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      tableData: [],
      // 审批状态
      selectOrderApprovalStatusListTemp: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层 新增/编辑框
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      params: {
        quickSearchInfoList: [
          {
            columns: ["orderNo", "expenseType", "remark", "creator.name"],
            quickSearchValue: null,
          },
          {
            columns: ["orderNo"],
            quickSearchValue: null,
          },
          {
            columns: ["expenseType"],
            quickSearchValue: null,
          },
          {
            columns: ["remark"],
            quickSearchValue: null,
          },
          {
            columns: ["creator.name"],
            quickSearchValue: null,
          },
        ],
        orderApprovalStatusEnumList: null,
        minOrderAmount: null,
        maxOrderAmount: null,
        minCreateDate: null,
        maxCreateDate: null,
        onlyMyCreate: false,
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
        sortInfo: null,
      },
    };
  },
  created() {
    this.getList();
    this.getOrderApprovalStatusList();
  },
  methods: {
    /** 查询我的费用支出单列表 */
    getList() {
      this.loading = true;
      myExpenseOrderFindPageForManage(this.params).then((response) => {
        this.tableData = response.data;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 获取审批状态列表
    getOrderApprovalStatusList() {
      getOrderApprovalStatusEnumList().then((res) => {
        this.selectOrderApprovalStatusListTemp = res.data;
      });
    },
    // 选择排序下拉框值
    selectSortType(val) {
      switch (val) {
        case 1:
          this.params.sortInfo = {
            columnName: "createTime",
            order: "ASC",
          };
          break;
        case 2:
          this.params.sortInfo = {
            columnName: "orderAmount",
            order: "DESC",
          };
          break;
        case 3:
          this.params.sortInfo = {
            columnName: "orderAmount",
            order: "ASC",
          };
          break;
        default:
          this.params.sortInfo = null;
          break;
      }
    },
    // 选择查询日期
    selectQueryDate(val) {
      if (!val) {
        this.params.minCreateDate = "";
        this.params.maxCreateDate = "";
        return;
      }
      this.params.minCreateDate = val[0];
      this.params.maxCreateDate = val[1];
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.pageInfo.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      for (const w in this.params) {
        if (w.indexOf("min") != -1 || w.indexOf("max") != -1) {
          this.params[w] = "";
        }
      }
      this.sortName = "";
      this.handleQuery();
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        path: "expense-detail",
        query: { orderId: row.id },
      });
    },
    /** 提交 */
    handleSubmitById(id) {
      myExpenseOrderSubmitById(id).then((res) => {
        // 可能要做弹框显示操作...
        if (res.success) {
          this.$modal.alertSuccess(res.message);
          this.getList();
        }
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否确认删除单号为"' + row.orderNo + '"的单据？')
        .then(function () {
          return deleteExpenseOrder(id);
        })
        .then((res) => {
          if (res.success) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
        })
        .catch(() => {});
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("刷新成功");
        this.$store.dispatch("dict/cleanDict");
      });
    },
  },
};
</script>
