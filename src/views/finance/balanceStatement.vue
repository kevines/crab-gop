<!--余额报表-->
<template>
  <div class="app-container">
    <!--查询操作-->
    <div class="filter-container">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="searchForm.userId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName">
          <el-input v-model="searchForm.realName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="时间" prop="gmtCreated">
          <el-date-picker
            v-model="searchForm.gmtCreated"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择期初时间"
            end-placeholder="请选择期末时间"
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
    <el-table
      v-loading="listLoading"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      height="400"
    >
      <el-table-column align="center" prop="userId" label="用户编号" width="180"/>
      <el-table-column align="center" prop="phone" label="用户手机号" width="150"/>
      <el-table-column align="center" prop="realName" label="用户姓名" width="150"/>
      <el-table-column align="center" prop="amountBegin" label="期初余额（元）"/>
      <el-table-column align="center" prop="amountTotal" label="贷款总额（元）"/>
      <el-table-column align="center" prop="amountCharge" label="充值总额（元）"/>
      <el-table-column align="center" prop="amountConsumption" label="消费总额（元）"/>
      <el-table-column align="center" prop="amountWithdrawal" label="提现总额（元）"/>
      <el-table-column align="center" prop="amountFrozen" label="冻结总额（元）"/>
      <el-table-column align="center" prop="amountThaw" label="解冻总额（元）"/>
      <el-table-column align="center" prop="amountCommission" label="佣金总额（元）"/>
      <el-table-column align="center" prop="amountEnd" label="期末余额（元）"/>
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
import { queryBalance } from '@/api/finance/balanceStatement'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        userId: '',
        phone: '',
        realName: '',
        gmtCreated: '',
        page: 1,
        limit: 10
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
    getList() {
      const para = this.queryPara()
      this.listLoading = true
      queryBalance(para).then(res => {
        this.list = res.data.data.data
        this.total = parseInt(res.data.data.count)
        this.listLoading = false
      })
    },
    queryPara() {
      const para = {
        page: this.searchForm.page,
        limit: this.searchForm.limit,
        userId: this.searchForm.userId,
        phone: this.searchForm.phone,
        realName: this.searchForm.realName,
        startCreated: this.searchForm.gmtCreated[0]
          ? this.$moment(new Date(this.searchForm.gmtCreated[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endCreated: this.searchForm.gmtCreated[1]
          ? this.$moment(new Date(this.searchForm.gmtCreated[1])).format(
            'YYYY-MM-DD'
          )
          : ''
      }
      return para
    },
    // 导出
    exportExcel() {
      const para = this.queryPara()
      const url =
        process.env.BASE_API +
        '/appUser/exportExcelAmountReport.do?userId=' +para.userId +
        '&phone=' +para.phone +
        '&realName=' + para.realName +
        '&startCreated=' + para.startCreated +
        '&endCreated=' + para.endCreated
      window.location.href = url
    },
    /**
     * 条件查询
     */
    handleQuery() {
      this.getList()
    },
    /**
     * 重置查询条件
     */
    handleRest(form) {
      this.$refs[form].resetFields()
      this.$refs.searchForm.value = ''
      this.getList()
    },
    initData() {
      this.getList()
    }
  }
}
</script>
<style>
</style>

