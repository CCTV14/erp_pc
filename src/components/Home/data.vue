<template>
  <div>
    <el-card class="card" :body-style="{'height':'370px'}">
      <div slot="header" class="title">
        <span>销售数据</span>
        <el-radio-group v-model="value">
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
                <div class="num mt10">2403.79</div>
              </div>
            </el-col>

            <el-col :span="9">
              <div class="sale_order">
                <div class="title">销售单（笔）</div>
                <div class="num mt10">430</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="detail">
          <el-row>
            <el-col :span="8">
              <div class="title">回款额（元）</div>
              <div class="num">29524.19</div>
            </el-col>
            <el-col :span="8">
              <div class="title">付款额（元）</div>
              <div class="num">1743.63</div>
            </el-col>
            <el-col :span="8">
              <div class="title">配送费（元）</div>
              <div class="num">572.16</div>
            </el-col>
          </el-row>
          <el-row class="mt25">
            <el-col :span="8">
              <div class="title">收款单</div>
              <div class="num">11</div>
            </el-col>
            <el-col :span="8">
              <div class="title">付款单</div>
              <div class="num">43</div>
            </el-col>
            <el-col :span="8">
              <div class="title">配送出库单</div>
              <div class="num">98</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "本日"
    };
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