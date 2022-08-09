<template>
  <div>
    <el-avatar :size="size" :src="src"></el-avatar>
  </div>
</template>

<script>
export default {
  name: "avatar",
  // computed: {
  // 	subName() {
  // 		if (this.userInfo.name) {
  // 			if (this.userInfo.name.length < this.nameLength) {
  // 				return this.userInfo.name;
  // 			} else {
  // 				return this.userInfo.name.substring(
  // 					this.userInfo.name.length - this.nameLength,
  // 					this.userInfo.name.length
  // 				)
  // 			}
  // 		}

  // 	},
  // 	avatarSize() {
  // 		if (this.size == "large") {
  // 			return '60px';
  // 		} else if (this.size == "medium") {
  // 			return '42px';
  // 		} else if (this.size == "small") {
  // 			return '30px';
  // 		} else {
  // 			return this.size;
  // 		}
  // 	}
  // },
  props: {
    userInfo: {
      type: Object,
      default: null
    },
    size: {
      type: [String, Number],
      default: "medium"
    },
    shape: {
      type: String,
      default: "circle"
    },
    src: {
      type: String,
      default: "circle"
    }
  }
};
</script>

<style>
</style>