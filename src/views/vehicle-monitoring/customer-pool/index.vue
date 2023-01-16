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
        label="客户编号"
        prop="quickSearchInfoList[1].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="客户姓名"
        prop="quickSearchInfoList[2].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="联系方式"
        prop="quickSearchInfoList[3].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[3].quickSearchValue"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="跟进内容"
        prop="quickSearchInfoList[4].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[4].quickSearchValue"
          placeholder="请输入跟进内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户分组" prop="customerGroupEnum">
        <el-select
          v-model="params.customerGroupEnum"
          placeholder="请选择分组"
          clearable
        >
          <el-option
            v-for="(item, index) in customerGroupEnumList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型" prop="customerTypeEnum">
        <el-select
          v-model="params.customerTypeEnum"
          placeholder="请选择客户类型"
          clearable
        >
          <el-option
            v-for="(item, index) in customerTypeEnumList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序方式" prop="sortInfo">
        <el-select
          v-model="sortName"
          placeholder="请选择排序方式"
          clearable
          @change="selectSortType"
        >
          <el-option label="最近添加 [默认]" value=""></el-option>
          <el-option label="最早添加" :value="1"></el-option>
          <el-option label="客户编号倒序" :value="2"></el-option>
          <el-option label="客户编号正序" :value="3"></el-option>
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
        <!--           v-hasPermi="['system:purchase:add']" -->
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column
        label="编号"
        align="center"
        prop="customer.customerNo"
        width="120"
      />
      <el-table-column label="客户姓名" align="center" prop="customer.name" />
      <el-table-column
        label="客户分组"
        align="center"
        prop="customer.customerGroupEnum.Desc"
      />
      <el-table-column
        label="客户类型"
        align="center"
        prop="customer.customerTypeEnum.Desc"
      />
      <el-table-column label="类型" align="center" width="140">
        <template slot-scope="scope">
          <el-tag
            class="ml10"
            :type="
              scope.row.customerPoolSourceEnum.Name === 'AddNew'
                ? 'danger'
                : 'success'
            "
            disable-transitions
            >{{ scope.row.customerPoolSourceEnum.Desc }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="跟进内容"
        align="center"
        prop="content"
        width="300"
        show-overflow-tooltip
      />
      <el-table-column
        label="添加时间"
        align="center"
        prop="createTime"
        width="180"
      />
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
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >认领</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >分配</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 新增 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户" prop="customerId">
          <div @click="selectCustomerVisble = true">
            <el-input
              placeholder="请选择客户"
              suffix-icon="el-icon-arrow-right"
              v-model="customer.customerName"
              readonly
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="跟进内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入跟进内容" />
        </el-form-item>
        <el-form-item label="添加方式">
          <el-radio-group v-model="addDefaultType">
            <el-radio label="Pool">添加至公海池</el-radio>
            <el-radio label="User">分配给用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="跟进用户"
          prop="userId"
          v-if="addDefaultType == 'User'"
        >
          <div @click="selectUserVisble = true">
            <el-input
              placeholder="请选择跟进用户"
              suffix-icon="el-icon-arrow-right"
              v-model="customer.userName"
              readonly
            >
            </el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormAdd">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      :title="title"
      :visible.sync="openEdit"
      width="500px"
      append-to-body
    >
      <el-form
        ref="formEdit"
        :model="postForm"
        :rules="rulesEdit"
        label-width="80px"
      >
        <el-form-item label="公海池来源">
          <div>{{ postForm.customerPoolSourceEnum.Desc }}</div>
        </el-form-item>
        <el-form-item label="客户编号">
          <div>{{ postForm.customer.customerNo }}</div>
        </el-form-item>
        <el-form-item label="客户姓名">
          <div>{{ postForm.customer.customerNo }}</div>
        </el-form-item>
        <el-form-item label="客户电话">
          <div>{{ postForm.customer.customerNo }}</div>
        </el-form-item>
        <el-form-item label="跟进内容" prop="content">
          <el-input v-model="postForm.content" placeholder="请输入跟进内容" />
        </el-form-item>
        <el-form-item label="添加时间">
          <div>{{ postForm.createTime }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormEdit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="此页面仅显示可以添加至公海池的客户！"
      :visible.sync="selectCustomerVisble"
      direction="rtl"
      size="70%"
    >
      <customer-list @handleSelectCustomer="handleSelectCustomer" />
    </el-drawer>
    <!--  -->
    <el-drawer
      title="此页面仅显示可以添加至公海池的用户！"
      :visible.sync="selectUserVisble"
      direction="rtl"
      size="70%"
    >
      <user-list @handleSelectUser="handleSelectUser" />
    </el-drawer>
  </div>
</template>

<script>
import {
  getCustomerPoolData,
  getCustomerGroupEnumList,
  getCustomerTypeEnumList,
  customerPoolAddCustomerToPool,
  customerPoolDistributeCustomerToUser,
  customerPoolFindById,
  customerPoolUpdateCustomerPool,
} from "@/api/vehicle-monitoring/customer";
import customerList from "@/components/thinking/customerList";
import userList from "@/components/thinking/userList";
export default {
  name: "Purchase",
  data() {
    return {
      // 排序方式名称
      sortName: "",
      // 选择客户抽屉显示
      selectCustomerVisble: false,
      // 选择跟进用户抽屉显示
      selectUserVisble: false,
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
      // 客户分组数据
      customerGroupEnumList: [],
      // 客户类型数据
      customerTypeEnumList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层 新增
      open: false,
      // 是否显示弹出层 编辑
      openEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      params: {
        quickSearchInfoList: [
          {
            columns: [
              "customer.customerNo",
              "customer.name",
              "customer.phoneNumber",
              "content",
            ],
            quickSearchValue: null,
          },
          {
            columns: ["customerNo"],
            quickSearchValue: null,
          },
          {
            columns: ["customerName"],
            quickSearchValue: null,
          },
          {
            columns: ["customerPhoneNumber"],
            quickSearchValue: null,
          },
          {
            columns: ["content"],
            quickSearchValue: null,
          },
        ],
        customerPoolSourceEnum: null,
        customerTypeEnum: null,
        customerGroupEnum: null,
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
        sortInfo: null,
      },
      postForm: {
        customerId: "",
        customerPoolSourceEnum: {
          Desc: "",
        },
        customer: {},
      },
      // 表单参数
      form: {
        customerId: "",
        customerPoolSourceEnum: {
          Desc: "",
        },
        customer: {},
      },
      customer: {
        customerName: "",
        userName: "",
      },
      addDefaultType: "Pool",
      rulesEdit: {
        content: {
          type: "string",
          required: true,
          message: "请输入跟进内容",
          trigger: ["blur", "change"],
        },
      },
      // 表单校验
      rules: {
        customerId: {
          type: "string",
          required: true,
          message: "请选择客户",
          trigger: ["blur", "change"],
        },
        content: {
          type: "string",
          required: true,
          message: "请输入跟进内容",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  components: {
    customerList,
    userList,
  },
  created() {
    this.getList();
    this.getCustomerGroupEnumList();
    this.getCustomerTypeEnumList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getCustomerPoolData(this.params).then((response) => {
        this.tableData = response.data;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 获取客户分组
    getCustomerGroupEnumList() {
      getCustomerGroupEnumList().then((res) => {
        this.customerGroupEnumList = res.data;
      });
    },
    // 获取客户类型
    getCustomerTypeEnumList() {
      getCustomerTypeEnumList().then((res) => {
        this.customerTypeEnumList = res.data;
      });
    },
    // 选择客户
    selectCustomer() {},
    // 取消按钮
    cancel() {
      this.open = false;
      this.openEdit = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.addDefaultType = "Pool";
      this.form = {};
      this.resetForm("form");
    },
    // 选择排序下拉框值
    selectSortType(val) {
      let data = {
        1: {
          columnName: "createTime",
          order: "ASC",
        },
        2: {
          columnName: "customer.customerNo",
          order: "DESC",
        },
        3: {
          columnName: "customer.customerNo",
          order: "ASC",
        },
      };

      this.params.sortInfo = data[val] || null;
      this.handleQuery();
    },
    // 选择客户
    handleSelectCustomer(row) {
      this.form.customerId = row.id;
      this.customer.customerName = row.name;
      this.selectCustomerVisble = false;
    },
    // 选择用户
    handleSelectUser(row) {
      this.form.userId = row.id;
      this.customer.userName = row.name;
      this.selectUserVisble = false;
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
      for (const w in this.customer) {
        this.customer[w] = "";
      }
      this.title = "添加公海池客户";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        name: "customer-detail",
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.form = {...row};
      // this.open=true;
      const id = row.id || this.ids;
      customerPoolFindById({ id: id }).then((response) => {
        this.postForm = response.data;
        this.form.customerId = response.data.customerId;
        this.customer.customerName = response.data.customer.name;
        this.form.content = response.data.content;
        this.open = true;
        this.title = "修改公海池客户";
      });
    },
    /** 提交按钮新增 */
    submitFormAdd: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.addDefaultType === "Pool") {
            customerPoolAddCustomerToPool(this.form).then((res) => {
              if (res.success) {
                this.$modal.msgSuccess(res.message);
              }
            });
          } else {
            customerPoolDistributeCustomerToUser(this.form).then((res) => {
              if (res.success) {
                this.$modal.msgSuccess(res.message);
              }
            });
          }
        }
      });
    },
    /** 提交按钮修改 */
    submitFormEdit: function () {
      this.$refs["formEdit"].validate((valid) => {
        if (valid) {
          //  修改
          customerPoolUpdateCustomerPool(this.postForm).then((res) => {
            if (res.success) {
              this.$modal.msgSuccess(res.message);
            }
          });
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
