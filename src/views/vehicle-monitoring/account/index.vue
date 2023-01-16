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
            placeholder="请输入名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="账户"
          prop="quickSearchInfoList[2].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[2].quickSearchValue"
            placeholder="请输入账户"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="quickSearchInfoList[3].quickSearchValue"
        >
          <el-input
            v-model="params.quickSearchInfoList[3].quickSearchValue"
            placeholder="请输入备注"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型" prop="fundAccountTypeEnum">
          <el-select
            v-model="params.fundAccountTypeEnum"
            placeholder="请选择类型"
            clearable
            style="width: 240px"
            @change="handleQuery"
          >
            <!-- <el-option label="全部类型" value=""></el-option> -->
            <el-option
              v-for="(item, index) in accountTypeEnumList"
              :key="index"
              :label="item.Desc"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冻结状态" prop="frozen">
          <el-select
            v-model="params.frozen"
            placeholder="请选择状态"
            clearable
            style="width: 240px"
            @change="handleQuery"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未冻结" :value="false"></el-option>
            <el-option label="已冻结" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式" prop="sortInfo">
          <el-select
            v-model="sortName"
            placeholder="请选择排序方式"
            clearable
            style="width: 240px"
            @change="selectSortType"
          >
            <el-option label="名字正序 [默认]" value=""></el-option>
            <el-option label="名称倒序" :value="1"></el-option>
            <el-option label="余额正序" :value="2"></el-option>
            <el-option label="余额倒序" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
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
      </el-row>

      <el-table
        v-loading="loading"
        :data="tableData"
        :cell-style="$thinking.getCellFontColor"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="名称" align="center" prop="name" width="160" />
        <el-table-column label="账户余额" align="center" sortable>
          <template slot-scope="scope">
            <span>￥{{ scope.row.balanceAmount | thousandSymbol }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          align="center"
          prop="fundAccountTypeEnum.Desc"
        />
        <el-table-column label="账户累计流入" align="center">
          <template slot-scope="scope">
            <span style="color: #378df5"
              >￥{{ scope.row.totalInflowAmount | thousandSymbol }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="账户累计流出" align="center">
          <template slot-scope="scope">
            <span style="color: #ff964e"
              >￥{{ scope.row.totalOutflowAmount | thousandSymbol }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="冻结状态" align="center" key="frozen">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.frozen"
              :active-value="true"
              :inactive-value="false"
              :disabled="true"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <!--             v-hasPermi="['system:dict:edit']" -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
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
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="当前余额" v-if="form.id">
            <span>￥{{ form.balanceAmount | priceFixedTwo }}</span>
          </el-form-item>
          <el-form-item label="累计流入" v-if="form.id">
            <span>￥{{ form.totalInflowAmount | priceFixedTwo }}</span>
          </el-form-item>
          <el-form-item label="累计流出" v-if="form.id">
            <span>￥{{ form.totalOutflowAmount | priceFixedTwo }}</span>
          </el-form-item>
          <el-form-item label="账户类型" prop="fundAccountTypeEnum">
            <el-select
              v-model="form.fundAccountTypeEnum"
              style="width: 100%"
              placeholder="请选择类型"
              clearable
            >
              <el-option
                v-for="(item, index) in accountTypeEnumList"
                :key="index"
                :label="item.Desc"
                :value="item.Name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="冻结状态" prop="frozen" v-if="form.id">
            <el-switch
              v-model="form.frozen"
              :active-value="true"
              :inactive-value="false"
              active-color="#F56C6C"
            >
            </el-switch>
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
  getFundAccountTypeEnumList,
  getAccountData,
  addAccount,
  editAccount,
  getAccountDetail,
} from "@/api/vehicle-monitoring/user.js";

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
      radio: "",
      // 表格数据
      tableData: [],
      // 类型列表
      accountTypeEnumList: [],
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
            columns: ["name", "account", "remark"],
            quickSearchValue: null,
          },
          {
            columns: ["name"],
            quickSearchValue: null,
          },
          {
            columns: ["account"],
            quickSearchValue: null,
          },
          {
            columns: ["remark"],
            quickSearchValue: null,
          },
        ],
        fundAccountTypeEnum: null,
        frozen: null,
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
    this.getFundAccountTypeEnumList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getAccountData(this.params).then((response) => {
        this.tableData = response.data;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 获取类型
    getFundAccountTypeEnumList() {
      getFundAccountTypeEnumList().then((res) => {
        this.accountTypeEnumList = res.data;
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
      };

      this.params.sortInfo = data[val] || null;
      this.handleQuery();
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
      this.title = "添加资金账户";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        path: "account-detail",
        query: { id: row.id },
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.form = {...row};
      // this.open=true;
      const id = row.id || this.ids;
      getAccountDetail({ id: id }).then((response) => {
        this.form = response.data;
        this.form.fundAccountTypeEnum = response.data.fundAccountTypeEnum.Name;
        this.open = true;
        this.title = "修改资金账户";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let res = this.form.id
            ? await editAccount(this.form)
            : await addAccount(this.form);
          if (res) {
            this.$modal.msgSuccess(res.message);
            this.open = false;
            this.getList();
          }
        }
      });
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   this.download(
    //     "system/dict/type/export",
    //     {
    //       ...this.queryParams,
    //     },
    //     `type_${new Date().getTime()}.xlsx`
    //   );
    // },
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
