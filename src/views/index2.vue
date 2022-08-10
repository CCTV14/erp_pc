<template>
  <div class="app-container home">
    <!-- 最近使用 -->
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="card bornone">
          <div slot="header" class="title">
            <span>最近使用</span>
          </div>
          <div class="cont">
            <div v-for="(item, index) in historyList" :key="index">
              <el-image style="width: 70px; height: 70px" :src="item.imgUrl"></el-image>
              <div class="mt15">销售单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 我的待办 -->
    <el-row :gutter="24" class="mt20 mb20">
      <el-col :span="24">
        <el-card class="card bornone flex-card" style="padding-bottom:10px;">
          <div slot="header" class="title">
            <span>我的待办</span>
          </div>
          <div class="agency" v-for="(item, index) in agencyList" :key="index">
            <el-image style="width: 80px; height: 85px" :src="item.imgUrl"></el-image>
            <div class="descriptions">
              <div class="num">{{ item.num }}</div>
              <div class="desc mt5">{{ item.name }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 四个排行/分析 -->
    <el-row :gutter="14">
      <el-col :span="8">
        <sale-data />
      </el-col>
      <el-col :span="16">
        <sale-line />
      </el-col>
    </el-row>
    <!-- 排行 -->
    <el-row :gutter="14" class="mt20">
      <el-col :span="8">
        <sale-rank type="pay" />
      </el-col>
      <el-col :span="8">
        <sale-rank type="collect" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import data from "../components/Home/data.vue";
import line from "../components/Home/line.vue";
import rank from "../components/Home/rank.vue";
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.3",
      // 我的待办
      agencyList: [{
        num: 8,
        name: "待审单据",
        imgUrl: require("../assets/images/home/pending_order.png")
      },
      {
        num: 0,
        name: "待出入库",
        imgUrl: require("../assets/images/home/commodity_inout.png")
      },
      {
        num: 23,
        name: "客户跟进",
        imgUrl: require("../assets/images/home/customer_floow.png")
      },
      {
        num: 12,
        name: "库存预警",
        imgUrl: require("../assets/images/home/inventory_warning.png")
      }
      ],
      // 历史使用
      historyList: [{
        name: "销售单",
        imgUrl: require('../assets/images/home/history/sale_order.png')
      },
      {
        name: "采购单",
        imgUrl: require('../assets/images/home/history/purchase_order.png')
      },
      {
        name: "跟进记录",
        imgUrl: require('../assets/images/home/history/floow_record.png')
      },
      {
        name: "入库单",
        imgUrl: require('../assets/images/home/history/commodity_inputOrder.png')
      },
      {
        name: "供应商",
        imgUrl: require('../assets/images/home/history/supplier_manager.png')
      },
      {
        name: "商品管理",
        imgUrl: require('../assets/images/home/history/commodity_manager.png')
      },
      {
        name: "客户公海池",
        imgUrl: require('../assets/images/home/history/customer_pool.png')
      },
      {
        name: "其他收入",
        imgUrl: require('../assets/images/home/history/other_income.png')
      },
      {
        name: "商品分类",
        imgUrl: require('../assets/images/home/history/commodity_cagetory.png')
      }
      ]
    };
  },
  components: {
    saleData: data,
    saleLine: line,
    saleRank: rank
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  background: #fafafa;
  .card {
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #4a4a4a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    //   最近使用
    .cont {
      display: flex;
      justify-content: space-around;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4a4a4a;
      text-align: center;
    }

    .agency {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25%;
      border-right: 1px solid #cccccc;

      .descriptions {
        display: flex;
        flex-direction: column;
        margin-left: 25px;

        .num {
          font-family: PingFangSC-Semibold;
          font-size: 34px;
          color: #378df5;
        }

        .desc {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4a4a4a;
        }
      }

      &:last-child {
        border: none;
        padding-left: 0;
      }
    }

    //
  }
}
</style>
