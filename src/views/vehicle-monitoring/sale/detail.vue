<template>
    <div class="app-container home">
        <!-- 详情描述 -->
        <div class="head">
            <el-descriptions title="销售单详情">
                <el-descriptions-item label="单号">kooriookami</el-descriptions-item>
                <el-descriptions-item label="客户">KH-220418001 李小宝</el-descriptions-item>
                <el-descriptions-item label="客户姓名">李小宝</el-descriptions-item>
                <el-descriptions-item label="客户电话">18100000000</el-descriptions-item>
                <el-descriptions-item label="客户地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
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

    .head {
        background-color: white;
        padding: 15px;
        border-radius: 8px;
    }

}
</style>