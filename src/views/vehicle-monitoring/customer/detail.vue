<template>
    <div class="app-container home">
        <!-- 详情描述 -->
        <div class="head mb15">
            <el-descriptions title="资金账户详情">
                <el-descriptions-item label="跟进用户">李小宝KH-123456789</el-descriptions-item>
                <el-descriptions-item label="跟进状态">跟进中</el-descriptions-item>
                <el-descriptions-item label="跟进内容">新增用户自动跟进</el-descriptions-item>
                <el-descriptions-item label="预计下次跟进时间">2022-04-18 00:36:00</el-descriptions-item>
            </el-descriptions>
        </div>
        <!-- 变动详细 -->
        <div>
            <el-tabs v-model="operTips" @tab-click="handleClick">
                <el-tab-pane label="余额变动明细" name="first"></el-tab-pane>
                <el-tab-pane label="跟进记录" name="second"></el-tab-pane>
                <el-tab-pane label="跟进提醒" name="third"></el-tab-pane>
            </el-tabs>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="date" label="变动类型" width="180">
                </el-table-column>
                <el-table-column prop="name" label="变动金额" width="180">
                </el-table-column>
                <el-table-column prop="address" label="变动后金额">
                </el-table-column>
                <el-table-column prop="address" label="备注">
                </el-table-column>
                <el-table-column prop="address" label="变动时间">
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
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
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