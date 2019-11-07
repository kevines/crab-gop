<!--历史余额-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="日期" prop="dateTime">
          <el-date-picker
            v-model="searchForm.dateTime"
            :picker-options="pickerOptions0"
            type="date"
            placeholder="选择日期"
          />
          <span class="yesterday" @click="yesterday">昨天</span>
          <span class="yesterday" @click="beforeYesterday">前天</span>
        </el-form-item>
        <el-row class="export">
          <el-col :span="7">
            <el-form-item>
              <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="context">导出的历史余额为每个自然日最后一刻的余额情况</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        dateTime: ''
      },
      pickerOptions0: {
        // 时间选择控制为三个月内
        disabledDate(time) {
          const curDate = new Date().getTime()
          const three = 90 * 24 * 3600 * 1000
          const threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      }
    }
  },
  created() {
    this.getTime()
  },
  methods: {
    getTime() {
      const date = new Date()
      this.searchForm.dateTime = date
    },
    // 昨天
    yesterday() {
      const date = new Date()
      this.searchForm.dateTime = date.setTime(date.getTime() - 3600 * 1000 * 24)
    },
    // 前天
    beforeYesterday() {
      const date = new Date()
      this.searchForm.dateTime = date.setTime(date.getTime() - 3600 * 1000 * 48)
    },
    // 导出历史余额
    exportExcel() {
      const para = {
        dateTime: this.searchForm.dateTime ? this.$moment(new Date(this.searchForm.dateTime)).format('YYYY-MM-DD') : ''
      }
      const url = process.env.BASE_API + '/appUser/exportExcelOldAmount.do?dateTime=' + para.dateTime
      window.location.href = url
    }
  }
}
</script>
<style>
.searchForm {
  margin-top: 50px;
  margin-left: 120px;
}
.yesterday {
  margin-left: 30px;
}
.export {
  margin-top: 5px;
  margin-left: 300px;
}
.context{
  margin-left: 120px;
  margin-top: 50px;
  font-size: 14px;
}
</style>

