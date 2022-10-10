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
      <el-form-item label="邮箱" prop="quickSearchInfoList[3].quickSearchValue">
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
        <el-select v-model="params.frozen" placeholder="请选择状态" clearable>
          <!-- <el-option label="全部" value=""></el-option> -->
          <el-option label="未冻结" :value="false"></el-option>
          <el-option label="已冻结" :value="true"></el-option>
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
      <el-col :span="1.5">
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
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column
        label="用户身份"
        align="center"
        prop="userTypeEnum.Desc"
      />
      <el-table-column label="手机号码" align="center" prop="phoneNumber" />
      <el-table-column
        label="邮箱地址"
        align="center"
        prop="mailAddress"
        width="180"
      />
      <el-table-column label="账号状态" align="center">
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
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!--   v-hasPermi="['system:user:edit']" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <!--   v-hasPermi="['system:dict:edit']" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="userDetailVisble = true"
            >查看</el-button
          >
          <el-popover placement="top" width="160" v-model="resetPasswordVisble">
            <p>即将重置用户密码，是否继续？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="resetPasswordVisble = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="resetPasswordVisble = false"
                >确定</el-button
              >
            </div>
            <!--     v-hasPermi="['system:dict:edit']" -->
            <el-button
              size="mini"
              type="text"
              slot="reference"
              icon="el-icon-refresh"
              >重置密码</el-button
            >
          </el-popover>
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
      :page.sync="params.pageInfo.page"
      :limit.sync="params.pageInfo.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="身份" v-if="form.id">
          <span>员工</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="冻结状态" v-if="form.id">
          <el-switch
            v-model="form.status"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
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
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-tag type="success">员工</el-tag> <span>测试用户</span>
        </el-form-item>
        <el-form-item label="手机号码">
          <span>188372829292</span>
        </el-form-item>
        <el-form-item label="身份">
          <span>员工</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>2052131@qq.com</span>
        </el-form-item>
        <el-form-item label="我的权限">
          <span>暂未分配权限组</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>2021-12-13 22:20:16</span>
        </el-form-item>
        <el-form-item label="冻结账号">
          <span style="color: red">已冻结</span>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  getUserTypeEnumListSync,
  getUserList,
} from "@/api/vehicle-monitoring/user.js";

export default {
  name: "Dict",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      // 排序方式名称
      sortName: "",
      userDetailVisble: false,
      // 重置密码框
      resetPasswordVisble: false,
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
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
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
        this.title = "修改用户";
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
