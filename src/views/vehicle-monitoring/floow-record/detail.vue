<template>
  <div class="app-container home">
    <div class="head mb10">
      <el-descriptions title="客户信息">
        <el-descriptions-item label=""
          ><span style="font-weight: 500;">李小宝 KH-220418001</span></el-descriptions-item
        >
        <el-descriptions-item label="当前余额"
          >￥{{ 66000 | thousandSymbol }}</el-descriptions-item
        >
        <el-descriptions-item label="客户电话"
          >130293912939</el-descriptions-item
        >
        <el-descriptions-item label="客户分组">成交</el-descriptions-item>
        <el-descriptions-item label="客户类型">毛坯房</el-descriptions-item>
        <el-descriptions-item label="地址">春光小区</el-descriptions-item>
        <el-descriptions-item label="备注">比较抠</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="head mb10">
      <el-descriptions>
        <el-descriptions-item label="客户跟进状态">已结束</el-descriptions-item>
        <el-descriptions-item label="跟进记录类型"
          >拨打电话</el-descriptions-item
        >
        <el-descriptions-item label="跟进用户">觉得仨接</el-descriptions-item>
        <el-descriptions-item label="跟进时间"
          >2022-08-02 14:44:53</el-descriptions-item
        >
        <el-descriptions-item label="客户类型变化"
          >毛坯房>毛坯房</el-descriptions-item
        >
        <el-descriptions-item label="客户分组变化"
          >成交>成交</el-descriptions-item
        >
        <el-descriptions-item label="跟进内容"
          >拨打电话联系客户，客户联系方式：130****2345</el-descriptions-item
        >
        <el-descriptions-item label="是否继续跟进"
          >停止跟进</el-descriptions-item
        >
      </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {};
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
