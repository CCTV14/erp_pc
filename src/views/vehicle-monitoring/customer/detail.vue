<template>
    <div class="app-container home">
        <!-- 详情描述 -->
        <div class="head mb10">
            <el-descriptions title="资金账户详情">
                <el-descriptions-item label="跟进用户">李小宝KH-123456789</el-descriptions-item>
                <el-descriptions-item label="跟进状态">跟进中</el-descriptions-item>
                <el-descriptions-item label="跟进内容">新增用户自动跟进</el-descriptions-item>
                <el-descriptions-item label="预计下次跟进时间">2022-04-18 00:36:00</el-descriptions-item>
            </el-descriptions>
        </div>
        <!-- 变动详细 -->
        <div>
            <el-tabs v-model="operTips" @tab-click="handleTabClick">
                <el-tab-pane label="余额变动明细" name="first"></el-tab-pane>
                <el-tab-pane label="跟进记录" name="second"></el-tab-pane>
                <el-tab-pane label="跟进提醒" name="third"></el-tab-pane>
            </el-tabs>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="changeTypeEnum.Desc" label="变动类型">
                </el-table-column>
                <el-table-column prop="changeAmount" label="变动金额">
                    <template slot-scope="{row}">
                        <span>￥{{ row.changeAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="afterChangeAmount" label="变动后金额">
                    <template slot-scope="{row}">
                        <span>￥{{row.afterChangeAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="300">
                </el-table-column>
                <el-table-column prop="lastEditTime" label="变动时间">
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="120"
                    class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-right">跳转单据</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            operTips: "first",
            tableData: [{
                id: "1",
                changeTypeEnum: {
                    Desc: '销售单消费'
                },
                changeAmount: 1000,
                afterChangeAmount: 766,
                remark: "销售单XS220803001审核通过，余额减少2963.49（销售单单据金额2963.49 - 关联预收单预收金额0.00）",
                lastEditTime: "2022-08-03 20:58:41"
            }]
        }
    },
    methods: {
        handleTabClick(val){
            console.log(val);
        }
    }
}
</script>

<style lang="scss" scoped>
.home {
    background: #fafafa;

    .head {
        background-color: white;
        padding: 15px;
        border-radius: 8px;
    }

}
</style>