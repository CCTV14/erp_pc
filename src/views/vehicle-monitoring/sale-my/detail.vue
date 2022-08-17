<template>
    <div class="app-container home">
        <!-- 详情描述 -->
        <div class="head mb15">
            <el-descriptions title="销售单详情">
                <el-descriptions-item label="单号">kooriookami</el-descriptions-item>
                <el-descriptions-item label="客户">KH-220418001 李小宝</el-descriptions-item>
                <el-descriptions-item label="客户姓名">李小宝</el-descriptions-item>
                <el-descriptions-item label="客户电话">18100000000</el-descriptions-item>
                <el-descriptions-item label="客户地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            </el-descriptions>
        </div>
        <!-- 商品列表 -->
        <div class="commodity_list mb15">
            <el-descriptions title="所选商品">
                <el-descriptions-item label="" :labelStyle="{ 'display': 'none' }" :contentStyle="{ 'width': '100%' }">
                    <el-table :data="tableData" stripe v-loading="loading">
                        <el-table-column prop="commodityName" label="商品名称" align="center">
                        </el-table-column>
                        <el-table-column prop="color" label="颜色" align="center">
                        </el-table-column>
                        <el-table-column prop="unit" label="规格" align="center">
                        </el-table-column>
                        <el-table-column prop="imgUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <el-image style="width: 65px; height: 60px" :src="scope.row.imgUrl"
                                    :preview-src-list="[scope.row.imgUrl]">
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="单价" align="center">
                        </el-table-column>
                        <el-table-column prop="buyNum" label="购买数量" align="center">
                        </el-table-column>
                        <el-table-column prop="commodityBuyingTotalAmount" label="总零售价" align="center">
                            <template slot-scope="scope">
                                ￥{{ scope.row.commodityBuyingTotalAmount }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="itemAmount" label="成交价" align="center">
                            <template slot-scope="scope">
                                ￥{{ scope.row.itemAmount }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <!-- 详细信息 -->
        <div class="description mb20">
            <el-descriptions title="用户信息">
                <el-descriptions-item label="单据金额">kooriookami</el-descriptions-item>
                <el-descriptions-item label="总零售价">18100000000</el-descriptions-item>
                <el-descriptions-item label="折扣金额">苏州市</el-descriptions-item>
                <el-descriptions-item label="收款进度">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                <el-descriptions-item label="待收金额">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
                <el-descriptions-item label="收款中金额">1</el-descriptions-item>
                <el-descriptions-item label="已收金额">1</el-descriptions-item>
                <el-descriptions-item label="收款优惠金额">1</el-descriptions-item>
                <el-descriptions-item label="退款中金额">1</el-descriptions-item>
                <el-descriptions-item label="已退款金额">1</el-descriptions-item>
                <el-descriptions-item label="全部收款时间">1</el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            tableData: [{
                commodityName: "3号桌椅",
                color: "红色",
                unit: "04#椅子",
                imgUrl: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                amount: 200,
                buyNum: 6,
                commodityBuyingTotalAmount: 180,
                itemAmount: 160
            }, {
                commodityName: "4号桌椅",
                color: "红色",
                unit: "05#椅子",
                imgUrl: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                amount: 195,
                buyNum: 6,
                commodityBuyingTotalAmount: 180,
                itemAmount: 160
            },
            {
                commodityName: "5号桌椅",
                color: "红色",
                unit: "06#椅子",
                imgUrl: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                amount: 190,
                buyNum: 6,
                commodityBuyingTotalAmount: 180,
                itemAmount: 160
            },
            {
                commodityName: "6号桌椅",
                color: "红色",
                unit: "07#椅子",
                imgUrl: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                amount: 220,
                buyNum: 6,
                commodityBuyingTotalAmount: 180,
                itemAmount: 160
            }]
        }
    },
    mounted() {
        this.loading = false;
    }
}
</script>

<style lang="scss" scoped>
.home {
    background: #fafafa;

    .head,
    .commodity_list,
    .description {
        background-color: white;
        padding: 15px;
        border-radius: 8px;
    }

}
</style>