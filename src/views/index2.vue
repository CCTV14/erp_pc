<template>
  <div class="app-container home">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="card bornone">
          <div slot="header" class="title">
            <span>最近使用</span>
          </div>
          <div class="cont">
            <div v-for="item in 9">
              <el-image
                style="width: 70px; height: 70px"
                :src="require('../assets/images/home/sale_order.png')"
              ></el-image>
              <div class="mt15">销售单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
     <el-row :gutter="24" class="mt20">
      <el-col :span="24">
        <el-card class="card bornone">
          <div slot="header" class="title">
            <span>我的待办</span>
          </div>
          <div class="cont">
            <div v-for="item in 9">
              <el-image
                style="width: 70px; height: 70px"
                :src="require('../assets/images/home/sale_order.png')"
              ></el-image>
              <div class="mt15">销售单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.3"
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  background: #fafafa;
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  .card {
    //   最近使用
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #4a4a4a;
    }
    .cont {
      display: flex;
      justify-content: space-around;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4a4a4a;
      text-align: center;
      div{

      }
    }
  }
}
</style>

