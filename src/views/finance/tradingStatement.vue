<!--交易类报表页面-->
<template>
  <div class="app-container">
    <!--查询及其他操作-->
    <div class="filter-container">
      <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="110px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="searchForm.orderNo" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="交易号" prop="tradeNo">
          <el-input v-model="searchForm.tradeNo" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="searchForm.goodsId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="searchForm.orderStatus" clearable placeholder="请选择">
            <el-option
              v-for="item in queryOrderTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="售后状态" prop="returnStatus">
          <el-select v-model="searchForm.returnStatus" clearable placeholder="请选择">
            <el-option
              v-for="item in queryAfterSaleTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属类目" prop="categoryId">
          <el-select v-model="searchForm.categoryId" clearable placeholder="请选择">
            <el-option
              v-for="item in queryCategoryTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="searchForm.payType" placeholder="请选择">
            <el-option
              v-for="item in queryPayTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商家编号" prop="sellerUserId">
          <el-input v-model="searchForm.sellerUserId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="买家编号" prop="buyerUserId">
          <el-input v-model="searchForm.buyerUserId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker
            v-model="searchForm.payTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="交易完成时间" prop="doneTime">
          <el-date-picker
            v-model="searchForm.doneTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
      <el-table-column align="center" prop="orderNo" label="订单编号" width="160px"/>
      <el-table-column align="center" prop="tradeNo" label="交易号" width="170px"/>
      <el-table-column align="center" prop="orderStatus" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatusName===''" type="primary">--</span>
          <el-tag v-else type="primary">{{ scope.row.orderStatusName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="returnStatus" label="售后状态" width="120px">
        <template slot-scope="scope">
          <span v-if="scope.row.returnStatusName===''" type="primary">--</span>
          <el-tag v-else type="primary">{{ scope.row.returnStatusName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="categoryName" label="所属类目"/>
      <el-table-column align="center" prop="goodsId" label="商品编号" width="150px"/>
      <el-table-column align="center" prop="sellerUserId" label="商家编号" width="150px"/>
      <el-table-column align="center" prop="buyerUserId" label="买家编号" width="150px"/>
      <el-table-column align="center" prop="totalAmount" label="订单金额（元）"/>
      <el-table-column align="center" prop="payAmount" label="实付金额（元）"/>
      <el-table-column align="center" prop="settlementAmount" label="结算单价（元）"/>
      <el-table-column align="center" prop="number" label="数量"/>
      <el-table-column align="center" prop="settlementTotalAmount" label="结算金额（元）"/>
      <el-table-column align="center" prop="returnAmount" label="退款金额（元）"/>
      <!-- <el-table-column align="center" prop="saleCommissionFee" label="营销费率"/> -->
      <el-table-column align="center" prop="saleCommissionRate" label="营销费（元）"/>
      <!-- <el-table-column align="center" prop="platformRate" label="总部分佣比例" width="100px"/> -->
      <el-table-column align="center" prop="platformRateCommission" label="总部分佣金额（元）" width="100px"/>
      <el-table-column align="center" prop="platformRateUserId" label="总部分佣去向编号" width="130px"/>
      <!-- <el-table-column align="center" prop="townPartnerRate" label="乡镇分佣比例" width="100px"/> -->
      <el-table-column align="center" prop="townPartnerCommission" label="乡镇分佣金额（元）" width="100px"/>
      <el-table-column align="center" prop="townPartnerUserId" label="乡镇分佣去向编号" width="130px"/>
      <!-- <el-table-column align="center" prop="joinPartnerRate" label="合伙人分佣比例" width="110px"/> -->
      <el-table-column align="center" prop="joinPartnerCommission" label="合伙人分佣金额（元）" width="110px"/>
      <el-table-column align="center" prop="joinPartnerUserId" label="合伙人分佣去向编号" width="130px"/>
      <el-table-column align="center" prop="gmtCreated" label="下单时间" width="150px"/>
      <el-table-column align="center" prop="payTime" label="支付时间" width="150px"/>
      <el-table-column align="center" prop="doneTime" label="完成时间" width="150px"/>
      <el-table-column align="center" prop="payType" label="支付方式">
        <template slot-scope="scope">
          <span type="primary">{{ scope.row.payTypeName?scope.row.payTypeName:'--' }}</span>
        </template>
      </el-table-column>
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
import { queryStatement, queryOrderType, queryAfterSaleType, queryPayType, queryCategoryType } from '@/api/finance/statement'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        orderNo: '', // 订单编号
        tradeNo: '', // 交易号
        goodsId: '', // 商品ID
        orderStatus: '', // 订单状态
        returnStatus: '', // 退款状态
        payType: '', // 支付方式
        sellerUserId: '', // 商家ID
        buyerUserId: '', // 买家ID
        payTime: '', // 支付时间
        doneTime: '', // 交易完成时间
        categoryId: '',
        page: 1,
        limit: 10
      },
      total: 100,
      queryOrderTypes: [],
      queryAfterSaleTypes: [],
      queryPayTypes: [],
      queryCategoryTypes: [],
      list: []
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    /**
     * 商品类目列表
     */
    getCategoryList() {
      queryCategoryType().then(res => {
        this.queryCategoryTypes = res.data.data
      })
    },
    // 获取订单状态
    getOrderTypeList() {
      queryOrderType().then(res => {
        this.queryOrderTypes = res.data.data
      })
    },
    // 获取售后状态
    getAfterSaleTypeList() {
      queryAfterSaleType().then(res => {
        this.queryAfterSaleTypes = res.data.data
      })
    },
    // 获取支付方式
    getPayTypeList() {
      queryPayType().then(res => {
        this.queryPayTypes = res.data.data
      })
    },
    // 获取订单列表
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = this.queryPara()
      this.listLoading = true
      queryStatement(para).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
    },
    queryPara() {
      const para = {
        orderNo: this.searchForm.orderNo,
        tradeNo: this.searchForm.tradeNo,
        goodsId: this.searchForm.goodsId,
        categoryId: this.searchForm.categoryId,
        orderStatus: this.searchForm.orderStatus,
        returnStatus: this.searchForm.returnStatus,
        payType: this.searchForm.payType,
        buyerUserId: this.searchForm.buyerUserId,
        sellerUserId: this.searchForm.sellerUserId,
        startCreated: this.searchForm.payTime[0]
          ? this.$moment(new Date(this.searchForm.payTime[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endCreated: this.searchForm.payTime[1]
          ? this.$moment(new Date(this.searchForm.payTime[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        startDoneTime: this.searchForm.doneTime[0]
          ? this.$moment(new Date(this.searchForm.doneTime[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endDoneTime: this.searchForm.doneTime[1]
          ? this.$moment(new Date(this.searchForm.doneTime[1])).format(
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
      const url = process.env.BASE_API + '/orderSnapshot/exportExcel.do?orderNo=' + para.orderNo + '&tradeNo=' + para.tradeNo + '&goodsId=' + para.goodsId + '&' +
                                                'orderStatus=' + para.orderStatus + '&' +
                                                'returnStatus=' + para.returnStatus + '&payType=' + para.payType + '&buyerUserId=' + para.buyerUserId + '&' +
                                                'sellerUserId=' + para.sellerUserId + '&startCreated=' + para.startCreated + '&endCreated=' + para.endCreated + '&' +
                                                'startDoneTime=' + para.startDoneTime + '&endDoneTime=' + para.endDoneTime
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
      this.getOrderTypeList()
      this.getAfterSaleTypeList()
      this.getPayTypeList()
      this.getCategoryList()
    }
  }
}
</script>
<style>
</style>

