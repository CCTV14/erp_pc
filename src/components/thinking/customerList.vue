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
      <el-form-item label="编号" prop="customerNo">
        <el-input
          v-model="params.customerNo"
          style="width: 120px"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="customerName">
        <el-input
          v-model="params.customerName"
          style="width: 120px"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber">
        <el-input
          v-model="params.phoneNumber"
          style="width: 120px"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="params.address"
          style="width: 120px"
          placeholder="请输入地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="params.remark"
          style="width: 120px"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户类型" prop="customerTypeEnum">
        <el-select
          v-model="params.customerTypeEnum"
          style="width: 120px"
          placeholder="请选择客户类型"
          clearable
        >
          <el-option label="毛坯" value="1"></el-option>
          <el-option label="水电" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户分组" prop="customerGroupEnum">
        <el-select
          v-model="params.customerGroupEnum"
          style="width: 120px"
          collapse-tags
          multiple
          placeholder="请选择分组"
          clearable
        >
          <el-option label="全部分组" value=""></el-option>
          <el-option label="已启用" value="0"></el-option>
          <el-option label="未启用" value="1"></el-option>
          <el-option label="成交" value="2"></el-option>
          <el-option label="流失" value="3"></el-option>
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
    <el-table
      v-loading="loading"
      :data="tableData"
      :cell-style="$thinking.getCellFontColor"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="编号"
        align="center"
        prop="customerNo"
        width="120"
      />
      <el-table-column label="客户姓名" align="center" prop="customerName" />
      <el-table-column label="当前余额" align="center" sortable width="100">
        <template slot-scope="scope">
          <span>￥{{ scope.row.price | thousandSymbol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" align="center" prop="phoneNumber" />
      <el-table-column
        label="客户类型"
        align="center"
        prop="customerTypeEnum"
      />
      <el-table-column label="客户地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="当前跟进人" align="center" prop="floowName" />
      <el-table-column label="创建信息" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createName + " " + scope.row.createTime }}</span>
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
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:dict:edit']">修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-hasPermi="['system:dict:detail']"
            >查看</el-button
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
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  refreshCache,
} from "@/api/system/dict/type";

export default {
  name: "Purchase",
  dicts: ["sys_normal_disable"],
  data() {
    return {
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层 新增/编辑框
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      params: {
        pageNum: 1,
        pageSize: 10,
        customerNo: "",
        customerTypeEnum: "",
        customerGroupEnum: "",
        minBalance: "",
        maxBalance: "",
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
    // this.getList(); 暂
    this.tableData = [
      {
        id: "1",
        customerNo: "KH-220419001",
        customerName: "李小宝",
        price: 13358.2,
        phoneNumber: "13020308798",
        customerTypeEnum: "水电",
        address: "河北省保定市…",
        remark: "测试备注",
        floowName: "张英",
        createName: "人员",
        createTime: "2022-02-20 12:33:00",
      },
    ];
    this.total = 1;
    this.loading = false;
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.params, this.dateRange)).then(
        (response) => {
          this.tableData = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
    // 选择查询日期
    selectQueryDate(val) {
      this.params.minCreateDate = val[0];
      this.params.maxCreateDate = val[1];
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.pageNum = 1;
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
        name: "customer-detail",
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
