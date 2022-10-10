<template>
  <div class="app-container">
    <el-form
      :model="searchParam"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-radio-group v-model="value" @change="selectDate">
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="本年"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectQueryDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品名称" prop="commodityName">
            <el-input
              v-model="searchParam.commodityName"
              placeholder="请输入商品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品颜色" prop="commodityColor">
            <el-input
              v-model="searchParam.commodityColor"
              placeholder="请输入颜色"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品类别" prop="commodityCategoryId">
            <el-select
              v-model="searchParam.commodityCategoryId"
              placeholder="请选择商品类别"
              clearable
            >
              <el-option
                v-for="(item, index) in commodityCategoryList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格名称" prop="commoditySpecName">
            <el-input
              v-model="searchParam.commoditySpecName"
              placeholder="请输入规格名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="searchParam.supplierId"
              filterable
              remote
              v-el-select-loadmore="loadmore"
              :remote-method="remoteMethod"
              placeholder="请选择供应商"
            >
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
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
          </el-form-item></el-col
        >
      </el-row>
    </el-form>
    <!-- 数据 -->
    <div class="count_flow mb15">
      <div class="in">
        <div>采购总额</div>
        <div class="price">￥{{ reportData.sumAmount || 0 }}</div>
      </div>
      <div class="out">
        <div>采购数量</div>
        <div class="price">
          {{ reportData.orderCount || 0}}
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="reportData.itemList">
      <el-table-column label="商品名称" align="center" prop="commodity.name" />
      <el-table-column
        label="商品分类"
        align="center"
        prop="commodityCategory.name"
      />
      <el-table-column label="颜色" align="center" prop="commodity.color" />
      <el-table-column label="供应商" align="center" prop="supplier.name" />
      <el-table-column
        label="规格"
        align="center"
        prop="commodityInfo.unit"
      />
      <el-table-column prop="imgUrl" label="图片" align="center">
        <template slot-scope="scope">
          <ImagePreview
            height="60px"
            width="65px"
            :src="scope.row.commodity.imageNameList[0] || ''"
          />
        </template>
      </el-table-column>
      <el-table-column label="单据数量" align="center" prop="orderCount" />
      <el-table-column label="采购数量" align="center" prop="purchaseQuantity" />
      <el-table-column label="采购额" align="center" sortable>
        <template slot-scope="scope">
          <span>￥{{ scope.row.purchaseAmount || 0 | thousandSymbol}}</span>
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-if="
              scope.row.saleOrderHeadList &&
              scope.row.saleOrderHeadList.length > 0
            "
            >单据清单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as dates from "@/utils/date.js";
import { getCommoditySaleReport } from "@/api/vehicle-monitoring/report";
import {
  getCommodityCategoryFindAvailableList,
  getCommodityPurchaseReport,
} from "@/api/vehicle-monitoring/commodity";
import { validLowerCase } from "../../../../utils/validate";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 日期单选框选择项
      value: "本月",
      // 日期范围
      dateRange: [],
      // 供应商列表
      supplierList: [],
      // 商品分类
      commodityCategoryList: [],
      // 查询参数
      searchParam: {
        commodityName: null,
        commodityCategoryId: null,
        commodityColor: null,
        supplierId: null,
        commoditySpecName: null,
        startDate: "",
        endDate: "",
      },
      // 供应商查询
      supplierParam: {
        quickSearchInfoList: [
          {
            columns: ["name"],
            quickSearchValue: null,
          },
        ],
        pageInfo: {
          page: 1,
          pageSize: 10,
        },
      },
      // 数据
      reportData: {
        purchaseOrderSumAmount: 0,
        purchaseOrderCount: 0,
        purchaseReturnOrderSumAmount: 0,
        purchaseReturnOrderCount: 0,
      },
      // 渲染参数
      params: {
        current: 0,
        needShowCount: 5,
        data: {
          orderCount: 0,
          sumAmount: 0,
          showList: [],
        },
      },
      // 查询参数
      postForm: {
        endDate: "",
        startDate: "",
      },
    };
  },
  mounted() {
    this.selectDate("本月");
    this.getCommodityCategoryFindAvailableList();
    this.getSupplierList(true);
  },
  methods: {
    // 选择日期
    selectDate(val) {
      var date = "";
      switch (val) {
        case "本周":
          date = dates.getWeekStartEndDate();
          break;
        case "本月":
          date = dates.getMonthStartEndDate();
          break;
        case "本年":
          date = dates.getYearStartEndDate();
          break;
      }
      this.dateRange = date;
      this.searchParam.startDate = date[0];
      this.searchParam.endDate = date[1];
      this.handleQuery();
    },
    // 重新搜索供应商结果 远程搜索
    remoteMethod(val) {
      this.supplierParam.quickSearchInfoList[0].quickSearchValue = val;
      this.getSupplierList(true);
    },
    // 下拉框加载
    loadmore(val) {
      this.getSupplierList();
    },
    //获取采购报表
    async getSupplierList(init) {
      if (init) {
        this.supplierParam.pageInfo.page = 1;
      }
      let searchRes = await getCommodityPurchaseReport(this.supplierParam);
      if (searchRes && searchRes.success) {
        this.supplierParam.pageInfo = searchRes.pageInfo;
        this.supplierParam.pageInfo.page++;
        // 请求成功：初次请求直接赋值，之后追加
        this.supplierList = init
          ? searchRes.data
          : this.supplierList.concat(searchRes.data);
      }
    },
    // 获取商品分类
    getCommodityCategoryFindAvailableList() {
      getCommodityCategoryFindAvailableList().then((res) => {
        this.commodityCategoryList = res.data;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.getSupplierList(true);
      this.resetForm("queryForm");
      this.searchParam.startDate = "";
      this.searchParam.endDate = "";
      this.handleQuery();
    },
    // 搜索
    async handleQuery() {
      this.loading = true;
      let res = await getCommoditySaleReport(this.searchParam);
      if (res && res.success) {
        this.loading = false;
        this.reportData = res.data;
      }
    },
    // 选择查询日期
    selectQueryDate(val) {
      this.postForm.startDate = val[0];
      this.postForm.endDate = val[1];
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .count_flow {
    display: flex;
    justify-content: space-around;
    // padding: 0 12px 0 12rpx;

    .in,
    .out {
      display: flex;
      // align-items: end;
      align-items: center;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      flex-direction: column-reverse;
      .price {
        font-size: 18px;
        color: #4d8dee;
        font-weight: 500;
        padding-bottom: 3px;
      }
    }
  }
}
</style>
