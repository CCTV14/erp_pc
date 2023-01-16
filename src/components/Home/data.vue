<template>
  <div>
    <el-card class="card" :body-style="{ height: '370px' }">
      <div slot="header" class="title">
        <span>销售数据</span>
        <el-radio-group v-model="value" @change="getSaleData">
          <el-radio-button label="本日"></el-radio-button>
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="sale">
        <div class="head">
          <el-row type="flex" justify="space-between">
            <el-col :span="15">
              <div class="sale_order">
                <div class="title">销售单（元）</div>
                <div class="num mt10">
                  {{ saleData.summaryData.saleOrderAmount }}
                </div>
              </div>
            </el-col>

            <el-col :span="9">
              <div class="sale_order">
                <div class="title">销售单（笔）</div>
                <div class="num mt10">
                  {{ saleData.summaryData.saleOrderCount }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="detail">
          <el-row>
            <el-col :span="15">
              <div class="title">收款额（元）</div>
              <div class="num">
                {{ saleData.summaryData.fundCollectOrderAmount | priceFixedTwo}}
              </div>
            </el-col>
            <!-- <el-col :span="8">
              <div class="title">付款额（元）</div>
              <div class="num">1743.63</div>
            </el-col> -->
            <el-col :span="9">
              <div class="title">配送费（元）</div>
              <div class="num">
                {{ saleData.summaryData.commodityOutPutOrderDistributeAmount | priceFixedTwo}}
              </div>
            </el-col>
          </el-row>
          <el-row class="mt25">
            <el-col :span="15">
              <div class="title">收款单</div>
              <div class="num">
                {{ saleData.summaryData.fundCollectOrderCount }}
              </div>
            </el-col>
            <!-- <el-col :span="8">
              <div class="title">付款单</div>
              <div class="num">43</div>
            </el-col> -->
            <el-col :span="9">
              <div class="title">配送出库单</div>
              <div class="num">
                {{ saleData.summaryData.commodityOutPutOrderCount }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as dates from "@/utils/date.js";
import { getSaleData } from "@/api/vehicle-monitoring";
export default {
  data() {
    return {
      value: "本日",
      saleData: {
        summaryData: {},
      },
    };
  },
  methods: {
    getSaleData() {
      let startDate = null;
      let endDate = null;
      let selectDate;
      if (this.value == "本日") {
        // 选择今日
        selectDate = [
          dates.formatDate(new Date()),
          dates.formatDate(new Date()),
        ];
      } else if (this.value == "本周") {
        // 选择本周
        selectDate = dates.getWeekStartEndDate();
      } else if (this.value == "本月") {
        // 选择本月
        selectDate = dates.getMonthStartEndDate();
      }
      startDate = selectDate[0];
      endDate = selectDate[1];
      getSaleData({ startDate: startDate, endDate: endDate }).then((res) => {
        if (res && res.success) {
          let summaryData = {
            saleOrderCount: 0,
            saleOrderAmount: 0,
            fundCollectOrderCount: 0,
            fundCollectOrderAmount: 0,
            fundPayOrderCount: 0,
            fundPayOrderAmount: 0,
            commodityOutPutOrderCount: 0,
            commodityOutPutOrderDistributeAmount: 0,
          };
          if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              summaryData.saleOrderCount += item.saleOrderCount;
              summaryData.saleOrderAmount += item.saleOrderNeedCollectAmountSum;
              summaryData.fundCollectOrderCount += item.fundCollectOrderCount;
              summaryData.fundCollectOrderAmount +=
                item.fundCollectOrderNeedCollectAmountSum;
              summaryData.fundPayOrderCount += item.fundPayOrderCount;
              summaryData.fundPayOrderAmount +=
                item.fundPayOrderNeedPayAmountSum;
              summaryData.commodityOutPutOrderCount +=
                item.commodityOutPutOrderCount;
              summaryData.commodityOutPutOrderDistributeAmount +=
                item.commodityOutPutOrderDistributeAmountSum;
            });
          }
          this.saleData.summaryData = summaryData;
        }
      });
    },
  },
  mounted() {
    this.getSaleData();
  },
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
  .sale {
    padding-bottom: 26px;
    padding-top: 26px;
    .title {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4a4a4a;
    }
    .head {
      margin-bottom: 30px;
      .num {
        font-family: PingFangSC-Semibold;
        font-size: 32px;
        color: #4a4a4a;
      }
    }
    .detail {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #4a4a4a;
      .num {
        margin-top: 2px;
      }
    }
  }
}
</style>
