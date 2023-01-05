<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冻结状态" prop="frozen">
        <el-select
          v-model="queryParams.frozen"
          placeholder="请选择冻结状态"
          clearable
          @change="handleQuery"
        >
          <el-option label="已冻结" :value="true"></el-option>
          <el-option label="未冻结" :value="false"></el-option>
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
          v-hasPermi="['system:dict:add']"
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
          v-hasPermi="['system:dict:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dict:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
        >导出</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
          >关闭</el-button
        >
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="字典编码" align="center" prop="no" /> -->
      <el-table-column label="字典标签" align="center" prop="code" />
      <el-table-column label="字典键值" align="center" prop="value" />
      <el-table-column label="字典排序" align="center" prop="no" />
      <el-table-column label="冻结状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.frozen"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
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
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="dictCode" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="code">
          <el-input v-model="form.code" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="value">
          <el-input v-model="form.value" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="no">
          <el-input-number
            v-model="form.no"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态" prop="frozen">
          <el-radio-group v-model="form.frozen">
            <el-radio :label="true">已冻结</el-radio>
            <el-radio :label="false">未冻结</el-radio>
          </el-radio-group>
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
  listData,
  getData,
  delData,
  addData,
  updateData,
  changeFrozen,
} from "@/api/system/dict/data";

export default {
  name: "Data",
  data() {
    return {
      // dictId
      dictId: "",
      // dictCode
      dictCode: "",
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
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        frozen: null,
        dataDictId: "",
        pageInfo: {
          page: 0,
          pageSize: 0,
        },
        quickSearchInfoList: [
          {
            columns: ["code", "name", "remark"],
            quickSearchValue: "",
          },
        ],
        sortInfo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "数据标签不能为空", trigger: "blur" },
        ],
        value: [
          { required: true, message: "数据键值不能为空", trigger: "blur" },
        ],
        no: [{ required: true, message: "数据顺序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    let obj = this.$route.query;
    this.dictId = obj.id;
    this.dictCode = obj.code;
    this.queryParams.dataDictId = this.dictId;
    // this.getType(dictId);
    this.getList();
  },
  methods: {
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then((response) => {
        this.dataList = response.data;
        this.total = response.total;
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
        code: "",
        dataDictId: this.dictId,
        frozen: false,
        no: 0,
        remark: "",
        value: "",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.page = 1;
      this.getList();
    },
    /** 返回按钮操作 */
    handleClose() {
      const obj = { path: "/dict" };
      this.$tab.closeOpenPage(obj);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dataDictId = this.dictId;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      // this.dictType = this.queryParams.dictType;
    },
    // 角色状态修改
    handleStatusChange(row) {
      changeFrozen(row.id).then((res) => {
        this.$modal.msgSuccess("操作成功！");
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.id || this.ids;
      getData(ids).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典数据";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateData(this.form).then((response) => {
              // this.$store.dispatch(
              //   "dict/removeDict",
              //   this.queryParams.dictType
              // );
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addData(this.form).then((response) => {
              // this.$store.dispatch(
              //   "dict/removeDict",
              //   this.queryParams.dictType
              // );
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
      const dictCodes = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除数据标签为"' + row.code + '"的数据项？')
        .then(function () {
          return delData(dictCodes);
        })
        .then((res) => {
          if (res.success) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
          // this.$store.dispatch("dict/removeDict", this.queryParams.dictType);
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/dict/data/export",
        {
          ...this.queryParams,
        },
        `data_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
