<!-- 财务充值申请页面 -->
/*
 * @Author: wangyang
 * @Date: 2019-03-19 19:34:55
 * @Last Modified by: wangyang
 * @Last Modified time: 2019-04-10 15:37:58
 */
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="充值记录" name="chargeList"/>
      <el-tab-pane label="我要充值" name="toRecharge"/>
    </el-tabs>
    <component :is="currentView" keep-alive/>
  </div>
</template>

<script>
import chargeList from '@/views/operation/chargeList'
import toRecharge from '@/views/operation/toRecharge'

export default {
  name: 'ChargeApply',
  components: {
    chargeList,
    toRecharge
  },
  data() {
    return {
      activeName: 'chargeList',
      currentView: chargeList,
      chargeList: chargeList,
      toRecharge: toRecharge
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'chargeList') {
        this.currentView = chargeList
      } else {
        this.currentView = toRecharge
      }
    }
  }
}
</script>
<style>

</style>
