<template>
  <div>
    <el-card class="card">
      <div slot="header" class="title">
        <span>{{ type == "pay" ? "付款业绩排行" : "回款业绩排行" }}</span>
        <el-radio-group v-model="value" @change="getSaleData">
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="本年"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="content">
        <div class="head mb20">
          <el-row type="flex" justify="space-between">
            <el-col :span="15">
              <div class="sale_order">
                <div class="title">回款额（元）</div>
                <div class="num">{{ params.data.sumAmount }}</div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="sale_order">
                <div class="title">销售单（笔）</div>
                <div class="num">{{ params.data.orderCount }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 排行 -->
        <div class="rank">
          <div
            class="cont"
            v-for="(item, index) in params.data.showList"
            :key="index"
            v-if="params.data.showList != [] && params.data.showList.length > 0"
            @click="toReportData"
          >
            <div class="rank_info">
              <div class="top" :style="{ color: index < 3 ? '#4D8DEE' : '' }">
                {{ ++index }}
              </div>
              <div class="avatar">
                <user-avatar
                  :size="40"
                  shape="circle"
                  :src="item.user"
                ></user-avatar>
              </div>
              <div class="info">
                <div class="name">{{ item.user.name }}</div>
                <div class="job">单据数量 {{ item.orderCount }}</div>
              </div>
            </div>
            <div class="rank_price">
              <div class="price mr15">{{ item.amount }}</div>
              <i class="el-icon-arrow-right" style="font-size: 18px"></i>
            </div>
          </div>
        </div>
        <div class="more">
          <el-button type="text" class="mt10" @click="toReportData"
            >查看更多</el-button
          >
        </div>
        <!--  -->
      </div>
    </el-card>
  </div>
</template>
<script>
import * as dates from "@/utils/date.js";
import { getSaleRankInfo, getColletRankInfo } from "@/api/vehicle-monitoring";
export default {
  data() {
    return {
      value: "本月",
      params: {
        current: 0,
        needShowCount: 5,
        data: {
          orderCount: 0,
          sumAmount: 0,
          showList: [],
          moreUserList: [],
        },
      },
    };
  },
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.getSaleData();
  },
  methods: {
    // 跳转
    toReportData() {
      let name = this.type == "pay" ? "saleRank" : "collectRank";
      this.$router.push({ path: name });
    },
    async getSaleData(args) {
      let todayDate = new Date();
      let startDate = null;
      let endDate = null;
      var selectDate;
      if (this.value == "本月") {
        // 选择本月
        selectDate = dates.getMonthStartEndDate();
      } else if (this.value == "本年") {
        // 选择本月
        selectDate = dates.getYearStartEndDate();
      }
      startDate = selectDate[0];
      endDate = selectDate[1];
      let res =
        this.type == "pay"
          ? await getSaleRankInfo(
              {
                startDate,
                endDate,
              },
              args
            )
          : await getColletRankInfo(
              {
                startDate,
                endDate,
              },
              args
            );
      if (res && res.success) {
        let data = res.data;
        let showList = [];
        let moreUserList = [];
        if (data.itemList && data.itemList.length > 0) {
          data.itemList.forEach((item) => {
            let index = data.itemList.indexOf(item);
            if (index < this.params.needShowCount) {
              showList.push(item);
            } else {
              moreUserList.push(item.user);
            }
          });
        }
        this.params.data = {
          orderCount: data.orderCount,
          sumAmount: data.sumAmount,
          showList,
          moreUserList,
        };
      }
    },
  },
};
</script>
<style scoped lang="scss">
.font-style500 {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}
.card {
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #4a4a4a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content {
    .more {
      display: flex;
      justify-content: center;
    }
    .head {
      .title {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4a4a4a;
      }
      .num {
        font-family: PingFangSC-Semibold;
        font-size: 23px;
        color: #4a4a4a;
      }
    }
    .rank {
      margin-top: 15px;

      .cont {
        height: 62px;
        // border-bottom: 1px solid #ececec;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .rank_price {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .price {
            font-family: PingFangSC-Semibold;
            font-size: 18px;
            color: #4a4a4a;
          }
        }

        .rank_info {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .top {
            @extend .font-style500;
          }

          .avatar {
            margin-left: 10px;
            margin-right: 10px;

            image {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              width: 38px;
              height: 38px;
            }
          }

          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .name {
              @extend .font-style500;
              margin-bottom: 2px;
            }

            .job {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
            }
          }
        }
      }
    }
  }
}
</style>
