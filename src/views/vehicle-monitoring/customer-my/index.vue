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
      <el-form-item label="编号" prop="quickSearchInfoList[1].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          style="width: 240px"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="quickSearchInfoList[2].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          style="width: 240px"
          placeholder="请输入客户名称"
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
          style="width: 240px"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="quickSearchInfoList[4].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[4].quickSearchValue"
          style="width: 240px"
          placeholder="请输入地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="quickSearchInfoList[5].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[5].quickSearchValue"
          style="width: 240px"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="跟进内容"
        prop="quickSearchInfoList[6].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[6].quickSearchValue"
          style="width: 240px"
          placeholder="请输入跟进内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户分组" prop="customerGroupEnum">
        <el-select
          v-model="params.customerGroupEnum"
          style="width: 240px"
          placeholder="请选择分组"
          clearable
          @change="handleQuery"
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
          style="width: 240px"
          placeholder="请选择客户类型"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in customerTypeEnumList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进状态" prop="customerFollowUpStatusEnum">
        <el-select
          v-model="params.customerFollowUpStatusEnum"
          style="width: 240px"
          placeholder="请选择客户跟进状态"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in customerFloowStatusList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
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
          <el-option label="最近跟进时间倒序 [默认]" value=""></el-option>
          <el-option label="预计下次跟进时间正序" :value="1"></el-option>
          <el-option label="开始跟进时间正序" :value="2"></el-option>
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
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:purchase:edit']"
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
          v-hasPermi="['system:purchase:remove']"
          >删除</el-button
        > -->
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      :cell-style="$thinking.getCellFontColor"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="编号"
        align="center"
        prop="customer.customerNo"
        width="120"
      />
      <el-table-column
        label="客户姓名"
        align="center"
        prop="customer.name"
        width="120"
      />
      <el-table-column
        label="客户电话"
        align="center"
        width="160"
        prop="customer.phoneNumber"
      />
      <el-table-column
        label="客户类型"
        align="center"
        prop="customer.customerTypeEnum.Desc"
      />
      <el-table-column
        label="客户分组"
        align="center"
        prop="customer.customerGroupEnum.Desc"
      />
      <el-table-column label="状态" align="center" width="160">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.customerFollowUpStatusEnum.Name == 'Following'
                ? 'primary'
                : 'danger'
            "
            disable-transitions
            >{{ scope.row.customerFollowUpStatusEnum.Desc }}</el-tag
          >
          <el-tag
            class="ml10"
            v-if="timedOut(scope.row)"
            type="danger"
            disable-transitions
            >已超时</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="跟进内容"
        align="center"
        prop="followUpContent"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column label="最近跟进时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.lastFollowUpTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!--             v-hasPermi="['system:dict:detail']" -->
          <!--   v-hasPermi="['system:dict:remove']" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >跟进详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.customerFollowUpStatusEnum.Name === 'Following'"
            @click="handleDetail(scope.row)"
            >继续跟进</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.customerFollowUpStatusEnum.Name === 'Following'"
            @click="handleDetail(scope.row)"
            >放弃跟进</el-button
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

    <!-- 操作框 -->
    <edit-dialog
      :form="form"
      :open="open"
      :title="title"
      @closeDialog="cancel"
    />
  </div>
</template>

<script>
import {
  getCustomerMyData,
  getCustomerGroupEnumList,
  getCustomerTypeEnumList,
  getCustomerFollowUpStatusEnumList,
} from "@/api/vehicle-monitoring/customer";
import editDialog from "../customer/components/edit.vue";

export default {
  name: "Purchase",
  inject: ["reload"],
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
      // 表格数据
      tableData: [],
      // 客户分组数据
      customerGroupEnumList: [],
      // 客户类型数据
      customerTypeEnumList: [],
      // 客户跟进状态数据
      customerFloowStatusList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层 新增/编辑框
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      params: {
        customerFollowUpStatusEnum: null,
        customerGroupEnum: null,
        customerTypeEnum: null,
        sortInfo: null,
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
        quickSearchInfoList: [
          {
            columns: [
              "customer.customerNo",
              "customer.name",
              "customer.phoneNumber",
              "customer.address",
              "customer.remark",
              "followUpContent",
            ],
            quickSearchValue: null,
          },
          {
            columns: ["customer.customerNo"],
            quickSearchValue: null,
          },
          {
            columns: ["customer.name"],
            quickSearchValue: null,
          },
          {
            columns: ["customer.phoneNumber"],
            quickSearchValue: null,
          },
          {
            columns: ["customer.address"],
            quickSearchValue: null,
          },
          {
            columns: ["customer.remark"],
            quickSearchValue: null,
          },
          {
            columns: ["followUpContent"],
            quickSearchValue: null,
          },
        ],
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
  components: {
    editDialog,
  },
  computed: {
    timedOut() {
      return (val) => {
        return (
          val.nextFollowUpTime &&
          new Date(val.nextFollowUpTime) < new Date() &&
          val.customerFollowUpStatusEnum.Name === "Following"
        );
      };
    },
  },
  created() {
    this.getList();
    this.getCustomerGroupEnumList();
    this.getCustomerTypeEnumList();
    this.getCustomerFollowUpStatusEnumList();
  },
  methods: {
    getDD() {
      setTimeout(() => {
        this.reload();
      }, 10000);
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getCustomerMyData(this.params).then((response) => {
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
    // 获取客户跟进状态
    getCustomerFollowUpStatusEnumList() {
      getCustomerFollowUpStatusEnumList().then((res) => {
        this.customerFloowStatusList = res.data;
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
      let data = {
        1: {
          columnName: "nextFollowUpTime",
          order: "ASC",
        },
        2: {
          columnName: "createTime",
          order: "ASC",
        },
        3: {
          columnName: "customer.customerNo",
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
      console.log(arr);
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
