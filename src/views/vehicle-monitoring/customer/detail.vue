<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb10">
      <el-descriptions title="客户详情">
        <template slot="extra">
          <el-button type="primary" @click="toFloowDetail">跟进详情</el-button>
        </template>
        <el-descriptions-item label="用户信息"
          >{{ detailForm.name }}
          {{ detailForm.customerNo }}</el-descriptions-item
        >
        <el-descriptions-item label="当前余额"
          ><span class="text-success"
            >￥{{ detailForm.balanceAmount }}</span
          ></el-descriptions-item
        >
        <el-descriptions-item label="客户电话">{{
          detailForm.phoneNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="客户分组">{{
          detailForm.customerGroupEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="客户类型">{{
          detailForm.customerTypeEnum.Desc
        }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{
          detailForm.address
        }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{
          detailForm.remark
        }}</el-descriptions-item>

        <el-descriptions-item
          label="当前跟进人"
          v-if="
            detailForm.customerFollowUpList &&
            detailForm.customerFollowUpList.length > 0
          "
        >
          <span
            :style="{
              color:
                new Date(detailForm.customerFollowUpList[0].nextFollowUpTime) <
                new Date()
                  ? '#E45656'
                  : '',
            }"
          >
            {{
              getTxtSleep(detailForm.customerFollowUpList[0].user.name) +
              " " +
              (new Date(detailForm.customerFollowUpList[0].nextFollowUpTime) <
              new Date()
                ? "[已超时]"
                : "")
            }}
          </span>
        </el-descriptions-item>
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
          <balanceDetailList :id="$route.query.id" v-if="$route.query.id" />
        </el-tab-pane>
        <el-tab-pane label="历史跟进记录" name="second">
          <el-table :data="historyList" stripe style="width: 100%">
            <el-table-column prop="customerFollowUp.user.name" label="跟进人">
            </el-table-column>
            <el-table-column label="客户分组变化">
              <template slot-scope="{ row }">
                <span
                  >{{ row.originalCustomerGroupEnum.Desc }}
                  <i class="el-icon-caret-right" />
                  {{ row.newCustomerGroupEnum.Desc }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="客户类型变化">
              <template slot-scope="{ row }">
                <span
                  >{{ row.originalCustomerTypeEnum.Desc }}
                  <i class="el-icon-caret-right" />
                  {{ row.originalCustomerTypeEnum.Desc }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="followUpContent" label="跟进内容">
            </el-table-column>
            <el-table-column prop="nextFollowUpTime" label="预计下次跟进时间">
            </el-table-column>
            <el-table-column prop="followUpTime" label="记录创建时间">
            </el-table-column>
          </el-table>
          <div class="tab-foot">
            <el-button type="primary">查看更多</el-button>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="跟进提醒" name="third"></el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getCustomerDetailById,
  customerFollowUpDetailFindPageByCustomer,
} from "@/api/vehicle-monitoring/customer";
import balanceDetailList from "./components/balanceDetailList.vue";
export default {
  data() {
    return {
      detailForm: {
        customerGroupEnum: {},
        customerTypeEnum: {},
        customerFollowUpList: [{ user: {} }],
        creator: {},
      },
      operTips: "first",
      // 历史跟进记录列表
      historyList: [],
    };
  },
  components: {
    balanceDetailList,
  },
  mounted() {
    this.getDetail();
    this.getHistoryList();
  },
  methods: {
    getDetail() {
      getCustomerDetailById({ id: this.$route.query.id }).then((res) => {
        this.detailForm = res.data;
      });
    },
    // 跳转至跟进详情
    toFloowDetail() {
      this.$router.push({
        name: "floow-detail",
        query: {
          floowId: this.detailForm.customerFollowUpList[0].id,
          customerId: this.$route.query.id,
        },
      });
    },
    getHistoryList() {
      var data = {
        customerId: this.$route.query.id,
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
      };
      customerFollowUpDetailFindPageByCustomer(data).then((res) => {
        if (res.success) {
          this.historyList = res.data;
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
