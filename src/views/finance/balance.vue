<!--余额查询页面-->
<template>
  <div class="app-container">
    <!--查询和其他操作-->
    <div class="filter-container">
      <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="100px">
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="searchForm.userId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入"/>
        </el-form-item>

        <el-form-item label="当前余额范围" label-width="120px" prop="smallAmount">
          <el-input v-model="searchForm.smallAmount" placeholder="请输入" class="input-sty"/>
        </el-form-item>
        <el-form-item prop="bigAmount">
          -&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input v-model="searchForm.bigAmount" placeholder="请输入" class="input-sty"/>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName">
          <el-input v-model="searchForm.realName" placeholder="请输入"/>
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
            icon="el-icon-download"
            @click="exportExcel"
          >导出</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleRest('searchForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--查询结果-->
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
      <el-table-column align="center" prop="userId" label="用户ID"/>
      <el-table-column align="center" prop="phone" label="用户手机号"/>
      <el-table-column align="center" prop="realName" label="用户姓名"/>
      <el-table-column align="center" prop="amount" label="当前余额（元）"/>
      <el-table-column
        align="center"
        label="操作"
        width="250"
        class-name="small-padding"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.userId)">查看</el-button>
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
    <!-- 查看余额详情 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1100px">
      <div class="filter-container">
        <el-form ref="dataForm" :model="dataForm" :inline="true" label-width="60px">
          <el-form-item label="类型" prop="changeType">
            <el-select v-model="dataForm.changeType" clearable placeholder="请选择">
              <el-option
                v-for="item in queryChangeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="时间" label-width="60px" prop="gmtCreated">
            <el-date-picker
              v-model="dataForm.gmtCreated"
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
              @click="getDetailList"
            >查询</el-button>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-edit"
              @click="handleRest('dataForm')"
            >重置</el-button>
          </el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="exportExcelDetail"
          >导出</el-button>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="detailList"
        size="small"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" prop="flowNo" label="编号">
          <!--  <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleWatch(scope.row)">{{ scope.row.flowNo }}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column align="center" prop="gmtCreated" label="时间"/>
        <el-table-column align="center" prop="changeType" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.changeTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="tradeAmount" label="余额变动（元）"/>
        <el-table-column align="center" prop="balanceAmount" label="余额（元）"/>
        <el-table-column align="center" prop="mark" label="备注"/>
      </el-table>
      <pagination
        v-show="detailTotal>0"
        :total="detailTotal"
        :page.sync="dataForm.page"
        :limit.sync="dataForm.limit"
        @pagination="getDetailList"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  queryBalance,
  queryBalanceDetail,
  queryChangeType
} from '@/api/finance/balance'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        userId: '', // 用户id
        phone: '', // 用户手机号
        realName: '', // 用户姓名
        smallAmount: '', // 最小余额
        bigAmount: '', // 最大余额
        page: 1,
        limit: 10
      },
      list: [],
      total: 100,
      detailTotal: 100,
      listLoading: false,
      dialogFormVisible: false, // 第一层对话框
      dialogStatus: '',
      textMap: {
        look: '余额详情'
      },
      dataForm: {
        flowNo: '', // 交易编号
        gmtCreated: '', // 创建时间
        mark: '', // 备注
        balanceAmount: '', // 余额
        tradeAmount: '', // 余额变动
        changeType: '', // 交易类型
        page: 1,
        limit: 10
      },
      detailList: [],
      userId: '',
      queryChangeTypeList: {}
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = this.queryPara()
      this.listLoading = true
      queryBalance(para).then(res => {
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
        smallAmount: this.searchForm.smallAmount,
        bigAmount: this.searchForm.bigAmount,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      return para
    },
    // 余额查询导出
    exportExcel() {
      const para = this.queryPara()
      const url =
        process.env.BASE_API +
        '/appUser/exportExcel.do?userId=' +
        para.userId +
        '&phone=' +
        para.phone +
        '&realName=' +
        para.realName +
        '&' +
        'smallAmount=' +
        para.smallAmount +
        '&bigAmount=' +
        para.bigAmount
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
    /**
     * 获取类型
     */
    getChangeType() {
      queryChangeType().then(res => {
        this.queryChangeTypeList = res.data.data
      })
    },
    /**
     * 查看余额详情
     */
    handleDetail(userId) {
      this.dialogFormVisible = true
      this.userId = userId
      this.getChangeType()
      this.getDetailList()
    },
    /**
     * 余额详情查询
     */
    getDetailList() {
      const para = this.queryParaDetail()
      this.listLoading = true
      queryBalanceDetail(para).then(res => {
        this.detailList = res.data.data
        this.detailTotal = parseInt(res.data.count)
        this.listLoading = false
      })
    },
    queryParaDetail() {
      const paraDetail = {
        userId: this.userId,
        changeType: this.dataForm.changeType,
        startCreated: this.dataForm.gmtCreated[0]
          ? this.$moment(new Date(this.dataForm.gmtCreated[0])).format(
            'YYYY-MM-DD'
          )
          : '',
        endCreated: this.dataForm.gmtCreated[1]
          ? this.$moment(new Date(this.dataForm.gmtCreated[1])).format(
            'YYYY-MM-DD'
          )
          : '',
        page: this.dataForm.page,
        limit: this.dataForm.limit
      }
      return paraDetail
    },
    // 查看余额详情导出
    exportExcelDetail() {
      const paraDetail = this.queryParaDetail()
      const url =
        process.env.BASE_API +
        '/paymentFlow/detail/exportExcel.do?userId=' +
        paraDetail.userId +
        '&changeType=' +
        paraDetail.changeType +
        '&' +
        'startCreated=' +
        paraDetail.startCreated +
        '&endCreated=' +
        paraDetail.endCreated
      window.location.href = url
    }
    // 通过编号查找
    /* handleWatch(row) {
      var flowNoStr = row.flowNo
      if (flowNoStr.indexOf('GSP') > -1) {
        this.$router.push({
          path: '/finance/orderDetail',
          query: {
            flowNo: row.flowNo
          }
        })
      }
       else{
        this.$router.push({
          path: "/finance/taskDetail",
          query: {
            flowNo: row.flowNo
          }
        });
      }
    }*/
  }
}
</script>
<style>
.input-sty {
  width: 215px;
}
</style>

