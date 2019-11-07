<!-- 广告管理页面 -->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="引导页管理" name="banner"/>
      <el-tab-pane label="闪屏广告页管理" name="bannerCutdown"/>
    </el-tabs>
    <component :is="currentView" keep-alive/>
  </div>
</template>
<script>
import banner from '@/views/operation/banner'
import bannerCutdown from '@/views/operation/bannerCutdown'
export default {
  components: {
    banner,
    bannerCutdown
  },
  data() {
    return {
      activeName: 'banner',
      currentView: banner,
      banner: banner,
      bannerCutdown: bannerCutdown
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'banner') {
        this.currentView = banner
      } else {
        this.currentView = bannerCutdown
      }
    }
  }
}
</script>
<style>
</style>
