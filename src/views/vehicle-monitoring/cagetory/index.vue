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
      <el-form-item
        label="分类名称"
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
      <el-form-item label="备注" prop="quickSearchInfoList[2].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          style="width: 240px"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冻结状态" prop="frozen">
        <el-select
          v-model="params.frozen"
          style="width: 240px"
          placeholder="请选择状态"
          clearable
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
          style="width: 240px"
          placeholder="请选择排序方式"
          clearable
          @change="selectSortType"
        >
          <el-option label="名称正序 [默认]" value=""></el-option>
          <el-option label="名称倒序" :value="1"></el-option>
          <el-option label="最晚创建" :value="2"></el-option>
          <el-option label="最早创建" :value="3"></el-option>
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
          v-hasPermi="['system:account:add']"
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
          v-hasPermi="['system:account:edit']"
          >修改</el-button
        >
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="备注" align="center" prop="remark" />
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
      <el-table-column label="制单信息" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.creator.name + " " + scope.row.createTime }}</span>
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
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleFrozen(scope.row)"
            >{{scope.row.frozen ? "解冻" : "冻结"}}</el-button
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="冻结状态" prop="frozen" v-if="form.id">
          <el-switch
            v-model="form.frozen"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="创建信息" v-if="form.id">
          <span>{{ form.creator.name + " " + form.createTime }}</span>
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
  getCategoryData,
  addCommodityCategory,
  editCommodityCategory,
  getCommodityCategoryDetail,
  changeCommodityCategoryFrozenStatus
} from "@/api/vehicle-monitoring/commodity.js";

export default {
  name: "Cagetory",
  // dicts: ["sys_normal_disable"],
  filters: {
    getAccountType(val) {
      if (val == "Cash") {
        return "微信钱包";
      }
    },
  },
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
            columns: ["name", "remark"],
            quickSearchValue: null,
          },
          {
            columns: ["name"],
            quickSearchValue: null,
          },
          {
            columns: ["remark"],
            quickSearchValue: null,
          },
        ],
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
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getCategoryData(this.params).then((response) => {
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
      this.form = {
        id: "",
        frozen: false,
        remark: "",
      };
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
          columnName: "createTime",
          order: "DESC",
        },
        3: {
          columnName: "createTime",
          order: "ASC",
        },
      };

      this.params.sortInfo = data[val] || null;
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
      this.title = "添加商品分类";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        name: "account-detail",
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.form = {...row};
      // this.open=true;
      const id = row.id || this.ids;
      getCommodityCategoryDetail({ id: id }).then((response) => {
        // this.form = {...response.data,...{id:response.data.dictId}};
        this.form = response.data;
        this.open = true;
        this.title = "修改商品分类";
      });
    },
    // 冻结
    handleFrozen(row) {
      let text = row.frozen ? "解冻" : "冻结";
      this.$modal
        .confirm('是否确认' + text)
        .then(async () => {
          let res = await changeCommodityCategoryFrozenStatus({ id: row.id });
          if (res) {
            this.getList();
            this.$modal.msgSuccess(text + "成功");
          }
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let res = this.form.id
            ? await editCommodityCategory(this.form)
            : await addCommodityCategory(this.form);
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
