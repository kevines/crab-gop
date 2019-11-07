<!-- 大牌任务页面 -->
/*
 * @Author: wangyang
 * @Date: 2019-04-01 16:36:33
 * @Last Modified by: wangyang
 * @Last Modified time: 2019-05-23 15:20:46
 */
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="100px">
        <el-form-item label="大牌任务标题" prop="title">
          <el-input v-model="searchForm.title" placeholder="请输入"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleRest('searchForm')">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">新增</el-button>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" property="coverUrl" label="大牌任务封面">
        <template slot-scope="scope">
          <img :src="scope.row.coverUrl" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="大牌任务标题" prop="title"/>

      <el-table-column header-align="center" label="大牌任务描述" prop="description"/>

      <el-table-column align="center" label="排序" prop="sort"/>

      <el-table-column align="center" label="关注人数" prop="joinCount"/>

      <el-table-column align="center" label="创建时间" prop="gmtCreated"/>

      <el-table-column align="center" label="操作" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchForm.page" :limit.sync="searchForm.limit" @pagination="getList" />

    <!-- 大牌任务详情对话框 -->
    <el-dialog :visible.sync="topMissionDialogVisible" title="大牌任务详情" width="70%">
      <el-card class="box-card">
        <h3>基本信息</h3>
        <el-form :data="topMissionInfo" label-position="left" label-width="120px">
          <el-form-item label="大牌任务标题">
            <span>{{ topMissionInfo.title }}</span>
          </el-form-item>
          <el-form-item label="大牌任务描述">
            <span>{{ topMissionInfo.description }}</span>
          </el-form-item>
          <el-form-item label="大牌任务排序">
            <span>{{ topMissionInfo.sort }}</span>
          </el-form-item>
          <el-form-item label="大牌任务封面">
            <img :src="topMissionInfo.coverUrl" alt="">
          </el-form-item>
          <el-form-item label="大牌任务宣传图">
            <img :src="topMissionInfo.publicityUrl" alt="">
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card">
        <h3>任务列表</h3>
        <el-table v-loading="listLoading" :data="detailList" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column align="center" label="任务编号" prop="bizId"/>

          <el-table-column align="center" property="imageUrl" label="任务图片">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" width="40">
            </template>
          </el-table-column>

          <el-table-column align="center" label="任务类目" prop="taskCategoryTitle"/>

          <el-table-column align="center" label="任务标题" prop="title"/>

          <el-table-column align="center" label="任务描述" prop="description"/>

          <el-table-column align="center" label="任务佣金（元）" prop="taskRate"/>

          <el-table-column align="center" label="参与人数" prop="joinCount"/>

          <el-table-column align="center" label="创建时间" prop="gmtCreated"/>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { queryTopMission, queryTaskConfigsByBizId, delTopMission } from '@/api/operation/topMission'
import { uploadPath } from '@/api/public'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 查询表单
      searchForm: {
        title: '', // 大牌任务标题
        page: 1, // 从1开始查询
        limit: 10 // 初始查询10条
      },

      // 表格列表数据
      list: [],
      total: 0,
      listLoading: false,

      // 新增修改弹框
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dataForm: {
        title: '',
        description: '',
        coverUrl: '',
        publicityUrl: ''
      },
      rules: {},
      active: 0,

      // 上传图片
      uploadPath,

      // 详情弹框
      topMissionInfo: '',
      topMissionDialogVisible: false,
      detailList: []

    }
  },
  computed: {
    headers() {
      return {
        'Authorization': getToken()
      }
    }
  },
  created() {
    this.initData()
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
        title: this.searchForm.title,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      this.listLoading = true
      queryTopMission(para).then((res) => {
        this.list = res.data.data
        this.total = Number(res.data.count)
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
     * 新增
     */
    handleCreate() {
      this.$router.push({
        path: '/operation/create'
      })
    },
    /**
     * 查看详情
     */
    handleDetail(row) {
      this.topMissionInfo = row
      this.topMissionDialogVisible = true
      const para = {
        taskSpecialBizId: row.bizId,
        page: 1,
        limit: 10
      }
      queryTaskConfigsByBizId(para).then((res) => {
        this.detailList = res.data.data
      })
    },
    /**
     * 修改任务弹窗
     */
    handleUpdate(row) {
      this.$router.push({
        path: '/operation/edit',
        query: {
          id: row.id
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.dataForm = {
        title: '',
        description: '',
        coverUrl: '',
        publicityUrl: ''
      }
    },
    /**
     * 删除大牌任务
     */
    handleDelete(row) {
      this.$confirm('删除大牌任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const para = {
          id: row.id
        }
        delTopMission(para).then((res) => {
          this.$message.success(res.data.message)
          this.getList()
        })
      }).catch(() => {

      })
    },
    /**
     * 初始化数据
     */
    initData() {
      this.getList()
    }
  }
}
</script>

<style>
.el-card {
    margin-bottom: 10px;
  }
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>
