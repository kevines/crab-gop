<!--支出管理页面-->
<template>
  <div class="app-container">
    <!--查询及其它操作-->
    <div class="filter-container">
      <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="110px">
        <el-form-item label="支出用户编号" prop="userId">
          <el-input v-model="searchForm.userId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="支出用户姓名" prop="realName">
          <el-input v-model="searchForm.realName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="支出编号" prop="bizId">
          <el-input v-model="searchForm.bizId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="支出类型" prop="applyType">
          <el-select v-model="searchForm.applyType" placeholder="请选择">
            <el-option label="提现" value="1">提现</el-option>
            <el-option label="支出" value="2">支出</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现渠道" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择">
            <el-option label="支付宝" value="1">支付宝</el-option>
            <el-option label="微信" value="2">微信</el-option>
            <el-option label="银行卡" value="3">银行卡</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStates">
          <el-select v-model="searchForm.applyStates" placeholder="请选择">
            <el-option label="申请中" value="1">申请中</el-option>
            <el-option label="拒绝" value="2">拒绝</el-option>
            <el-option label="同意" value="3">同意</el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提现状态" prop="withdrawStates">
          <el-select v-model="searchForm.withdrawStates" placeholder="请选择">
            <el-option label="处理中" value="1">处理中</el-option>
            <el-option label="失败" value="2">失败</el-option>
            <el-option label="成功" value="3">成功</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校验状态" prop="checkStatus">
          <el-select v-model="searchForm.checkStatus" placeholder="请选择">
            <el-option label="校验失败" value="0">校验失败</el-option>
            <el-option label="校验成功" value="1">校验成功</el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支出时间" label-width="100px" prop="gmtCreated">
          <el-date-picker
            v-model="searchForm.gmtCreated"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item label="确认时间" label-width="100px" prop="withdrawTime">
          <el-date-picker
            v-model="searchForm.withdrawTime"
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
          <el-button class="filter-item" type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--查询列表-->
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
      <el-table-column align="center" prop="gmtCreated" label="支出时间" width="150px"/>
      <el-table-column align="center" prop="withdrawTime" label="确认时间" width="150px"/>
      <el-table-column align="center" prop="userId" label="支出用户编号" width="150px"/>
      <el-table-column align="center" prop="bizId" label="支出编号" width="150px"/>
      <el-table-column align="center" prop="phone" label="用户手机号" width="100px"/>
      <el-table-column align="center" prop="realName" label="支出用户姓名" width="100px"/>
      <el-table-column align="center" prop="amount" label="支出金额（元）"/>
      <el-table-column align="center" prop="applyType" label="支出类型">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="提现渠道">
        <template slot-scope="scope">
          <span v-if="scope.row.type==''">--</span>
          <span v-if="scope.row.type==1">支付宝</span>
          <span v-if="scope.row.type==2">微信</span>
          <span v-if="scope.row.type==3">银行卡</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bankNo" label="微信/支付宝/银行卡号" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bankNo?scope.row.bankNo:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bankName" label="开户行" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.bankName?scope.row.bankName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bankBranchName" label="支行" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.bankBranchName?scope.row.bankBranchName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="countyName" label="开户行所在省市" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.countyName?scope.row.countyName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="applyStates" label="申请状态" width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.applyStates==''">--</span>
          <span v-if="scope.row.applyStates==1" class="msgPrimary">申请中</span>
          <div>
            <div class="pos-sty">
              <span v-if="scope.row.applyStates==2" class="msgDanger">拒绝</span>
            </div>
            <div v-if="scope.row.applyStates == 2 " class="errorMsg">{{ scope.row.refuseReason }}</div>
          </div>

          <span v-if="scope.row.applyStates==3" class="msgSuccess">同意</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="withdrawStates" label="提现状态" width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.withdrawStates==1" class="msgPrimary">申请中</span>
          <div>
            <div class="pos-sty">
              <span v-if="scope.row.withdrawStates==2" class="msgDanger">失败</span>
            </div>
            <div v-if="scope.row.withdrawStates == 2 " class="errorMsg">{{ scope.row.errorMsg }}</div>
          </div>
          <span v-if="scope.row.withdrawStates==3" class="msgSuccess">成功</span>
          <span v-if="scope.row.type==''">--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="checkStatus" label="校验状态" width="160px">
        <template slot-scope="scope">
          <div>
            <div class="pos-sty">
              <span v-if="scope.row.checkStatus==false" class="msgDanger">校验失败</span>
            </div>
            <div v-if="scope.row.checkStatus ==false " class="errorMsg">{{ scope.row.checkMsg }}</div>
          </div>

          <span v-if="scope.row.checkStatus==true" class="msgSuccess">校验成功</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="160"
        class-name="small-padding"
        fixed="right"
      >
        <template slot-scope="scope">

          <el-button v-if="scope.row.applyType == 1 && scope.row.applyStates == 1" type="primary" size="mini" @click="handleAgree(scope.row)">确认</el-button>
          <el-button v-if="scope.row.applyType == 1 && scope.row.applyStates == 1" type="danger" size="mini" @click="handleRefuse(scope.row)">驳回</el-button>
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
    <!--驳回弹框-->
    <el-dialog :visible.sync="returnVisible" title="拒绝" width="30%" >
      <el-form ref="returnForm" :model="returnForm">
        <el-form-item label="拒绝理由" prop="refuseReason">
          <el-input v-model="returnForm.refuseReason" maxlength="12" placeholder="请输入，不超过12个字"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="returnVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateRefuse">确 定</el-button>
      </span>
    </el-dialog>
    <!--同意弹框-->
    <el-dialog :visible.sync="agreeVisible" title="提示" width="30%" >
      <el-form ref="agreeForm" :model="agreeForm">
        <span>确认同意吗？</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="agreeVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateAgree">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryDisbure, refuse, agree } from '@/api/finance/disbure'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        userId: '', // 用户id
        realName: '', // 用户姓名
        phone: '', // 手机号
        applyType: '', // 支出类型
        type: '', // 提现类型
        applyStates: '', // 申请状态
        withdrawStates: '', // 提现状态
        withdrawTime: '', // 确认时间
        gmtCreated: '', // 支出时间
        checkStatus: '', // 校验状态
        limit: 10,
        page: 1
      },
      total: 10,
      list: [],
      returnForm: {
        id: '',
        refuseReason: ''// 拒绝原因
      },
      agreeForm: {},
      listLoading: false,
      dialogVisible: false,
      returnVisible: false,
      agreeVisible: false
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    // 获取列表信息
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = this.queryPara()
      this.listLoading = true
      queryDisbure(para).then(res => {
        this.list = res.data.data
        this.total = parseInt(res.data.count)
        this.listLoading = false
      })
    },
    queryPara() {
      const para = {
        userId: this.searchForm.userId,
        phone: this.searchForm.phone,
        realName: this.searchForm.realName,
        startCreated: this.searchForm.gmtCreated[0] ? this.$moment(new Date(this.searchForm.gmtCreated[0])).format(
          'YYYY-MM-DD'
        )
          : '',
        endCreated: this.searchForm.gmtCreated[1]
          ? this.$moment(new Date(this.searchForm.gmtCreated[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        bizId: this.searchForm.bizId,
        applyType: this.searchForm.applyType,
        type: this.searchForm.type,
        applyStates: this.searchForm.applyStates,
        withdrawStates: this.searchForm.withdrawStates,
        startWithdraw: this.searchForm.withdrawTime[0]
          ? this.$moment(new Date(this.searchForm.withdrawTime[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endWithdraw: this.searchForm.withdrawTime[1]
          ? this.$moment(new Date(this.searchForm.withdrawTime[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        checkStatus: this.searchForm.checkStatus,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      return para
    },
    // 支出导出
    exportExcel() {
      const para = this.queryPara()

      const url =
        process.env.BASE_API + '/withdrawApply/exportExcel.do?userId=' + para.userId + '&phone=' + para.phone + '&realName=' + para.realName + '&startWithdraw=' + para.startWithdraw +
        '&' + 'endWithdraw=' + para.endWithdraw + '&applyType=' + para.applyType + '&type=' + para.type + '&withdrawStates=' + para.withdrawStates + '&applyStates=' + para.applyStates +
        '&' + 'startCreated' + para.startCreated + '&endCreated=' + para.endCreated
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
    /**
     * 初始化数据
     */
    initData() {
      this.getList()
      this.getChangeType()
    },

    // 驳回
    handleRefuse(row) {
      this.returnForm = Object.assign({}, row)
      this.returnVisible = true
      this.$nextTick(() => {
        this.$refs['returnForm'].clearValidate()
      })
    },
    // 实现驳回
    updateRefuse() {
      this.$refs['returnForm'].validate(valid => {
        if (valid) {
          const para = {
            bizId: this.returnForm.bizId,
            refuseReason: this.returnForm.refuseReason
          }
          refuse(para).then(res => {
            this.returnVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    // 同意提现
    handleAgree(row) {
      this.agreeForm = Object.assign({}, row)
      this.agreeVisible = true
    },
    // 实现
    updateAgree() {
      this.$refs['agreeForm'].validate(valid => {
        if (valid) {
          const para = {
            bizId: this.agreeForm.bizId
          }
          agree(para).then(res => {
            this.agreeVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style>
.pos {
  margin-left: 30px;
}
.msgSuccess {
  color: #67C23A;
}
.msgDanger{
  color: #F56C6C;
}
.msgPrimary{
  color: #409EFF;
}
.errorMsg{
  color:#ccc;
}
</style>

