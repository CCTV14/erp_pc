<template>
  <div>
    <router-view></router-view>
    <div class="app-container" v-show="$route.meta.showRole">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item
          label="字典名称"
          prop="quickSearchInfoList[0].quickSearchValue"
        >
          <el-input
            v-model="queryParams.quickSearchInfoList[0].quickSearchValue"
            placeholder="请输入字典名称"
            clearable
            style="width: 240px"
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
            v-hasPermi="['system:dict:query']"
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
          >修改</el-button
        >
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
          >删除</el-button
        >
      </el-col> -->
        <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          v-hasPermi="['system:dict:remove']"
          >刷新缓存</el-button
        >
      </el-col> -->
        <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>

      <el-table v-loading="loading" :data="typeList">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="字典编号" align="center" prop="no" />
        <el-table-column
          label="字典名称"
          align="center"
          prop="name"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="字典类型"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: '/dict-detail',
                query: { id: scope.row.id, code: scope.row.code },
              }"
              class="link-type"
            >
              <span>{{ scope.row.code }}</span>
            </router-link>
          </template>
        </el-table-column>
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
        :page.sync="queryParams.pageInfo.page"
        :limit.sync="queryParams.pageInfo.pageSize"
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
          <el-form-item label="字典名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入字典名称" />
          </el-form-item>
          <el-form-item label="字典类型" prop="code">
            <el-input v-model="form.code" placeholder="请输入字典类型" />
          </el-form-item>
          <el-form-item label="字典编号" prop="no">
            <el-input-number
              v-model="form.no"
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="冻结状态" prop="frozen">
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
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  changeFrozen,
} from "@/api/system/dict/type";

export default {
  name: "Dict",
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        frozen: null,
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
      showRole: true,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    $route(val) {
      console.log(val.meta.showRole);
      this.showRole = val.meta.showRole;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then((response) => {
        this.typeList = response.data;
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
        name: "",
        code: "",
        no: undefined,
        frozen: false,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.page = 1;
      this.getList();
    },
    // 角色状态修改
    handleStatusChange(row) {
      changeFrozen(row.id).then((res) => {
        this.$modal.msgSuccess("操作成功！");
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.id;
      console.log(dictId);
      getType(dictId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典类型";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
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
      const dictIds = row.id;
      this.$modal
        .confirm('是否确认删除字典名称为"' + row.name + '"的数据项？')
        .then(function () {
          return delType(dictIds);
        })
        .then((res) => {
          if (res.success) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }
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
