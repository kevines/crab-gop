<!-- 充值管理页面 -->
/*
 * @Author: wangyang
 * @Date: 2019-03-23 17:05:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-05-31 10:39:45
 */

<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="用户编号" prop="userId" label-width="120">
          <el-input v-model="searchForm.userId" placeholder="用户编号"/>
        </el-form-item>
        <el-form-item label="充值用户手机号" prop="phone" label-width="120px">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="充值用户" prop="buyUserName">
          <el-input v-model="searchForm.buyUserName" placeholder="请输入充值用户姓名"/>
        </el-form-item>
        <el-form-item label="充值渠道" prop="chargeChannel">
          <el-select v-model="searchForm.chargeChannel" placeholder="请选择">
            <el-option label="后台充值" value="1"/>
            <el-option label="微信" value="2"/>
            <el-option label="支付宝" value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="待审核" value="1"/>
            <el-option label="充值成功" value="2"/>
            <el-option label="充值失败" value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" class="filter-item" prop="createTime">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审核时间" class="filter-item" prop="gmtCheckTime">
          <el-date-picker
            v-model="searchForm.gmtCheckTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleRest('searchForm')"
        >重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
      </el-form>
    </div>

    <!-- 查询结果 -->
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
      <el-table-column align="center" label="充值编号" prop="chargeNo" width="160"/>

      <el-table-column align="center" label="用户编号" prop="userId" width="140"/>

      <el-table-column align="center" label="创建时间" prop="chargeTime" width="140"/>

      <el-table-column align="center" label="充值用户手机号" prop="phone" width="120"/>

      <el-table-column align="center" label="充值用户" prop="userName" width="80"/>

      <el-table-column align="center" label="充值金额(元)" prop="amount" width="100"/>

      <el-table-column align="center" label="当前余额(元)" prop="amount" width="100"/>

      <el-table-column align="center" label="充值渠道" prop="chargeChannelStr" width="80"/>

      <el-table-column align="center" label="支付宝/微信账号" prop="sourceBuyer" width="120"/>

      <el-table-column align="center" label="状态" prop="statusStr" width="80"/>

      <el-table-column align="center" label="审核人" prop="checkUserName"  :formatter="formatCheckUserName" width="80" />

      <el-table-column align="center" label="审核时间" prop="gmtCheckTime" width="140"/>

      <el-table-column
        align="center"
        label="操作"
        width="150"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.status===1"
            type="primary"
            size="mini"
            @click="handleCheck(scope.row)"
          >审核</el-button>
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

    <!-- 用户详情对话框 -->
    <el-dialog :visible.sync="rechargeDialogVisible" :title="textMap[dialogStatus]" width="60%">
      <el-form :data="rechargeInfo" label-position="right" label-width="120px">
        <el-card class="box-card">
          <h3>基本信息</h3>
          <el-form-item label="充值编号">
            <span>{{ rechargeInfo.chargeNo }}</span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ rechargeInfo.chargeTime }}</span>
          </el-form-item>
          <el-form-item label="充值用户手机号">
            <span>{{ rechargeInfo.phone }}</span>
          </el-form-item>
          <el-form-item label="充值用户">
            <span>{{ rechargeInfo.userName }}</span>
          </el-form-item>
          <el-form-item label="充值金额(元)">
            <span>{{ rechargeInfo.amount }}</span>
          </el-form-item>
          <el-form-item label="充值渠道">
            <span>{{ rechargeInfo.chargeChannelStr }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ rechargeInfo.statusStr }}</span>
          </el-form-item>
        </el-card>
        <el-card class="box-card">
          <h3>充值信息</h3>
          <el-form-item label="充值操作人">
            <span>{{ rechargeInfo.creatorName }}</span>
          </el-form-item>
          <el-form-item label="充值备注">
            <span>{{ rechargeInfo.remark }}</span>
          </el-form-item>

          <el-form-item label="线下打款凭证" style="width:1000px;">
            <el-upload
              :file-list="rechargeInfo.imgFileList"
              :on-preview="handlePictureCardPreview"
              :disabled="true"
              class="upload-add"
              action=""
              list-type="picture-card"
            />
            <i class="el-icon-puls"/>
          </el-form-item>

        </el-card>

        <el-card v-if="dialogStatus == 'view'" class="box-card">
          <h3>审核信息</h3>
          <el-form-item label="审核人">
            <span>{{ rechargeInfo.checkUserName }}</span>
          </el-form-item>
          <el-form-item label="审核时间">
            <span>{{ rechargeInfo.gmtCheckTime }}</span>
          </el-form-item>
          <el-form-item label="审核结果">
            <span>{{ rechargeInfo.checkResult }}</span>
          </el-form-item>
          <el-form-item label="审核备注">
            <span>{{ rechargeInfo.checkRemark }}</span>
          </el-form-item>
        </el-card>
        <el-card v-else class="box-card">
          <h3>审核信息</h3>
          <el-form ref="reviewForm" :rules="rules" :model="reviewForm" label-width="80px">
            <el-form-item label="审核结果" prop="rechargeInfo.pass">
              <el-radio-group v-model="rechargeInfo.pass">
                <el-radio label="1">通过</el-radio>
                <el-radio label="0">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注">
              <el-input
                :rows="2"
                v-model="rechargeInfo.checkRemark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button>取 消</el-button>
              <el-button type="primary" @click="onSubmit">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-form>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog
      :visible.sync="dialogImageVisible"
      width="50%"
      class="large">
      <img :src="previewImageUrl" width="100%" height="100% ">
    </el-dialog>
  </div>
</template>

<script>
import {
  queryAccountOrderListRequest,
  detailRequest,
  checkRequest
} from '@/api/finance/accountCharge'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 查询表单
      searchForm: {
        userId: '',
        phone: '', // 县域code
        buyUserName: '', // 用户昵称
        chargeChannel: '', //
        status: '',
        createTime: [],
        page: 1, // 从1开始查询
        limit: 10 // 初始查询10条
      },
      roleList: [],
      list: [], // 表格列表数据
      total: 0,
      listLoading: false,
      rechargeDialogVisible: false,
      previewImageUrl: '',
      dialogStatus: '',
      textMap: {
        check: '审核',
        view: '充值详情'
      },
      reviewForm: {
        reviewStatus: '',
        reviewRemark: ''
      },
      rules: {
        reviewStatus: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      },
      rechargeInfo: {},
      dialogImageVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {

    formatCheckUserName(row, column){
        return row.checkUserName == '' && row.gmtCheckTime != '' ? '系统审核':row.checkUserName
    },
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url
      this.dialogImageVisible = true
    },
    /**
     * 获取用户数据
     */
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = this.queryPara()
      this.listLoading = true
      queryAccountOrderListRequest(para).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
    },
    queryPara() {
      const para = {
        userId: this.searchForm.userId,
        phone: this.searchForm.phone === '' ? '' : this.searchForm.phone,
        buyUserName: this.searchForm.buyUserName,
        chargeChannel: this.searchForm.chargeChannel,
        status: this.searchForm.status,
        dateTimeBegin: this.searchForm.createTime != null && this.searchForm.createTime[0]
          ? this.$moment(new Date(this.searchForm.createTime[0])).format(
            'YYYY-MM-DD 00:00:00'
          )
          : '',
        dateTimeEnd: this.searchForm.createTime != null && this.searchForm.createTime[1]
          ? this.$moment(new Date(this.searchForm.createTime[1])).format(
            'YYYY-MM-DD 23:59:59'
          )
          : '',
        gmtCheckTimeBegin: this.searchForm.gmtCheckTime != null && this.searchForm.gmtCheckTime[0]
          ? this.$moment(new Date(this.searchForm.gmtCheckTime[0])).format(
            'YYYY-MM-DD 00:00:00'
          )
          : '',
        gmtCheckTimeEnd: this.searchForm.gmtCheckTime != null && this.searchForm.gmtCheckTime[1]
          ? this.$moment(new Date(this.searchForm.gmtCheckTime[1])).format(
            'YYYY-MM-DD 23:59:59'
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
      const url = process.env.BASE_API + '/accountChargeOrder/exportExcel.do?phone=' + para.phone + '&buyUserName=' + para.buyUserName + '&chargeChannel=' + para.chargeChannel + '&userId=' + para.userId + '&' + 'status=' + para.status + '&dateTimeBegin=' + para.dateTimeBegin + '&dateTimeEnd=' + para.dateTimeEnd
      + '&gmtCheckTimeBegin=' + para.gmtCheckTimeBegin + '&gmtCheckTimeEnd=' + para.gmtCheckTimeEnd
      window.location.href = url
      console.log(url)
    },
    /**
     * 条件查询
     */
    handleQuery() {
      this.searchForm.page = 1
      this.getList()
    },

    /**
     * 重置查询条件
     */
    handleRest(form) {
      this.$refs[form].resetFields()
      this.getList()
    },
    /**
     * 查看详情
     */
    handleDetail(row) {
      const para = {
        id: row.id
      }
      detailRequest(para).then(res => {
        if (res.data.code === 200) {
          const imgFileList = []
          for (var index in res.data.data.credenceImages) {
            imgFileList.push({
              name: 'abc',
              url: res.data.data.credenceImages[index]
            })
          }
          this.dialogStatus = 'view'
          this.rechargeDialogVisible = true
          this.rechargeInfo = res.data.data
          this.rechargeInfo.imgFileList = imgFileList
        }
      })
    },
    /**
     * 审核弹框
     */
    handleCheck(row) {
      const para = {
        id: row.id
      }
      detailRequest(para).then(res => {
        if (res.data.code === 200) {
          const imgFileList = []
          for (var index in res.data.data.credenceImages) {
            imgFileList.push({
              name: 'abc',
              url: res.data.data.credenceImages[index]
            })
          }

          this.dialogStatus = res.data.data.status === 1 ? 'check' : 'view'
          this.rechargeDialogVisible = true
          this.rechargeInfo = res.data.data
          this.rechargeInfo.imgFileList = imgFileList
        }
      })
    },
    /**
     * 确认审核
     */
    onSubmit() {
      this.$refs['reviewForm'].validate(() => {
        if (!this.rechargeInfo.pass) {
          return alert('审核结果不能为空')
        }
        const para = {
          id: this.rechargeInfo.id,
          pass: this.rechargeInfo.pass === '1',
          checkRemark: this.rechargeInfo.checkRemark
        }

        checkRequest(para).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '操作成功!',
              type: 'success'
            })
            this.rechargeDialogVisible = false
            this.getList()
          } else {
            alert('操作失败')
          }
        })
      })
    }
  }
}
</script>

<style>
.el-date-editor .el-range-separator {
  display: inline-block;
  height: 100%;
  padding: 0;
  margin: 0;
  text-align: center;
  font-size: 14px;
  width: 5%;
  color: #303133;
}
.el-card {
  margin-bottom: 10px;
}

 .upload-add .el-upload--picture-card {
    display: none;
}
</style>
