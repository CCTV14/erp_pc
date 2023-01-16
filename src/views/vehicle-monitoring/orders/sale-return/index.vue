<template>
  <div>
    <router-view></router-view>
    <div class="app-container" v-show="$route.meta.showRole">
      <el-form
        :model="params"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item
          label="单号"
          prop="quickSearchInfoList[1].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[1].quickSearchValue"
            placeholder="请输入单号"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="客户"
          prop="quickSearchInfoList[2].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[2].quickSearchValue"
            placeholder="请输入客户编号/收货人"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="制单人"
          prop="quickSearchInfoList[3].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[3].quickSearchValue"
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
        <el-form-item label="入库进度" prop="commodityInputProgressEnumList">
          <el-select
            v-model="params.commodityInputProgressEnumList"
            collapse-tags
            multiple
            placeholder="请选择入库进度"
            clearable
            style="width: 240px"
            @change="handleQuery"
          >
            <!-- <el-option label="不限" value=""></el-option> -->
            <el-option
              v-for="(item, index) in selectCommodityInputProgressList"
              :key="index"
              :label="item.Desc"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款进度" prop="fundPayProgressEnumList">
          <el-select
            v-model="params.fundPayProgressEnumList"
            collapse-tags
            multiple
            placeholder="请选择付款进度"
            clearable
            style="width: 240px"
            @change="handleQuery"
          >
            <!-- <el-option label="不限" value=""></el-option> -->
            <el-option
              v-for="(item, index) in selectFundPayProgressList"
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
        <el-row class="wd100 mb8">
          <el-col :span="12" class="flex-start">
            <!-- <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['SaleOrder_AddNewOrder']"
            >新增</el-button
          > -->
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
          <el-col :span="12" class="flex-end">
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
          </el-col>
        </el-row>
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
          label="客户姓名"
          align="center"
          prop="customerName"
          width="100"
        />
        <el-table-column
          label="客户电话"
          align="center"
          prop="customerPhoneNumber"
          width="120"
        />
        <el-table-column
          label="客户地址"
          align="center"
          prop="customerAddress"
          width="200"
        />
        <el-table-column label="单据金额" align="center" sortable width="100">
          <template slot-scope="scope">
            <span>￥{{ scope.row.orderAmount | thousandSymbol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="制单信息" align="center" width="200">
          <template slot-scope="scope">
            <span>{{
              scope.row.creator.name + " " + scope.row.createTime
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="付款进度"
          prop="fundPayProgressEnum.Desc"
          align="center"
        />
        <el-table-column
          label="入库进度"
          prop="commodityInputProgressEnum.Desc"
          align="center"
        />
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
          width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:dict:edit']">修改</el-button> -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleDetail(scope.row)"
              >查看详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:dict:remove']"
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

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="500px"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="选择商品" prop="email">
            <i class="el-icon-edit" @click="selectCommodityVisble = true"></i>
            <!-- <el-input v-model="form.email" placeholder="请输入邮箱" /> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 选择商品的抽屉 -->
      <el-drawer
        title="请选择商品"
        :visible.sync="selectCommodityVisble"
        direction="rtl"
      >
        <span>我来啦!</span>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {
  getFundPayProgressEnumList,
  getCommodityInputProgressEnumList,
  getOrderApprovalStatusEnumList,
  saleReturnOrderFindPageForManage,
} from "@/api/vehicle-monitoring/order.js";

import { saleReturnOrderExport } from "@/api/vehicle-monitoring/order";

export default {
  name: "SaleReturn",
  data() {
    return {
      // 排序方式名称
      sortName: "",
      // 选择商品
      selectCommodityVisble: false,
      // 是否选择仅我的单据
      isMeOrder: false,
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
      // 付款进度
      selectFundPayProgressList: [],
      // 入库进度
      selectCommodityInputProgressList: [],
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
            columns: [
              "orderNo",
              "customer.customerNo",
              "customerName",
              "customerPhoneNumber",
              "customerAddress",
              "creator.name",
            ],
            quickSearchValue: null,
          },
          {
            columns: ["orderNo"],
            quickSearchValue: null,
          },
          {
            columns: [
              "customer.customerNo",
              "customerName",
              "customerPhoneNumber",
              "customerAddress",
            ],
            quickSearchValue: null,
          },
          {
            columns: ["creator.name"],
            quickSearchValue: null,
          },
        ],
        orderApprovalStatusEnumList: null,
        fundPayProgressEnumList: null,
        commodityInputProgressEnumList: null,
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: "用户名称不能为空",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getOrderApprovalStatusList();
    this.getFunPayProgressList();
    this.getCommodityInputProgressEnumList();
  },
  methods: {
    /** 查询销售退货列表 */
    getList() {
      this.loading = true;
      saleReturnOrderFindPageForManage(this.params).then((response) => {
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
    // 获取付款状态列表
    getFunPayProgressList() {
      getFundPayProgressEnumList().then((res) => {
        this.selectFundPayProgressList = res.data;
      });
    },
    // 获取出库进度列表
    getCommodityInputProgressEnumList() {
      getCommodityInputProgressEnumList().then((res) => {
        this.selectCommodityInputProgressList = res.data;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.loading("正在导出...");
      saleReturnOrderExport(this.params).then((res) => {
        if (res.success) {
          this.$modal.closeLoading();
          this.$modal.msgSuccess("导出成功");
          this.$thinking.downloadFileByByte(
            res.data,
            "销售退货单导出数据.xlsx"
          );
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: "",
        name: "",
        phone: "",
        email: "",
      };
      this.resetForm("form");
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售单";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        path: "saleReturn-detail",
        query: { orderId: row.id, mode: "view" },
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.form = {...row};
      // this.open=true;
      const id = row.id || this.ids;
      getType(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateType(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除用户id为"' + ids + '"的数据项？')
        .then(function () {
          return delType(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
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
