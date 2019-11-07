<!--流水报表-->
<template>
  <div class="app-container">
    <!--查询及其他操作-->
    <div class="filter-container">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        label-width="130px"
      >
        <el-form-item label="订单编号/任务编号" prop="flowNo">
          <el-input v-model="searchForm.flowNo" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="执行人编号" prop="userId">
          <el-input v-model="searchForm.userId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker
            v-model="searchForm.payTime"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item label="完成时间" prop="gmtCreated">
          <el-date-picker
            v-model="searchForm.gmtCreated"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleQuery"
          >查询</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleRest('searchForm')"
          >重置</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="exportExcel"
          >导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--查询结果-->
    <el-table
      v-loading="listLoading"
      id="out-table"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      height="400"
    >
      <el-table-column align="center" prop="flowNo" label="订单编号/任务编号" width="180px"/>
      <el-table-column align="center" prop="bizId" label="交易号/流水号" width="170px"/>
      <el-table-column align="center" prop="goodsId" label="商品/任务编号" width="180px"/>
      <el-table-column align="center" prop="totalAmout" label="订单金额/支付任务佣金金额（元）" width="180px"/>
      <el-table-column align="center" prop="payTime" label="支付时间" width="150px"/>
      <el-table-column align="center" prop="gmtCreated" label="完成时间" width="150px"/>
      <el-table-column align="center" prop="userName" label="用户身份" width="100px"/>
      <el-table-column align="center" prop="tradeAmount" label="分佣金额（元）" />
      <el-table-column align="center" prop="toUserId" label="分佣去向" width="150px"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="searchForm.page"
      :limit.sync="searchForm.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { queryWaterReport } from '@/api/finance/waterReport'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        limit: 10,
        page: 1,
        flowNo: '',
        userId: '',
        payTime: '',
        startCreated: '',
        endCreated: '',
        startPayTime: '',
        endPayTime: '',
        gmtCreated: ''
      },
      total: 0,
      list: [],
      listLoading: false
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = this.queryPara()
      this.listLoading = true
      queryWaterReport(para).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
    },
    queryPara() {
      const para = {
        flowNo: this.searchForm.flowNo,
        userId: this.searchForm.userId,
        startCreated: this.searchForm.gmtCreated[0]
          ? this.$moment(new Date(this.searchForm.gmtCreated[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endCreated: this.searchForm.gmtCreated[1]
          ? this.$moment(new Date(this.searchForm.gmtCreated[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        startPayTime: this.searchForm.payTime[0]
          ? this.$moment(new Date(this.searchForm.payTime[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endPayTime: this.searchForm.payTime[1]
          ? this.$moment(new Date(this.searchForm.payTime[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      return para
    },

    // 导出
    exportExcel() {
      const para = this.queryPara()
      const url = process.env.BASE_API + '/paymentFlow/exportExcel.do?flowNo=' + para.flowNo + '&userId=' + para.userId + '&startCreated=' + para.startCreated + '&' +
                                                'endCreated=' + para.endCreated + '&' + 'startPayTime=' + para.startPayTime + '&endPayTime=' + para.endPayTime
      window.location.href = url
    },
    // 重置查询条件
    handleRest(form) {
      this.$refs[form].resetFields()
      this.$refs.searchForm.value = ''
      this.getList()
    },
    // 条件查询
    handleQuery() {
      this.getList()
    },
    // 初始化数据
    initData() {
      this.getList()
    }
  }
}
</script>
<style>
</style>

