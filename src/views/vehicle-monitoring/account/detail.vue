<template>
  <div class="app-container home">
    <!-- 详情描述 -->
    <div class="description mb15">
      <el-descriptions :title="account.name">
        <el-descriptions-item label="余额"
          >￥{{ account.balanceAmount }}</el-descriptions-item
        >
        <!-- <el-descriptions-item label="类型">微信钱包</el-descriptions-item>
        <el-descriptions-item label="备注">无</el-descriptions-item> -->
        <el-descriptions-item label="账户累计流入"
          >¥{{ account.totalInflowAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="账户累计流出"
          >¥{{ account.totalOutflowAmount }}</el-descriptions-item
        >
      </el-descriptions>
    </div>
    <div class="main">
      <el-form
        :model="postForm"
        ref="queryForm"
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="dateRange"
            style="width: 220px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectQueryDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getTransactionList"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!--  -->
      <el-table v-loading="loading" :data="transactionList">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column
          label="名称"
          align="center"
          prop="fundAccountDetailTypeEnum.Desc"
          width="120"
        />
        <el-table-column
          label="变动余额"
          align="center"
          prop="customerFollowUp.user.name"
        >
          <template slot-scope="{ row }">
            <span
              :style="
                row.fundAccountDetailTypeEnum.Name.startsWith('In')
                  ? '#53C21D'
                  : ''
              "
              >{{
                row.fundAccountDetailTypeEnum.Name.startsWith("In") ? "+" : "-"
              }}￥{{ row.changeAmount }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="关联单据" align="center" prop="relatedOrderNo">
          <template slot-scope="{ row }">
            {{ row.relatedOrderNo || "草稿" }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="200"
        />
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
              icon="el-icon-view"
              @click="handleDetail(scope.row.id)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 详情 -->
    <el-dialog
      title="资金账户明细详情"
      :visible.sync="detailVisble"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="detailForm" label-width="80px">
        <el-form-item label="变动类型">
          <span>{{ detailForm.fundAccountDetailTypeEnum.Desc }}</span>
        </el-form-item>
        <el-form-item label="变动金额">
          <span>￥{{ detailForm.changeAmount | priceFixedTwo }}</span>
        </el-form-item>
        <el-form-item label="关联单号">
          <span>{{ detailForm.relatedOrderNo }}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{ detailForm.remark }}</span>
        </el-form-item>
        <el-form-item label="变动时间">
          <span>{{ detailForm.createTime }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toOrderDetail">跳转单据</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAccountDetail,
  findListByFundAccountId,
  findAccountBlanceDetailById,
} from "@/api/vehicle-monitoring/account";
export default {
  data() {
    return {
      loading: false,
      detailVisble: false,
      dateRange: [],
      detailForm: {
        fundAccountDetailTypeEnum: {},
      },
      postForm: {
        fundAccountId: "",
        minCreateDate: "",
        maxCreateDate: "",
      },
      transactionList: [],
      account: {},
    };
  },
  mounted() {
    this.postForm.fundAccountId = this.$route.query.id;
    this.getDetail();
    this.getTransactionList();
  },
  methods: {
    // 获取详情
    getDetail() {
      getAccountDetail({
        id: this.postForm.fundAccountId,
      }).then((res) => {
        if (res.success) {
          this.account = res.data;
        }
      });
    },
    // 获取卡片列表
    getTransactionList() {
      this.loading = true;
      findListByFundAccountId(this.postForm).then((res) => {
        if (res.success) {
          this.transactionList = res.data;
        } else {
          this.transactionList = null;
        }
        this.loading = false;
      });
    },
    // 选择查询日期
    selectQueryDate(val) {
      if (!val) {
        this.postForm.minCreateDate = "";
        this.postForm.maxCreateDate = "";
        return;
      }
      this.postForm.minCreateDate = val[0];
      this.postForm.maxCreateDate = val[1];
      this.getTransactionList();
    },
    async handleDetail(id) {
      let res = await findAccountBlanceDetailById({ id: id });
      if (res) {
        this.detailForm = res.data;
        this.detailVisble = true;
      }
    },
    // 跳转单据
    toOrderDetail() {
      let url = this.$thinking.toOrderPage(
        this.detailForm.fundAccountDetailTypeEnum.Name,
        this.detailForm.relatedOrderId
      );
      this.$router.push({
        path: url,
      });
    },
    // 重置
    resetQuery() {
      this.dateRange = [];
      this.postForm.minCreateDate = "";
      this.postForm.maxCreateDate = "";
      this.getTransactionList();
    },
    cancel() {
      this.detailVisble = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: #fafafa;

  .description {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>
