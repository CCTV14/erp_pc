<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  name: 'App',
  methods: {
    // 各多少秒刷新一次，防止页面崩溃、内存溢出（多用于大屏页面开一晚上的情况
    reload() {
      console.log('刷新')
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    }
  },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  }
}
</script>
