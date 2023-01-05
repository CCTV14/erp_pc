<template>
  <!-- 预备选择客户框 -->
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
          style="width: 180px"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="quickSearchInfoList[2].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          style="width: 180px"
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
          style="width: 180px"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="quickSearchInfoList[4].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[4].quickSearchValue"
          style="width: 180px"
          placeholder="请输入地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="quickSearchInfoList[5].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[5].quickSearchValue"
          style="width: 180px"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户类型" prop="customerTypeEnum">
        <el-select
          v-model="params.customerTypeEnum"
          placeholder="请选择客户类型"
          style="width: 180px"
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
      <el-form-item label="客户分组" prop="customerGroupEnum">
        <el-select
          v-model="params.customerGroupEnum"
          placeholder="请选择分组"
          style="width: 180px"
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
      <el-form-item label="排序方式" prop="sortInfo">
        <el-select
          v-model="sortName"
          placeholder="请选择排序方式"
          clearable
          style="width: 180px"
          @change="selectSortType"
        >
          <el-option label="编号正序 [默认]" value=""></el-option>
          <el-option label="编号倒序" :value="1"></el-option>
          <el-option label="姓名正序" :value="2"></el-option>
          <el-option label="姓名倒序" :value="3"></el-option>
          <el-option label="余额正序" :value="4"></el-option>
          <el-option label="余额倒序" :value="5"></el-option>
          <el-option label="最早创建" :value="6"></el-option>
          <el-option label="最近创建" :value="7"></el-option>
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
    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="客户信息" align="center" sortable width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }} {{ scope.row.customerNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" align="center" sortable width="120">
        <template slot-scope="scope">
          <span>￥{{ scope.row.balanceAmount | thousandSymbol }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户电话"
        align="center"
        prop="phoneNumber"
        width="120"
      />
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
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建信息" align="center" width="200">
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
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:dict:edit']">修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelect(scope.row)"
            >选择</el-button
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
  customerPoolFindCanAddCustomerPage,
  getCustomerTypeEnumList,
  getCustomerGroupEnumList,
} from "@/api/vehicle-monitoring/customer";

export default {
  data() {
    return {
      // 排序方式名称
      sortName: "",
      // 遮罩层
      loading: true,
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
      // 搜索参数
      params: {
        quickSearchInfoList: [
          {
            columns: ["customerNo", "name", "phoneNumber", "address", "remark"],
            quickSearchValue: null,
          },
          {
            columns: ["customerNo"],
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
            columns: ["address"],
            quickSearchValue: null,
          },
          {
            columns: ["remark"],
            quickSearchValue: null,
          },
        ],
        customerTypeEnum: null,
        customerGroupEnum: null,
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
        sortInfo: null,
      },
    };
  },
  created() {
    this.getList();
    this.getCustomerTypeEnumList();
    this.getCustomerGroupEnumList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      customerPoolFindCanAddCustomerPage(this.params).then((response) => {
        this.tableData = response.data;
        this.total = response.total;
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 选择
    handleSelect(row) {
      this.$emit("handleSelectCustomer", row);
    },
  },
};
</script>
