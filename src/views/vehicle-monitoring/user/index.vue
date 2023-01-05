<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--组织数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入组织名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form
          :model="params"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item
            label="用户姓名"
            prop="quickSearchInfoList[1].quickSearchValue"
          >
            <el-input
              v-model="params.quickSearchInfoList[1].quickSearchValue"
              placeholder="请输入用户姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="手机号码"
            prop="quickSearchInfoList[2].quickSearchValue"
          >
            <el-input
              v-model="params.quickSearchInfoList[2].quickSearchValue"
              placeholder="请输入手机号码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="quickSearchInfoList[3].quickSearchValue"
          >
            <el-input
              v-model="params.quickSearchInfoList[3].quickSearchValue"
              placeholder="请输入邮箱"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="排序方式" prop="sortInfo">
            <el-select
              v-model="sortName"
              placeholder="请选择排序方式"
              clearable
              @change="selectSortType"
            >
              <el-option label="姓名正序 [默认]" value=""></el-option>
              <el-option label="姓名倒序" :value="1"></el-option>
              <el-option label="手机号正序" :value="2"></el-option>
              <el-option label="手机号倒序" :value="3"></el-option>
              <el-option label="最早创建" :value="4"></el-option>
              <el-option label="最近创建" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户身份" prop="userTypeEnum">
            <el-select
              v-model="params.userTypeEnum"
              placeholder="请选择用户身份"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="(item, index) in userTypeEnumList"
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
              @change="handleQuery"
            >
              <!-- <el-option label="全部" value=""></el-option> -->
              <el-option label="未冻结" :value="false"></el-option>
              <el-option label="已冻结" :value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="flex-end">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              v-hasPermi="['system:user:query']"
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
              v-hasPermi="['system:user:add']"
              >新增</el-button
            >
          </el-col>
          <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
        <el-table
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column
            label="姓名"
            align="center"
            prop="name"
            width="120"
          />
          <el-table-column
            label="用户身份"
            align="center"
            prop="userTypeEnum.Desc"
          />
          <el-table-column
            label="手机号码"
            align="center"
            prop="phoneNumber"
            width="110"
          />
          <el-table-column
            label="邮箱地址"
            align="center"
            prop="mailAddress"
            width="180"
          />
          <el-table-column label="冻结状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.frozen"
                :active-value="true"
                :inactive-value="false"
                @change="handleStatusChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
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
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-hasPermi="['system:user:edit']"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="userDetail(scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="text"
                v-hasPermi="['system:user:refresh']"
                @click="handleReloadPassword(scope.row)"
                icon="el-icon-refresh"
                >重置密码</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="身份" v-if="form.id">
          <span>员工</span>
        </el-form-item>
        <el-form-item label="归属部门" prop="organizationId">
          <treeselect
            v-model="form.organizationId"
            :options="deptOptions"
            :show-count="true"
            :normalizer="normalizer"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label="角色" prop="sysRoleIdList">
          <el-select
            v-model="form.sysRoleIdList"
            multiple
            filterable
            style="width: 100%"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="mailAddress">
          <el-input v-model="form.mailAddress" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="冻结状态">
          <el-radio-group v-model="form.frozen">
            <el-radio :label="true">已冻结</el-radio>
            <el-radio :label="false">未冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户详细 -->
    <el-drawer
      title="用户信息"
      :modal="true"
      :visible.sync="userDetailVisble"
      direction="rtl"
    >
      <el-form ref="detailForm" :model="detailForm" label-width="90px">
        <el-form-item label="姓名">
          <!--    <el-tag type="success">{{form.userTypeEnum.Desc}}</el-tag>  -->
          <span>{{ detailForm.name }}</span>
        </el-form-item>
        <el-form-item label="手机号码">
          <span>{{ detailForm.phoneNumber }}</span>
        </el-form-item>
        <el-form-item label="身份">
          <span>{{ detailForm.userTypeEnum.Desc }}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{ detailForm.mailAddress }}</span>
        </el-form-item>
        <el-form-item label="我的权限">
          <span>暂未分配权限组</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ detailForm.createTime }}</span>
        </el-form-item>
        <el-form-item label="冻结账号">
          <span
            :style="{ color: !detailForm.frozen ? 'green' : 'red' }"
            class="swTxt"
            >{{ !detailForm.frozen ? "未冻结" : "已冻结" }}</span
          >
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  getUserTypeEnumListSync,
  getUser,
  updateUser,
  addUser,
  getUserList,
  changeFrozen,
  resetPassword
} from "@/api/vehicle-monitoring/user.js";
import { listSelectRole, getRoleByUserId } from "@/api/system/role.js";
import { listSelectDept } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dict",
  // dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      // 组织树选项
      deptOptions: undefined,
      // 组织名称
      deptName: undefined,
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 角色选项
      roleOptions: [],
      // 排序方式名称
      sortName: "",
      userDetailVisble: false,
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
      // 用户类型列表
      userTypeEnumList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      params: {
        quickSearchInfoList: [
          {
            columns: ["name", "phoneNumber", "mailAddress"],
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
            columns: ["mailAddress"],
            quickSearchValue: null,
          },
        ],
        userTypeEnum: null,
        organizationIdList: [],
        frozen: null,
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
        sortInfo: null,
      },
      detailForm: {
        userTypeEnum: {
          Desc: "",
        },
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
        ],
        mailAddress: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
        ],
        organizationId: [
          { required: true, message: "请选择所属组织", trigger: "blur" },
        ],
        sysRoleIdList: [
          { required: true, message: "请选择所属角色", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.getSelectRoles();
    this.getUserTypeEnumListSync();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getUserList(this.params).then((response) => {
        this.tableData = response.data;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 获取可选角色
    getSelectRoles() {
      listSelectRole({
        frozen: false,
        pageInfo: {
          page: 0,
          pageSize: 0,
        },
        quickSearchInfoList: [
          {
            columns: ["name", "code", "remark"],
            quickSearchValue: "",
          },
        ],
        sortInfo: null,
      }).then((res) => {
        this.roleOptions = res.data;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      listSelectDept().then((response) => {
        this.deptOptions = response.data;
      });
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
    userDetail(row) {
      this.detailForm = { ...row };
      this.userDetailVisble = true;
    },
    // 获取用户类型列表
    getUserTypeEnumListSync() {
      getUserTypeEnumListSync().then((res) => {
        this.userTypeEnumList = res.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 用户状态修改
    handleStatusChange(row) {
      changeFrozen(row.id).then((res) => {
        this.$modal.msgSuccess("操作成功！");
      });
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
            columnName: "phoneNumber",
            order: "ASC",
          };
          break;
        case 3:
          this.params.sortInfo = {
            columnName: "phoneNumber",
            order: "DESC",
          };
          break;
        case 4:
          this.params.sortInfo = {
            columnName: "createTime",
            order: "ASC",
          };
          break;
        case 5:
          this.params.sortInfo = {
            columnName: "createTime",
            order: "DESC",
          };
          break;
        default:
          this.params.sortInfo = null;
          break;
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.params.organizationIdList = [data.id];
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.form = {
        id: "",
        name: "",
        phoneNumber: "",
        mailAddress: "",
        organizationId: undefined,
        sysRoleIdList: [],
        frozen: false,
      };
      this.resetForm("form");
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
      this.title = "添加用户";
    },
    //
    handleReloadPassword(row) {
      const ids = row.id;
      this.$modal
        .confirm("是否确认重置该用户的密码？")
        .then(function () {
          return resetPassword(ids);
        })
        .then((res) => {
          if (res.success) {
            this.getList();
            this.$modal.alertSuccess(res.message);
          }
        })
        .catch(() => {});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id;
      let user = await getUser(id);
      let role = await getRoleByUserId(id);
      if (user) {
        this.form = { ...user.data };
        this.open = true;
        this.title = "修改用户";
      }
      if (role) {
        this.form.sysRoleIdList = role.data.map((item) => {
          return item.id;
        });
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess(response.message);
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess(response.message);
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
