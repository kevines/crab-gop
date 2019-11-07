<!--订单详情页面-->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>订单详情</h3>
      <el-form
        ref="dataForm"
        :data="dataForm"
        :inline="true"
        label-position="left"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单编号：" class="label-style" prop="orderNo">
              <span>{{ dataForm. orderNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易号：" class="label-style" prop="goodsId">
              <span>{{ dataForm. goodsId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="下单时间：" class="label-style" prop="gmtCreated">
              <span>{{ dataForm. gmtCreated }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付时间：" class="label-style" prop="payTime">
              <span>{{ dataForm. payTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table :data="detailList" style="width: 100%">
        <el-table-column prop="name" label="商品名称" width="300px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="12">
                <img :src="scope.row.picUrl">
              </el-col>
              <el-col :span="12">名称:{{ scope.row.name }}</el-col>
              <el-col :span="12">规格:{{ scope.row.specificationValue }}</el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="settlementAmount" label="单价" align="center"/>
        <el-table-column prop="number" label="数量" align="center"/>
        <el-table-column prop="payAmount" label="实付金额" align="center"/>
        <el-table-column prop="orderStatusName" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.orderStatusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="buyerUserId" label="买家" align="center"/>
        <el-table-column prop="sellerUserId" label="所属商家" align="center"/>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <h3>分佣明细</h3>
      <el-table :data="detailList" style="width: 100%">
        <el-table-column prop="saleCommissionFee" label="订单佣金" align="center"/>
        <el-table-column prop="platformRate" label="总部分佣比例" align="center"/>
        <el-table-column prop="joinPartnerRate" label="执行合伙人分佣比例" align="center"/>
        <el-table-column prop="townPartnerRate" label="乡镇分佣比例" align="center"/>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <h3>金额去向</h3>
      <el-table :data="detailList" style="width: 100%">
        <el-table-column prop="settlementTotalAmount" label="商家金额" align="center">
          <template slot-scope="scop">
            <div>{{ scop.row.settlementTotalAmount }}</div>
            <span>{{ scop.row.sellerUserId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformRateCommission" label="总部分佣" align="center">
          <template slot-scope="scop">
            <div>{{ scop.row.platformRateCommission }}</div>
            <span>{{ scop.row.platformRateUserId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="joinPartnerCommission" label="执行合伙人分佣" align="center">
          <template slot-scope="scop" align="center">
            <div>{{ scop.row.joinPartnerCommission }}</div>
            <span>{{ scop.row.joinPartnerUserId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="townPartnerCommission" label="乡镇分佣" align="center">
          <template slot-scope="scop">
            <div>{{ scop.row.townPartnerCommission }}</div>
            <span>{{ scop.row.townPartnerUserId }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <el-button type="primary" @click="back">返回</el-button>
    </el-card>
  </div>
</template>
<script>
import { queryOrderDetail } from '@/api/finance/balance'
export default {
  data() {
    return {
      dataForm: {
        tradeNo: 'GSP2019040316190023', // 交易编号
        orderNo: '', // 订单编号
        goodsId: '', // 交易号
        payTime: '', // 支付时间
        gmtCreated: '' // 下单时间
      },
      detailList: []
    }
  },
  computed: {
    orderId() {
      return this.$route.query.flowNo
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const para = {
        tradeNo: this.orderId
      }
      queryOrderDetail(para).then(res => {
        this.dataForm = res.data.data
        this.detailList = []
        var dataForm = res.data.data
        var detailList = {
          name: dataForm.name,
          specificationValue: dataForm.specificationValue,
          settlementAmount: dataForm.settlementAmount,
          number: dataForm.number,
          picUrl: dataForm.picUrl[0],
          payAmount: dataForm.payAmount,
          orderStatusName: dataForm.orderStatusName,
          buyerUserId: dataForm.buyerUserId,
          sellerUserId: dataForm.sellerUserId,
          saleCommissionFee: dataForm.saleCommissionFee,
          platformRate: dataForm.platformRate,
          joinPartnerRate: dataForm.joinPartnerRate,
          townPartnerRate: dataForm.townPartnerRate,
          settlementTotalAmount: dataForm.settlementTotalAmount,
          platformRateCommission: dataForm.platformRateCommission,
          joinPartnerCommission: dataForm.joinPartnerCommission,
          townPartnerCommission: dataForm.townPartnerCommission,
          platformRateUserId: dataForm.platformRateUserId,
          joinPartnerUserId: dataForm.joinPartnerUserId,
          townPartnerUserId: dataForm.townPartnerUserId
        }
        this.detailList.push(detailList)
      })
    },
    /**
     * 初始化数据
     */
    initData() {
      this.getList()
    },
    /**
     * 返回
     */
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
<style>
</style>
