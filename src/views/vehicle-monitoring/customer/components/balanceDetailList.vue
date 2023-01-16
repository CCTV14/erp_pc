<template>
  <div>
    <el-table :data="priceList" stripe style="width: 100%">
      <el-table-column prop="changeTypeEnum.Desc" label="变动类型">
      </el-table-column>
      <el-table-column prop="changeAmount" label="变动金额">
        <template slot-scope="{ row }">
          <span>￥{{ row.changeAmount | priceFixedTwo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="变动时间"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <!-- <el-table-column
              label="操作"
              fixed="right"
              align="center"
              width="120"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-right"
                  >跳转单据</el-button
                >
              </template>
            </el-table-column> -->
    </el-table>
    <div class="tab-foot">
      <el-button type="primary">查看更多</el-button>
    </div>
  </div>
</template>

<script>
import { customerBalanceDetailFindPageByCustomer } from "@/api/vehicle-monitoring/customer";
export default {
  data() {
    return {
      // 余额明细列表
      priceList: [],
    };
  },
  props: {
    id: String,
  },
  mounted() {
    this.getPirceList();
  },
  methods: {
    getPirceList() {
      var data = {
        customerId: this.id,
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
      };
      customerBalanceDetailFindPageByCustomer(data).then((res) => {
        if (res.success) {
          this.priceList = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
