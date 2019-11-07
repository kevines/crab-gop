<!--闪屏广告页管理-->
<template>
  <div class="app-container">
    <!-- 新增和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-button class="filter-item" icon="el-icon-circle-plus-outline" type="primary" @click="handleCreate">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column align="center" label="闪屏广告页名称" prop="title"/>
      <el-table-column align="center" property="imgUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="40">
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布人" prop="creator"/>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
          <el-tag v-if="scope.row.status == 0" type="info">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="250"
        class-name="small-padding"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==0" type="success" size="mini" @click="startBanner(scope.row)">启用</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button v-if="scope.row.status==1" type="info" size="mini" @click="disaleBanner(scope.row)">禁用</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="120px"
        style="margin-left:50px;"
      >
        <el-form-item v-if="dialogStatus!='set'" label="闪屏广告页名称" prop="title" style="width:400px">
          <el-input v-model="dataForm.title"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus!='set'" label="上传图片" prop="imgUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIconUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.imgUrl" :src="dataForm.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <span style="font-size:12px;">图片建议尺寸为750px*1334px，支持图片格式：JPG,JPEG,PNG</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData">确定</el-button>
        <el-button v-else-if="dialogStatus=='set'" type="primary" @click="setData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryBanner, addBanner, editBanner, deleteBanner } from '@/api/operation/banner'
import { uploadPath } from '@/api/public'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10
      },
      list: [], // 表格列表数据
      total: 0,
      dataForm: {
        title: '', // 广告名称
        imgUrl: '', // 图片
        creator: '', // 发布人
        status: '' // 状态
      },
      uploadPath,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改'
      },
      rules: {
        title: [
          { required: true, message: '闪屏广告页名称不能为空', trigger: 'blur' }
        ],
        imgUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取banner列表数据
     */
    getList() {
      const para = {
        type: 2,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      this.listLoading = true
      queryBanner(para)
        .then(res => {
          this.list = res.data.data
          this.total = parseInt(res.data.count)
          this.listLoading = false
        })
    },
    resetForm() {
      this.dataForm = {
        title: '', // 广告名称
        imgUrl: '', // 图片
        creator: '', // 发布人
        status: '' // 状态
      }
    },
    // 上传图片
    uploadIconUrl: function(response) {
      this.dataForm.imgUrl = response.data
    },
    /**
     * 新增banner
     */
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改banner
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 实现修改
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            title: this.dataForm.title,
            imgUrl: this.dataForm.imgUrl,
            id: this.dataForm.id
          }
          editBanner(para).then(res => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    // 实现新增banner
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            title: this.dataForm.title,
            type: 2,
            imgUrl: this.dataForm.imgUrl
          }
          addBanner(para).then(res => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    /**
     * 禁用banner
     */
    disaleBanner(row) {
      this.$confirm('禁用该闪屏广告页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const para = {
          id: row.id,
          status: 0
        }
        editBanner(para).then((res) => {
          this.$message.success(res.data.message)
          this.getList()
        })
      })
    },
    /**
     * 启用banner
     */
    startBanner(row) {
      this.$confirm('启用该闪屏广告页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const para = {
          id: row.id,
          status: 1
        }
        editBanner(para).then((res) => {
          this.$message.success(res.data.message)
          this.getList()
        })
      })
    },
    /**
     * 删除banner
     */
    handleDelete(row) {
      this.$confirm('此操作将永久删除该引导页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const para = {
            id: row.id
          }
          deleteBanner(para).then(res => {
            this.$message.success(res.data.message)
            this.getList()
          })
        }).catch(() => {

        })
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
      this.getList()
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
.tableCell .el-table__body-wrapper .cell {
  padding: 20px;
}
</style>
