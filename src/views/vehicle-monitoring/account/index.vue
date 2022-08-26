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
      <el-form-item label="名称">
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账户">
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          placeholder="请输入账户"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="params.quickSearchInfoList[3].quickSearchValue"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="params.fundAccountTypeEnum"
          placeholder="请选择类型"
          clearable
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
      <el-form-item label="冻结状态">
        <el-select
          v-model="params.frozen"
          placeholder="请选择状态"
          clearable
        >
          <!-- <el-option label="全部" value=""></el-option> -->
          <el-option label="未冻结" :value="false"></el-option>
          <el-option label="已冻结" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序方式">
        <el-select
          v-model="sortName"
          placeholder="请选择排序方式"
          clearable
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

    <el-table
      v-loading="loading"
      :data="tableData"
      :cell-style="$thinking.getCellFontColor"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
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
          <span style="color: #378df5">{{
            scope.row.totalInflowAmount | thousandSymbol
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户累计流出" align="center">
        <template slot-scope="scope">
          <span style="color: #ff964e">{{
            scope.row.totalOutflowAmount | thousandSymbol
          }}</span>
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
        width="120"
        class-name="small-padding fixed-width"
      >
        <!--             v-hasPermi="['system:dict:edit']" -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户编号" v-if="form.id">
          <span>{{ form.customerNo }}</span>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="当前余额" v-if="form.id">
          <span>{{ form.balanceAmount }}</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户分组" prop="customerGroupEnum">
          <el-select
            v-model="form.customerGroupEnum"
            style="width: 100%"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="成交" value="1"></el-option>
            <el-option label="流失" value="0"></el-option>
            <el-option label="支付宝账户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerTypeEnum">
          <el-select
            v-model="form.customerTypeEnum"
            style="width: 100%"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="成交" value="1"></el-option>
            <el-option label="流失" value="0"></el-option>
            <el-option label="支付宝账户" value="1"></el-option>
          </el-select>
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
</template>

<script>
import {
  getFundAccountTypeEnumList,
  getAccountData,
} from "@/api/vehicle-monitoring/user.js";

export default {
  name: "Purchase",
  dicts: ["sys_normal_disable"],
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
            columnName: "name",
            order: "DESC",
          };
          break;
        case 2:
          this.params.sortInfo = {
            columnName: "balanceAmount",
            order: "ASC",
          };
          break;
        case 3:
          this.params.sortInfo = {
            columnName: "balanceAmount",
            order: "DESC",
          };
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
      this.params.minOrderAmount = "";
      this.params.maxOrderAmount = "";
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
        name: "floow-record-detail",
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
        this.title = "修改客户";
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
        .confirm('是否确认删除客户id为"' + ids + '"的数据项？')
        .then(function () {
          return delType(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
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
