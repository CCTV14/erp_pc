<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="head mb10">
      <el-descriptions title="客户跟进详情">
        <el-descriptions-item label="跟进用户">{{
          detailForm.user.name
        }}</el-descriptions-item>
        <el-descriptions-item label="跟进状态">
          <span class="text-primary">
            {{ detailForm.customerFollowUpStatusEnum.Desc }}</span
          >
        </el-descriptions-item>
        <el-descriptions-item label="跟进内容">{{
          detailForm.followUpContent
        }}</el-descriptions-item>
        <el-descriptions-item label="预计下次跟进时间">{{
          detailForm.nextFollowUpTime || "无"
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 变动详细 -->
    <div>
      <el-tabs v-model="operTips" @tab-click="handleTabClick">
        <el-tab-pane label="余额变动明细" name="first">
          <balanceDetailList :id="$route.query.customerId" />
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="second">
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
        <el-tab-pane label="跟进提醒" name="third">
          <!-- <el-table :data="remindList" stripe style="width: 100%">
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
          </el-table> -->
          <div class="tab-foot">
            <el-button type="primary" @click="addTips">新增提醒</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 点击详情表格 -->
    <el-dialog title="新增提醒" :visible.sync="tipsVisble" width="65%">
      <el-form :model="tipsForm">
        <el-form-item>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="tipsForm.remindContent"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tipsVisble = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitTips"
          v-if="$thinking.checkAuth('Customer_AddNewRemind')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  customerFloowFindById,
  findPageByFollowUp,
  customerFollowUpRemindFindByPage,
  customerFollowUpRemindAddNewRemind,
} from "@/api/vehicle-monitoring/customer";
import balanceDetailList from "./components/balanceDetailList.vue";
export default {
  data() {
    return {
      tipsForm: {
        customerFollowUpId: this.$route.query.floowId,
        remindContent: "",
      },
      tipsVisble: false,
      detailForm: {
        user: {},
        customerFollowUpStatusEnum: {},
      },
      operTips: "first",
      // 历史跟进记录列表
      historyList: [],
      // 提醒列表
      remindList: [],
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
      customerFloowFindById({ id: this.$route.query.floowId }).then((res) => {
        this.detailForm = res.data;
      });
    },
    // 新增提醒打开
    addTips() {
      this.tipsForm.remindContent = "";
      this.tipsVisble = true;
    },
    getHistoryList() {
      var data = {
        followUpId: this.$route.query.floowId,
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
      };
      findPageByFollowUp(data).then((res) => {
        if (res.success) {
          this.historyList = res.data;
        }
      });
    },
    getRemindList() {
      customerFollowUpRemindFindByPage({
        followUpId: this.$route.query.floowId,
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
      }).then((res) => {
        if (res.success) {
          this.remindList = res.data;
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
    // 新增提醒
    submitTips() {
      var that = this;
      customerFollowUpRemindAddNewRemind(this.tipsForm).then((res) => {
        if (res.success) {
          that.tipsVisble = false;
          that.getRemindList();
        }
      });
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
