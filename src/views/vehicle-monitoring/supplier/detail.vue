<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb10">
      <el-descriptions title="供应商信息">
        <el-descriptions-item label="供应商名称">{{
          detailForm.name
        }}</el-descriptions-item>
        <el-descriptions-item label="当前余额"
          ><span class="text-success"
            >￥{{ detailForm.balanceAmount | priceFixedTwo }}</span
          ></el-descriptions-item
        >
        <el-descriptions-item label="联系方式">{{
          detailForm.phoneNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{
          detailForm.address
        }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{
          detailForm.remark
        }}</el-descriptions-item>
        <el-descriptions-item label="创建信息"
          >{{ detailForm.creator.name }}
          {{ detailForm.createTime }}</el-descriptions-item
        >
      </el-descriptions>
    </div>
    <!-- 变动详细 -->
    <div>
      <el-tabs v-model="operTips" @tab-click="handleTabClick">
        <el-tab-pane label="余额变动明细" name="first">
          <el-table :data="priceList">
            <el-table-column
              label="名称"
              align="center"
              prop="changeTypeEnum.Desc"
              width="120"
            />
            <el-table-column label="金额" align="center" prop="changeAmount" />
            <el-table-column
              label="变动时间"
              align="center"
              prop="createTime"
            />
            <el-table-column
              label="备注"
              align="center"
              prop="remark"
              width="400"
            />
          </el-table>
          <div class="tab-foot">
            <el-button type="primary">查看更多</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  supplierBalanceDetailList,
  supplierFindById,
} from "@/api/vehicle-monitoring/supplier";
export default {
  data() {
    return {
      detailForm: {
        creator: {},
      },
      operTips: "first",
      // 余额明细列表
      priceList: [],
    };
  },
  mounted() {
    this.getDetail();
    this.getPriceList();
  },
  methods: {
    getDetail() {
      supplierFindById({ id: this.$route.query.id }).then((res) => {
        this.detailForm = res.data;
      });
    },
    // 跳转至余额详情
    toFloowDetail() {
      this.$router.push({
        name: "floow-detail",
        query: {
          floowId: this.detailForm.customerFollowUpList[0].id,
          customerId: this.$route.query.id,
        },
      });
    },
    getPriceList() {
      var data = {
        supplierId: this.$route.query.id,
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
      };
      supplierBalanceDetailList(data).then((res) => {
        if (res.success) {
          this.priceList = res.data;
        }
      });
    },
    getTxtSleep(value) {
      if (value && value.length > 3) {
        return value.substring(0, 3) + "...";
      } else {
        return value;
      }
    },
    handleTabClick(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: #fafafa;

  .head {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
  }
  .tab-foot {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
