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
          label="名称"
          prop="quickSearchInfoList[1].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[1].quickSearchValue"
            style="width: 240px"
            placeholder="请输入名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="地址"
          prop="quickSearchInfoList[3].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[3].quickSearchValue"
            style="width: 240px"
            placeholder="请输入地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="联系方式"
          prop="quickSearchInfoList[2].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[2].quickSearchValue"
            placeholder="请输入联系方式"
            style="width: 240px"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="quickSearchInfoList[4].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[4].quickSearchValue"
            style="width: 240px"
            placeholder="请输入备注"
            clearable
            @keyup.enter.native="handleQuery"
          />
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
        <el-form-item label="冻结状态" prop="frozen">
          <el-select
            v-model="params.frozen"
            style="width: 240px"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未冻结" :value="false"></el-option>
            <el-option label="已冻结" :value="true"></el-option>
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
            <el-option label="名称正序 [默认]" value=""></el-option>
            <el-option label="名称倒序" :value="1"></el-option>
            <el-option label="余额最多" :value="2"></el-option>
            <el-option label="余额最少" :value="3"></el-option>
            <el-option label="最早创建" :value="4"></el-option>
            <el-option label="最近创建" :value="5"></el-option>
          </el-select>
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
        :default-sort="{ prop: 'balanceAmount', order: 'descending' }"
      >
        <el-table-column label="名称" align="center" prop="name" width="150" />
        <el-table-column label="当前余额" align="center" sortable width="120">
          <template slot-scope="scope">
            <span>￥{{ scope.row.balanceAmount | thousandSymbol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="phoneNumber" />
        <el-table-column label="冻结状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.frozen ? "已冻结" : "未冻结" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建信息" align="center" width="200">
          <template slot-scope="scope">
            <span>{{
              scope.row.creator.name + " " + scope.row.createTime
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:dict:edit']"
              >修改</el-button
            >
            <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)"
                        v-hasPermi="['system:dict:detail']">查看</el-button> -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleDetail(scope.row)"
              >查看详情</el-button
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="当前余额" v-if="form.id">
            <span>￥{{ form.balanceAmount | priceFixedTwo }}</span>
          </el-form-item>
          <el-form-item label="联系方式" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入联系方式" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建信息" v-if="form.id">
            <span>{{ form.creator.name + " " + form.createTime }}</span>
          </el-form-item>
          <el-form-item label="冻结状态" v-if="form.id">
            <el-switch
              v-model="form.frozen"
              :active-value="true"
              :inactive-value="false"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getSupplierData,
  supplierAddSupplier,
  supplierFindById,
  supplierUpdate,
} from "@/api/vehicle-monitoring/commodity";

export default {
  name: "Purchase",
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
            columns: ["name", "phoneNumber", "address", "remark"],
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
        frozen: null,
        minBalance: null,
        maxBalance: null,
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
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: "联系方式不能为空",
            trigger: "blur",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "联系方式格式不正确",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "备注不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getSupplierData(this.params).then((response) => {
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
    // 选择排序下拉框值
    selectSortType(val) {
      let data = {
        1: {
          columnName: "name",
          order: "DESC",
        },
        2: {
          columnName: "balanceAmount",
          order: "ASC",
        },
        3: {
          columnName: "balanceAmount",
          order: "DESC",
        },
        4: {
          columnName: "createTime",
          order: "ASC",
        },
        5: {
          columnName: "createTime",
          order: "DESC",
        },
      };
      this.params.sortInfo = data[val] || null;
      this.getList();
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
      this.title = "添加供应商";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        path: "supplier-detail",
        query: { id: row.id },
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.form = {...row};
      // this.open=true;
      const id = row.id || this.ids;
      supplierFindById({ id: id }).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改供应商";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let res = this.form.id
            ? await supplierUpdate(this.form)
            : await supplierAddSupplier(this.form);
          if (res) {
            this.$modal.msgSuccess(res.message);
            this.open = false;
            this.getList();
          }
        }
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
