<template>
  <div class="app-container">
    <el-form
      :model="params"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-radio-group v-model="value" @change="handleQuery">
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
    </el-form>
    <!-- 数据 -->
    <div class="count_flow mb15">
      <div class="in">
        <div>销售额</div>
        <div class="price">￥{{ params.data.sumAmount }}</div>
      </div>
      <div class="out">
        <div>销售单数量</div>
        <div class="price">
          {{ params.data.orderCount }}
        </div>
      </div>
    </div>
    <!-- 占比分析图表 -->
    <el-card class="box-card mb15">
      <div slot="header" class="clearfix">
        <span>占比分析</span>
      </div>
      <Pie :option="opts" v-if="opts.series[0].data.length > 0" />
      <el-empty
        description="没有收款金额大于 0 的数据,无法展示占比分析图"
        v-else
      ></el-empty>
    </el-card>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="params.data.showList" @row-click="toListPage">
      <el-table-column label="排名" type="index" align="center">
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <user-avatar
            :size="55"
            shape="circle"
            :src="scope.row.user"
          ></user-avatar>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="user.name" />
      <el-table-column label="单据数量" align="center" prop="orderCount" />
      <el-table-column label="单据金额" prop="amount" align="center" sortable>
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount | thousandSymbol }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击详情表格 -->
    <el-dialog
      title="销售单清单"
      :visible.sync="listVisble"
      width="65%"
      append-to-body
    >
      <list :saleList="saleList" />
    </el-dialog>
  </div>
</template>

<script>
import * as dates from "@/utils/date.js";
import { getSaleRank } from "@/api/vehicle-monitoring/report";
import Pie from "../components/PieChart.vue";
import list from "./list.vue";
export default {
  data() {
    return {
      saleList: [],
      listVisble: false,
      // 遮罩层
      loading: true,
      // 日期单选框选择项
      value: "本月",
      // 日期范围
      dateRange: [],
      // 图表数据
      chartData: {
        series: [
          {
            data: [],
          },
        ],
      },
      // 图表配置项
      opts: {
        series: [
          {
            data: [],
          },
        ],
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
  components: {
    Pie,
    list,
  },
  mounted() {
    this.handleQuery();
  },
  methods: {
    async handleQuery(status) {
      if (status != "not") {
        var date = "";
        if (this.value == "本周") {
          date = dates.getWeekStartEndDate();
        } else if (this.value == "本月") {
          date = dates.getMonthStartEndDate();
        } else if (this.value == "本年") {
          date = dates.getYearStartEndDate();
        }
        this.postForm.startDate = date[0];
        this.postForm.endDate = date[1];
      }
      let res = await getSaleRank({
        startDate: this.postForm.startDate,
        endDate: this.postForm.endDate,
      });
      if (res && res.success) {
        this.loading = false;
        let data = res.data;
        let showList = [];
        if (data.itemList && data.itemList.length > 0) {
          data.itemList.forEach((item) => {
            showList.push(item);
          });
        }
        this.params.data = {
          orderCount: data.orderCount,
          sumAmount: data.sumAmount,
          showList,
        };
        this.title = "￥" + data.sumAmount.toFixed(2);
        this.getServerData();
      }
    },
    // 选择查询日期
    selectQueryDate(val) {
      this.postForm.startDate = val[0];
      this.postForm.endDate = val[1];
      this.handleQuery("not");
    },
    // 到行项目页面
    toListPage(row) {
      if (!row.saleOrderHeadList || row.saleOrderHeadList.length === 0) {
        this.$modal.msgWarning(
          "该用户在此时间区间内没有销售业绩，无法跳转销售单清单页面"
        );
        return;
      }
      this.saleList = row.saleOrderHeadList;
      this.listVisble = true;
    },
    // 渲染图表测试数据
    getServerData() {
      setTimeout(() => {
        // 数据集
        let res = {
          rotate: false,
          rotateLock: false,
          color: ["#E8804A", "#F7B500", "#4D8DEE"],
          padding: [5, 5, 5, 5],
          dataLabel: true,
          legend: {
            show: true,
            bottom: "0",
            lineHeight: 25,
          },
          title: {
            text: this.title,
            subtext: "销售额",
            x: "center",
            y: "130",
            textStyle: {
              fontSize: 18,
              fontWeight: "normal",
              color: ["#333333"],
            },
            subtextStyle: {
              color: "#333333",
              fontSize: 14,
              align: "center",
            },
          },
          series: [
            {
              label: {
                normal: {
                  formatter: "{d}%",
                  fontSize: 16,
                },
              },
              name: "WEEKLY WRITE ARTICLES",
              type: "pie",
              // roseType: "radius", 玫瑰型🌹饼形图
              radius: ["50%", "68%"],
              center: ["50%", "50%"],
              data: [],
            },
          ],
        };
        // 总数
        let total = 0;
        res.series[0].data = this.params.data.showList
          .filter((crr) => {
            return crr.orderCount != 0;
          })
          .map((item) => {
            return {
              name: item.user.name + " " + item.amount,
              value: item.amount,
            };
          });
        this.opts = JSON.parse(JSON.stringify(res));
      }, 20);
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
