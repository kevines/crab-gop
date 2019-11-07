<!--任务类报表-->
<template>
  <div class="app-container">
    <!--查询及其他操作-->
    <div class="filter-container">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        label-width="120px"
      >
        <el-form-item label="执行任务编号" prop="taskDoBizId">
          <el-input v-model="searchForm.taskDoBizId" placeholder="请输入"/>
        </el-form-item>
        <!--   <el-form-item label="交易号" prop="tradeBizId">
          <el-input v-model="searchForm.tradeBizId" placeholder="请输入"/>
        </el-form-item> -->
        <el-form-item label="任务编号" prop="configBizId">
          <el-input v-model="searchForm.configBizId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择任务状态">
            <el-option label="已完成" value="已完成"/>
            <el-option label="待发放" value="待分配"/>
            <el-option label="全部" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="searchForm.payType" placeholder="请选择支付方式">
            <el-option label="余额" value="余额"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商家编号" prop="sellerUserId">
          <el-input v-model="searchForm.sellerUserId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="执行合伙人编号" prop="joinPartner">
          <el-input v-model="searchForm.joinPartner" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="任务执行时间" prop="doTime">
          <el-date-picker
            v-model="searchForm.doTime"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
          />
        </el-form-item>
        <el-form-item label="交易完成时间" prop="gmtPayTime">
          <el-date-picker
            v-model="searchForm.gmtPayTime"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleRest('searchForm')">重置</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--查询列表-->
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
      <el-table-column align="center" prop="doBizId" label="执行任务编号" width="150px"/>
      <el-table-column align="center" prop="tradeBizId" label="交易号" width="150px"/>
      <el-table-column align="center" prop="categoryStr" label="任务类目"/>
      <el-table-column align="center" prop="statusStr" label="任务状态"/>
      <el-table-column align="center" prop="configBizId" label="任务编号" width="150px"/>
      <el-table-column align="center" prop="sellerUserId" label="商家编号" width="150px"/>
      <el-table-column align="center" prop="userId" label="执行任务合伙人编号" width="150px"/>
      <el-table-column align="center" prop="taskFee" label="任务佣金（元）"/>
      <el-table-column align="center" prop="payAmount" label="实付任务佣金（元）"/>
      <el-table-column align="center" prop="platformRate" label="总部分佣比例（%）" width="100px"/>
      <el-table-column
        align="center"
        prop="platformRateCommission"
        label="总部分佣金额（元）"
        width="100px"
      />
      <el-table-column align="center" prop="platformRateUserId" label="总部分佣去向编号" width="130px"/>
      <el-table-column align="center" prop="townPartnerRate" label="乡镇分佣比例（%）" width="100px"/>
      <el-table-column align="center" prop="townPartnerCommission" label="乡镇分佣金额（元）" width="100px"/>
      <el-table-column align="center" prop="townPartnerUserId" label="乡镇分佣去向编号" width="130px"/>
      <el-table-column align="center" prop="joinPartnerRate" label="合伙人分佣比例（%）" width="110px"/>
      <el-table-column
        align="center"
        prop="joinPartnerCommission"
        label="合伙人分佣金额（元）"
        width="110px"
      />
      <el-table-column align="center" prop="joinPartnerUserId" label="合伙人分佣去向编号" width="140px"/>
      <el-table-column
        align="center"
        prop="otherRateList[0].rate"
        label="其他角色1比例（%）"
        width="130px"
      />
      <el-table-column
        align="center"
        prop="otherRateList[0].commission"
        label="其他角色1分佣金额（元）"
        width="130px"
      />
      <el-table-column
        align="center"
        prop="otherRateList[0].userId"
        label="其他角色1分佣去向编号"
        width="150px"
      />
      <el-table-column
        align="center"
        prop="otherRateList[1].rate"
        label="其他角色2比例（%）"
        width="130px"
      />
      <el-table-column
        align="center"
        prop="otherRateList[1].commission"
        label="其他角色2分佣金额（元）"
        width="130px"
      />
      <el-table-column
        align="center"
        prop="otherRateList[1].userId"
        label="其他角色2分佣去向编号"
        width="150px"
      />
      <el-table-column align="center" prop="doTime" label="任务执行时间" width="140px"/>
      <el-table-column align="center" prop="gmtPayTime" label="佣金支付时间" width="140px"/>
      <el-table-column align="center" prop="overTime" label="任务完成时间" width="140px"/>
      <el-table-column align="center" prop="payType" label="佣金支付方式" width="100px"/>
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
import { queryTaskStatement } from '@/api/finance/statement'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10,
        taskDoBizId: '', // 执行任务编号
        tradeBizId: '', // 交易号
        configBizId: '', // 任务编号
        status: '', // 任务状态
        payType: '', // 支付方式
        sellerUserId: '', // 商家编号
        joinPartner: '', // 执行合伙人编号
        doTime: '', // 任务执行时间
        gmtPayTime: '' // 交易完成时间
      },
      listLoading: false,
      list: [],
      total: 100
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
      queryTaskStatement(para).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
    },
    queryPara() {
      const para = {
        taskDoBizId: this.searchForm.taskDoBizId,
        tradeBizId: this.searchForm.tradeBizId,
        configBizId: this.searchForm.configBizId,
        status: this.searchForm.status,
        payType: this.searchForm.payType,
        sellerUserId: this.searchForm.sellerUserId,
        joinPartner: this.searchForm.joinPartner,
        overTimeBegin: this.searchForm.doTime[0]
          ? this.$moment(new Date(this.searchForm.doTime[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        overTimeEnd: this.searchForm.doTime[1]
          ? this.$moment(new Date(this.searchForm.doTime[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        gmtPayBegin: this.searchForm.gmtPayTime[0]
          ? this.$moment(new Date(this.searchForm.gmtPayTime[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        gmtPayEnd: this.searchForm.gmtPayTime[1]
          ? this.$moment(new Date(this.searchForm.gmtPayTime[1])).format(
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
      const url =
        process.env.BASE_API +
        '/taskDo/exportExcel.do?taskDoBizId=' +
        para.taskDoBizId +
        '&tradeBizId=' +
        para.tradeBizId +
        '&configBizId=' +
        para.configBizId +
        '&' +
        'status=' +
        para.status +
        '&' +
        'payType=' +
        para.payType +
        '&sellerUserId=' +
        para.sellerUserId +
        '&joinPartner=' +
        para.joinPartner +
        '&' +
        'overTimeBegin=' +
        para.overTimeBegin +
        '&overTimeEnd=' +
        para.overTimeEnd +
        '&gmtPayBegin=' +
        para.gmtPayBegin +
        '&' +
        'gmtPayEnd=' +
        para.gmtPayEnd
      window.location.href = url
    },
    // 重置查询条件
    handleRest(form) {
      this.$refs[form].resetFields()
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

