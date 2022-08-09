<template>
  <div>
    <el-card class="card" :body-style="{'height':'370px'}">
      <div slot="header" class="title">
        <span>数据分析</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <!-- 线条数据 -->
      <line-chart :chart-data="lineChartData" />
    </el-card>
  </div>
</template>

<script>
import LineChart from "../../views/dashboard/LineChart";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};
export default {
  data() {
    return {
      value1: "",
      lineChartData: lineChartData.newVisitis
    };
  },
  components: {
    LineChart
  }
};
</script>
<style scoped lang="scss">
.card {
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #4a4a4a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>