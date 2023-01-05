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
      <el-form-item label="编号" prop="quickSearchInfoList[1].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          style="width: 240px"
          placeholder="请输入客户编号"
          clearabl
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="quickSearchInfoList[2].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          style="width: 240px"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="联系方式"
        prop="quickSearchInfoList[3].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[3].quickSearchValue"
          style="width: 240px"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="quickSearchInfoList[4].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[4].quickSearchValue"
          style="width: 240px"
          placeholder="请输入地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="quickSearchInfoList[5].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[5].quickSearchValue"
          style="width: 240px"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户类型" prop="customerTypeEnum">
        <el-select
          v-model="params.customerTypeEnum"
          style="width: 240px"
          placeholder="请选择客户类型"
          clearable
        >
          <el-option
            v-for="(item, index) in customerTypeEnumList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="余额区间">
        <div style="display: flex">
          <el-input
            style="width: 108px"
            type="number"
            v-model="params.minBalance"
            placeholder="不限"
            clearable
            @keyup.enter.native="handleQuery"
          />
          <div class="ml10 mr10">-</div>
          <el-input
            style="width: 108px"
            type="number"
            v-model="params.maxBalance"
            placeholder="不限"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </div>
      </el-form-item>
      <el-form-item label="客户分组" prop="customerGroupEnum">
        <el-select
          v-model="params.customerGroupEnum"
          style="width: 240px"
          placeholder="请选择分组"
          clearable
        >
          <el-option
            v-for="(item, index) in customerGroupEnumList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序方式" prop="sortInfo">
        <el-select
          v-model="sortName"
          style="width: 240px"
          placeholder="请选择排序方式"
          clearable
          @change="selectSortType"
        >
          <el-option label="编号正序 [默认]" value=""></el-option>
          <el-option label="编号倒序" :value="1"></el-option>
          <el-option label="姓名正序" :value="2"></el-option>
          <el-option label="姓名倒序" :value="3"></el-option>
          <el-option label="余额最少" :value="4"></el-option>
          <el-option label="余额最多" :value="5"></el-option>
          <el-option label="最早创建" :value="6"></el-option>
          <el-option label="最近创建" :value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="flex-end">
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:purchase:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:purchase:edit']"
          >修改</el-button
        >
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      :cell-style="$thinking.getCellFontColor"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="编号"
        align="center"
        prop="customerNo"
        width="120"
      />
      <el-table-column label="客户姓名" align="center" prop="name" />
        <el-table-column
          label="客户电话"
          align="center"
          prop="phoneNumber"
          width="120"
        />
      <el-table-column
        label="地址"
        align="center"
        prop="address"
        show-overflow-tooltip
      />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.frozen" type="danger" disable-transitions
            >已冻结</el-tag
          >
          <el-tag class="ml10" type="primary" disable-transitions>{{
            scope.row.customerTypeEnum.Desc
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前跟进人" align="center" width="180">
        <template slot-scope="scope">
          <span style="color: red">{{
            scope.row.customerFollowUpList[0]
              ? scope.row.customerFollowUpList[0].user.name
              : "" +
                " " +
                (new Date(
                  scope.row.customerFollowUpList[0]
                    ? scope.row.customerFollowUpList[0].nextFollowUpTime
                    : ""
                ) < new Date()
                  ? "[已超时]"
                  : "")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建信息" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.creator.name + " " + scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:dict:edit']">修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleFloowDetail(scope.row)"
            >跟进详情</el-button
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

    <!-- 操作框 -->
    <edit-dialog
      :form="form"
      :open="open"
      :title="title"
      @closeDialog="cancel"
    />
  </div>
</template>

<script>
import {
  getCustomerData,
  getCustomerGroupEnumList,
  getCustomerTypeEnumList,
  getCustomerDetailById,
} from "@/api/vehicle-monitoring/customer";
import editDialog from "./components/edit.vue";

export default {
  name: "Purchase",
  data() {
    return {
      form: {},
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
      // 客户分组数据
      customerGroupEnumList: [],
      // 客户类型数据
      customerTypeEnumList: [],
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
            columns: ["customerNo", "name", "phoneNumber", "address", "remark"],
            quickSearchValue: null,
          },
          {
            columns: ["customerNo"],
            quickSearchValue: null,
          },
          {
            columns: ["name"],
            quickSearchValue: null,
          },
          {
            columns: ["phoneNumber"],
            quickSearchValue: null,
          },
          {
            columns: ["address"],
            quickSearchValue: null,
          },
          {
            columns: ["remark"],
            quickSearchValue: null,
          },
        ],
        customerTypeEnum: null,
        customerGroupEnum: null,
        minBalance: null,
        maxBalance: null,
        frozen: null,
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
        sortInfo: null,
      },
    };
  },
  components: {
    editDialog,
  },
  created() {
    this.getList();
    this.getCustomerGroupEnumList();
    this.getCustomerTypeEnumList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getCustomerData(this.params).then((response) => {
        this.tableData = response.data;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    // 获取客户分组
    getCustomerGroupEnumList() {
      getCustomerGroupEnumList().then((res) => {
        this.customerGroupEnumList = res.data;
      });
    },
    // 获取客户类型
    getCustomerTypeEnumList() {
      getCustomerTypeEnumList().then((res) => {
        this.customerTypeEnumList = res.data;
      });
    },
    // 跳转至跟进详情
    handleFloowDetail(row) {
      this.$router.push({
        name: "floow-detail",
        query: {
          floowId: row.customerFollowUpList[0].id,
          customerId: row.id
        },
      });
    },
    // 选择排序下拉框值
    selectSortType(val) {
      let data = {
        1: {
          columnName: "customerNo",
          order: "DESC",
        },
        2: {
          columnName: "name",
          order: "ASC",
        },
        3: {
          columnName: "name",
          order: "DESC",
        },
        4: {
          columnName: "balanceAmount",
          order: "ASC",
        },
        5: {
          columnName: "balanceAmount",
          order: "DESC",
        },
        6: {
          columnName: "createTime",
          order: "ASC",
        },
        7: {
          columnName: "createTime",
          order: "DESC",
        },
      };

      this.params.sortInfo = data[val] || {
        columnName: "customerNo",
        order: "ASC",
      };
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
      this.title = "添加客户";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        name: "customer-detail",
        query: { id: row.id },
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
      getCustomerDetailById({ id: id }).then((response) => {
        this.form = response.data;
        this.form.customerTypeEnum = response.data.customerTypeEnum.Name;
        this.form.customerGroupEnum = response.data.customerGroupEnum.Name;
        this.open = true;
        this.title = "修改客户";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/dict/type/export",
        {
          ...this.queryParams,
        },
        `type_${new Date().getTime()}.xlsx`
      );
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
