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
      <el-form-item label="姓名" prop="quickSearchInfoList[1].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          placeholder="请输入姓名"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="quickSearchInfoList[2].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          placeholder="请输入手机号"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="quickSearchInfoList[3].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[3].quickSearchValue"
          placeholder="请输入邮箱"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户来源" prop="userTypeEnum">
        <el-select
          v-model="params.userTypeEnum"
          placeholder="请选择用户来源"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="(item, index) in selectUserTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
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
          <el-option label="姓名倒序" :value="1"></el-option>
          <el-option label="手机号正序" :value="2"></el-option>
          <el-option label="手机号倒序" :value="3"></el-option>
          <el-option label="最早创建" :value="4"></el-option>
          <el-option label="最近创建" :value="5"></el-option>
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
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="姓名" align="center" prop="name" />
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
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!--   v-hasPermi="['system:user:edit']" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelect(scope.row)"
            >选择</el-button
          >
          <!--   v-hasPermi="['system:dict:edit']" -->
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
import { userFindPageForSelect } from "@/api/vehicle-monitoring/customer";
import { getUserTypeEnumListSync } from "@/api/vehicle-monitoring/user";

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
      //  用户身份数据
      selectUserTypeList: [],
      // 搜索参数
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
        frozen: false,
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
    this.getUserTypeEnumListm();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      userFindPageForSelect(this.params).then((response) => {
        this.tableData = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取用户身份枚举
    async getUserTypeEnumListm() {
      let authTypeEnumListRes = await getUserTypeEnumListSync();
      if (authTypeEnumListRes && authTypeEnumListRes.success) {
        this.selectUserTypeList = [
          {
            name: "全部身份",
            value: null,
          },
          ...authTypeEnumListRes.data.map((item) => {
            return {
              name: item.Desc,
              value: item.Name,
            };
          }),
        ];
      }
    },
    // 选择排序下拉框值
    selectSortType(val) {
      let data = {
        1: {
          columnName: "name",
          order: "DESC",
        },
        2: {
          columnName: "phoneNumber",
          order: "ASC",
        },
        3: {
          columnName: "phoneNumber",
          order: "DESC",
        },
        4: {
          columnName: "createTime",
          order: "ASC",
        },
        5: {
          columnName: "createTime",
          order: "DESC",
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
      this.$emit("handleSelectUser", row);
    },
  },
};
</script>
