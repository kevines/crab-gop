<!--日志列表-->
<template>
  <div class="app-container">
    <!--查询操作-->
    <div class="filter-container">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="searchForm.userId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="searchForm.tableName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="操作日志详细信息" prop="detail">
          <el-input v-model="searchForm.detail" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="日志访问IP" prop="ip">
          <el-input v-model="searchForm.ip" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="业务主键" prop="bizId">
          <el-input v-model="searchForm.bizId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="操作" prop="action">
          <el-select v-model="searchForm.action" placeholder="请选择">
            <el-option label="增加" value="1"/>
            <el-option label="删除" value="2"/>
            <el-option label="查看" value="3"/>
            <el-option label="修改" value="4"/>
            <el-option label="异常" value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" class="filter-item" prop="time">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleRest('searchForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--日志列表-->
    <el-table
      v-loading="listLoading"
      id="out-table"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      >
      <el-table-column align="center" prop="id" label="日志编号"/>
      <el-table-column align="center" prop="userId" label="用户编号"/>
      <el-table-column align="center" prop="bizId" label="业务主键" width="160px"/>
      <el-table-column align="center" prop="tableName" label="表名"/>
      <el-table-column align="center" prop="ip" label="日志访问TP"/>
      <el-table-column align="center" prop="time" label="创建时间"/>
      <el-table-column align="center" prop="detail" label="操作日志详细信息" width="300px"/>
      <el-table-column align="center" prop="action" label="操作" width="70px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.action===1" type="success">增加</el-tag>
          <el-tag v-if="scope.row.action===2" type="danger">删除</el-tag>
          <el-tag v-if="scope.row.action===3" type="primary">查看</el-tag>
          <el-tag v-if="scope.row.action===4" type="warning">修改</el-tag>
          <el-tag v-if="scope.row.action===5" type="danger">异常</el-tag>
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
import { queryLog } from '@/api/sys/log'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10,
        time: '', // 创建时间
        userId: '', // 用户编号
        action: '', // 操作
        tableName: '', // 表名
        detail: '', // 操作日志详细信息
        ip: '', // 日志访问IP
        bizId: '' // 业务主键
      },
      total: 0,
      listLoading: false,
      list: []
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    // 查询列表
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = {
        userId: this.searchForm.userId,
        action: this.searchForm.action,
        tableName: this.searchForm.tableName,
        detail: this.searchForm.detail,
        ip: this.searchForm.ip,
        bizId: this.searchForm.bizId,
        startTime: this.searchForm.time[0]
          ? this.$moment(new Date(this.searchForm.time[0])).format('YYYY-MM-DD')
          : '',
        endTime: this.searchForm.time[0]
          ? this.$moment(new Date(this.searchForm.time[0])).format('YYYY-MM-DD')
          : '',
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      this.listLoading = true
      queryLog(para).then(res => {
        this.total = res.data.count
        this.list = res.data.data
        this.listLoading = false
      })
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

