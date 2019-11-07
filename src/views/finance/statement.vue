<!-- 业务报表页面 -->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="交易类报表" name="tradingStatement"/>
      <el-tab-pane label="任务类报表" name="taskStatement"/>
    </el-tabs>
    <component :is="currentView" keep-alive/>
  </div>
</template>
<script>
import tradingStatement from '@/views/finance/tradingStatement'
import taskStatement from '@/views/finance/taskStatement'
export default {
  components: {
    tradingStatement,
    taskStatement
  },
  data() {
    return {
      activeName: 'tradingStatement',
      currentView: tradingStatement,
      tradingStatement: tradingStatement,
      taskStatement: taskStatement
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'tradingStatement') {
        this.currentView = tradingStatement
      } else {
        this.currentView = taskStatement
      }
    }
  }
}
</script>
<style>
</style>
