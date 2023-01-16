<template>
  <!-- 目前在项目中只用作于加载 图片 -->
  <el-image
    :src="`${realSrc}`"
    fit="cover"
    :style="`width:${realWidth};height:${realHeight};`"
    :preview-src-list="realSrcList"
  >
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  name: "ImagePreview",
  props: {
    src: {
      type: String,
      required: true,
    },
    width: {
      type: [Number, String],
      default: "",
    },
    height: {
      type: [Number, String],
      default: "",
    },
    order: {
      type: String,
      default: "",
    },
  },
  computed: {
    realSrc() {
      let real_src = this.src.split(",")[0];
      if (isExternal(real_src)) {
        return real_src;
      }
      return this.typeUrl + real_src;
    },
    // 区分商品还是单据图片
    typeUrl() {
      if (!this.order) {
        return process.env.VUE_APP_BASE_COMMODITY_IMG;
      }
      if (this.order == "precollect") {
        return process.env.VUE_APP_PRECOLLECT_ORDER_IMG;
      } else if (this.order == "expense") {
        return process.env.VUE_APP_EXPENSE_ORDER_IMG;
      } else if (this.order == "income") {
        return process.env.VUE_APP_INCOME_ORDER_IMG;
      } else if (this.order == "prepay") {
        return process.env.VUE_APP_PREPAY_ORDER_IMG;
      } else if (this.order == "outpostBack") {
        return process.env.VUE_APP_OUT_POST_BACK_IMG;
      } else if (this.order == "outpaper") {
        return process.env.VUE_APP_OUT_PAPER_IMG;
      } else if (this.order == "outaddress") {
        return process.env.VUE_APP_OUT_PLACENT_IMG;
      } else if (this.order == "inpaper") {
        return process.env.VUE_APP_IN_PAPER_IMG;
      } else if (this.order == "funpaypaper") {
        return process.env.VUE_APP_FUNPAY_PAPER_IMG;
      } else if (this.order == "funpaycomprobante") {
        return process.env.VUE_APP_FUNPAY_COMPRO_IMG;
      } else if (this.order == "funcollectpaper") {
        return process.env.VUE_APP_FUNCOLLECT_PAPER_IMG;
      } else if (this.order == "funcollectcomprobante") {
        return process.env.VUE_APP_FUNCOLLECT_COMPRO_IMG;
      }
    },
    realSrcList() {
      let real_src_list = this.src.split(",");
      let srcList = [];
      real_src_list.forEach((item) => {
        if (isExternal(item)) {
          return srcList.push(item);
        }
        return srcList.push(this.typeUrl + item);
      });
      return srcList;
    },
    realWidth() {
      return typeof this.width == "string" ? this.width : `${this.width}px`;
    },
    realHeight() {
      return typeof this.height == "string" ? this.height : `${this.height}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;
  ::v-deep .el-image__inner {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
  ::v-deep .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>
