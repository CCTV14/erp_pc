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
      <el-form-item label="名称" prop="quickSearchInfoList[1].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[1].quickSearchValue"
          style="width: 240px"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="颜色" prop="quickSearchInfoList[2].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[2].quickSearchValue"
          style="width: 240px"
          placeholder="请输入颜色"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="quickSearchInfoList[3].quickSearchValue">
        <el-input
          v-model="params.quickSearchInfoList[3].quickSearchValue"
          style="width: 240px"
          placeholder="请输入单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="供应商"
        prop="quickSearchInfoList[4].quickSearchValue"
      >
        <el-input
          v-model="params.quickSearchInfoList[4].quickSearchValue"
          style="width: 240px"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品分类" prop="commodityCategoryId">
        <el-select
          v-model="params.commodityCategoryId"
          style="width: 240px"
          placeholder="请选择商品分类"
          clearable
        >
          <el-option label="不限" :value="null"></el-option>
          <el-option
            v-for="(item, index) in commodityCategoryList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="在产状态" prop="productionStatusEnum">
        <el-select
          v-model="params.productionStatusEnum"
          style="width: 240px"
          placeholder="请选择在产状态"
          clearable
        >
          <el-option label="不限" :value="null"></el-option>
          <el-option
            v-for="(item, index) in commodityProductionStatusList"
            :key="index"
            :label="item.Desc"
            :value="item.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="冻结状态" prop="frozen">
        <el-select
          v-model="params.frozen"
          style="width: 240px"
          placeholder="请选择冻结状态"
          clearable
        >
          <el-option label="不限" value=""></el-option>
          <el-option label="已冻结" :value="true"></el-option>
          <el-option label="未冻结" :value="false"></el-option>
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
          <el-option label="零售价倒序" :value="1"></el-option>
          <el-option label="零售价正序" :value="2"></el-option>
          <el-option label="批发价倒序" :value="3"></el-option>
          <el-option label="批发价正序" :value="4"></el-option>
          <el-option label="最近创建" :value="5"></el-option>
          <el-option label="最早创建" :value="6"></el-option>
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
      <el-col :span="1.5">
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
        >
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :cell-style="$thinking.getCellFontColor"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="商品名称"
        align="center"
        prop="name"
        width="120"
      />
      <el-table-column
        label="商品分类"
        align="center"
        prop="commodityCategory.name"
      />
      <el-table-column label="颜色" align="center" prop="color" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="供应商" align="center" prop="supplier.name" />
      <!-- <el-table-column label="规格" align="center" prop="spec" /> -->
      <el-table-column prop="imgUrl" label="图片" align="center">
        <template slot-scope="scope">
          <ImagePreview
            height="60px"
            width="65px"
            :src="scope.row.imageNameList[0]"
          />
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.frozen ? "已冻结" : "未冻结" }}</span>
        </template>
      </el-table-column>
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
          <!--      v-hasPermi="['system:dict:detail']" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >查看</el-button
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
        <el-form-item label="客户编号" v-if="form.id">
          <span>{{ form.customerNo }}</span>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="当前余额" v-if="form.id">
          <span>{{ form.balanceAmount }}</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户分组" prop="customerGroupEnum">
          <el-select
            v-model="form.customerGroupEnum"
            style="width: 100%"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="成交" value="1"></el-option>
            <el-option label="流失" value="0"></el-option>
            <el-option label="支付宝账户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerTypeEnum">
          <el-select
            v-model="form.customerTypeEnum"
            style="width: 100%"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="成交" value="1"></el-option>
            <el-option label="流失" value="0"></el-option>
            <el-option label="支付宝账户" value="1"></el-option>
          </el-select>
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
  getCommodityData,
  getCommodityProductionStatusEnumList,
  getCommodityCategoryFindAvailableList,
} from "@/api/vehicle-monitoring/commodity.js";

export default {
  name: "Purchase",
  data() {
    return {
      // 排序名称
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
      // 商品分类数据
      commodityCategoryList: [],
      // 商品在产状态数据
      commodityProductionStatusList: [],
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
            columns: [
              "name",
              "color",
              "unit",
              "commoditySpecList.specName",
              "supplier.name",
            ],
            quickSearchValue: null,
          },
          {
            columns: ["name"],
            quickSearchValue: null,
          },
          {
            columns: ["color"],
            quickSearchValue: null,
          },
          {
            columns: ["unit"],
            quickSearchValue: null,
          },
          {
            columns: ["commoditySpecList.specName"],
            quickSearchValue: null,
          },
          {
            columns: ["supplier.name"],
            quickSearchValue: null,
          },
        ],
        commodityCategoryId: null,
        productionStatusEnum: null,
        frozen: "",
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
    this.getFlushAvailableCategory();
    this.getFlushCommodityProductionStatus();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getCommodityData(this.params).then((response) => {
        this.tableData = response.data;
        this.total = Number(response.total);
        this.loading = false;
      });
    },
    // 获取商品分类列表
    getFlushAvailableCategory() {
      getCommodityCategoryFindAvailableList().then((res) => {
        this.commodityCategoryList = res.data;
      });
    },
    // 获取商品在产状态
    getFlushCommodityProductionStatus() {
      getCommodityProductionStatusEnumList().then((res) => {
        this.commodityProductionStatusList = res.data;
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
      switch (val) {
        case 1:
          this.params.sortInfo = {
            columnName: "name",
            order: "DESC",
          };
          break;
        case 2:
          this.params.sortInfo = {
            columnName: "maxBuyingPrice",
            order: "DESC",
          };
          break;
        case 3:
          this.params.sortInfo = {
            columnName: "minBuyingPrice",
            order: "ASC",
          };
        case 4:
          this.params.sortInfo = {
            columnName: "maxTradePrice",
            order: "DESC",
          };

        case 5:
          this.params.sortInfo = {
            columnName: "minTradePrice",
            order: "ASC",
          };
        case 6:
          this.params.sortInfo = {
            columnName: "createTime",
            order: "DESC",
          };
        case 7:
          this.params.sortInfo = {
            columnName: "createTime",
            order: "ASC",
          };
          break;
        default:
          this.params.sortInfo = null;
          break;
      }
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
