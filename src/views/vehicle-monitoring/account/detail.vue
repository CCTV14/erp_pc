<template>
    <div class="app-container home">
        <!-- 详情描述 -->
        <div class="description mb15" v-for="(item, index) in 4" :key="index">
            <el-descriptions title="资金账户详情">
                <el-descriptions-item label="账户">12xx3</el-descriptions-item>
                <el-descriptions-item label="余额">￥234.00</el-descriptions-item>
                <el-descriptions-item label="类型">微信钱包</el-descriptions-item>
                <el-descriptions-item label="备注">无</el-descriptions-item>
                <el-descriptions-item label="账户累计流入">¥100，766.00</el-descriptions-item>
                   <el-descriptions-item label="账户累计流出">¥101，000.00</el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
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