<!-- 用户页面 -->
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="70px">

        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="searchForm.userId" placeholder="请输入用户编号"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-select v-model="searchForm.sex" placeholder="请选择">
            <el-option
              v-for="item in sexList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="searchForm.phone" :maxlength="11" placeholder="请输入"/>
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
      style="width:100%"
    >
      <el-table-column align="center" label="用户编号" prop="userId"/>
      <el-table-column align="center" label="微信名称" prop="name"/>
      <el-table-column align="center" label="用户性别" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 'M'">男</span>
          <span v-if="scope.row.sex === 'W'">女</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" prop="phone"/>
      <el-table-column align="center" label="创建时间" prop="gmtCreated"/>
      <el-table-column align="center" label="最近登录时间" prop="gmtModified" />
      <el-table-column
        align="center"
        label="操作"
        width="200"
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

    <!-- 用户详情对话框 -->
    <el-dialog :visible.sync="appUserDialogVisible" title="用户详情" width="800">
      <el-form :data="appUserInfo" label-position="left" label-width="100px">
        <el-form-item label="用户编号">
          <span>{{ appUserInfo.userId }}</span>
        </el-form-item>
        <el-form-item label="用户昵称">
          <span>{{ appUserInfo.name }}</span>
        </el-form-item>
        <el-form-item label="用户性别">
          <span>{{ appUserInfo.name }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ appUserInfo.phone }}</span>
        </el-form-item>
        <el-form-item label="openId">
          <span>{{ appUserInfo.openIdMini }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ appUserInfo.gmtCreated }}</span>
        </el-form-item>
        <el-form-item label="最近登录时间">
          <span>{{ appUserInfo.gmtModified }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryAppUser, queryByAppRoleQuery } from '@/api/user/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 查询表单
      searchForm: {
        userId: '',
        realName: '',
        userName: '', // 用户昵称
        phone: '', // 手机号
        roleCode: '', // 用户角色
        page: 1, // 从1开始查询
        limit: 10 // 初始查询10条
      },
      sexList:[{
        code: 'W',
        name: "女"
      },{
        code: 'M',
        name: "男"
      }],
      roleList: [],
      list: [], // 表格列表数据
      total: 0,
      listLoading: false,
      appUserDialogVisible: false,
      appUserInfo: '',
    }
  },
  created() {
    this.initData()
  },
  mounted() {},

  methods: {
    /**
     * 获取用户数据
     */
    getList(val) {
      if (val) {
        this.searchForm.limit = val.limit
      }
      const para = {
        userId: this.searchForm.userId,
        name: this.searchForm.name,
        phone: this.searchForm.phone,
        sex: this.searchForm.sex,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      console.log(para)
      this.listLoading = true
      queryAppUser(para).then(res => {
        this.list = res.data.data
        this.total = Number(res.data.count)
        this.listLoading = false
        console.log(res.data.data)
      })
    },
    /**
     * 获取用户角色列表
     */
    // getAppRole() {
    //   queryByAppRoleQuery().then(res => {
    //     this.roleList = res.data.data
    //   })
    // },
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
      console.log(row)
      this.appUserDialogVisible = true
      this.appUserInfo = row
    },
    /**
     * 初始化数据
     */
    initData() {
      // this.getAddressquery()
      this.getList()
      // this.getAppRole()
    }
  }
}
</script>

<style>
</style>
