<!-- 日志页面 -->
/*
 * @Author: wangyang
 * @Date: 2019-03-23 17:05:19
 * @Last Modified by: wangyang
 * @Last Modified time: 2019-04-12 09:43:52
 */

<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="创建时间" class="filter-item" prop="createTime">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item label="日志名称" prop="logName" label-width="120px">
          <el-input v-model="searchForm.logName" placeholder="请输入日志名称" style="width:130px;"/>
        </el-form-item>
        <el-form-item label="日志类型" prop="logType">
          <el-select v-model="searchForm.logType" placeholder="请选择">
            <el-option label="全部" value="0"/>
            <el-option label="业务日志" value="1"/>
            <el-option label="异常日志" value="2"/>
          </el-select>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleRest('searchForm')"
        >重置</el-button>
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
    >
      <el-table-column align="center" label="端口" prop="port"/>

      <el-table-column align="center" label="日志类型" prop="logType"/>

      <el-table-column align="center" label="日志名称" prop="logName"/>

      <el-table-column align="center" label="用户名称" prop="userName"/>

      <el-table-column align="center" label="类名" prop="className"/>

      <el-table-column align="center" label="方法名" prop="method"/>

      <el-table-column align="center" label="时间" prop="createTime"/>

      <el-table-column
        align="center"
        label="操作"
        width="150"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
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

    <!-- 日志详细 -->
    <el-dialog :visible.sync="dialogFormVisible" title="详情" width="60%">
      <el-form label-position="right" label-width="120px">
        <el-card class="box-card">
          <el-form ref="reviewForm" :rules="rules" label-width="80px">
            <div class="text item">{{ detailMessage }}</div>
          </el-form>
        </el-card>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryBizLogListRequest } from '@/api/sys/bizLog'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 查询表单
      searchForm: {
        logName: '',
        logType: '0',
        status: '',
        createTime: '',
        page: 1,
        limit: 10
      },

      list: [],
      total: 0,
      listLoading: false,
      textMap: {
        view: '详情'
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
      detailMessage: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取用户数据
     */
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = {
        logName:
          this.searchForm.logName === '' ? null : this.searchForm.logName,
        logType: this.searchForm.logType,
        status: this.searchForm.status,
        beginTime: this.searchForm.createTime[0]
          ? this.$moment(new Date(this.searchForm.createTime[0])).format(
            'YYYY-MM-DD 00:00:00'
          )
          : '',
        endTime: this.searchForm.createTime[1]
          ? this.$moment(new Date(this.searchForm.createTime[1])).format(
            'YYYY-MM-DD 23:59:59'
          )
          : '',
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      this.listLoading = true
      queryBizLogListRequest(para).then(res => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
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
      this.detailMessage = row.message
      this.dialogFormVisible = true
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

/* .el-upload--picture-card {
    display: none;
} */
</style>
