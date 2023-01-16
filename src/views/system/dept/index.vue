<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="组织名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入组织名称"
          clearable
          @keyup.enter.native="filterList"
        />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="frozen">
        <el-select
          v-model="queryParams.frozen"
          placeholder="冻结状态"
          clearable
          @change="filterList"
        >
          <el-option label="已冻结" :value="true"></el-option>
          <el-option label="未冻结" :value="false"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="filterList"
          v-hasPermi="['system:dept:query']"
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
          v-hasPermi="['system:dept:add']"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="name"
        label="组织名称"
        width="260"
      ></el-table-column>
      <el-table-column prop="no" label="排序" width="200"></el-table-column>
      <el-table-column prop="frozen" label="状态" width="100">
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
        label="创建时间"
        align="center"
        prop="createTime"
        width="200"
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
            v-hasPermi="['system:dept:edit']"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            v-hasPermi="['system:dept:add']"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['system:dept:remove']"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入组织名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="no">
              <el-input-number
                v-model="form.no"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="冻结状态">
              <el-radio-group v-model="form.frozen">
                <el-radio :label="true">已冻结</el-radio>
                <el-radio :label="false">未冻结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild,
  treeselect,
  changeFrozen,
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 原始第一遍数据
      oldList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: "",
        frozen: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级组织不能为空", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "组织名称不能为空", trigger: "blur" },
        ],
        no: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    // this.$modal
    this.getList();
    // this.$modal.confirm("123").then(res=>{
    //   console.log(123);
    // });
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then((response) => {
        this.deptList = response.data;
        this.oldList = response.data;
        this.loading = false;
      });
    },
    filterList() {
      let arr = this.filterTree(this.oldList, this.queryParams);
      this.deptList = arr;
    },
    filterTree(arr, keyword) {
      let emptyArr = [];
      for (let item of arr) {
        if (item.name.includes(keyword.name)) {
          if (
            item.children &&
            Array.isArray(item.children) &&
            item.children.length > 0
          ) {
            item.children = this.filterTree(item.children, keyword);
          }
          emptyArr.push(item);
        } else if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0
        ) {
          item.children = this.filterTree(item.children, keyword);
          if (item.children.length) {
            emptyArr.push(item);
          }
        }
      }
      return emptyArr;
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        frozen: false,
        name: "",
        no: 0,
        parentId: "",
        remark: "",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    // 获取树结构
    getTreeSelect() {
      treeselect().then((res) => {
        this.deptOptions = res.data;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 在表格中切换冻结状态
    handleStatusChange(row) {
      changeFrozen(row.id).then((res) => {
        this.$modal.msgSuccess("操作成功！");
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加部门";
      this.getTreeSelect();
      // listDept().then((response) => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      // });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.id).then((response) => {
        this.form = response.data;
        if (response.data.parentId == 0) {
          this.form.parentId = undefined;
        }
        this.getTreeSelect();
        this.open = true;
        this.title = "修改部门";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDept(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除名称为"' + row.name + '"的数据项？')
        .then(function () {
          return delDept(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
