<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="100px">
        <el-form-item label="管理员名称" prop="roleName">
          <el-input v-model="searchForm.roleName" clearable placeholder="请输入"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleRest">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">新增管理员</el-button>
        <!-- <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleCreate">导出</el-button> -->
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="管理员编号" prop="userId"/>

      <el-table-column align="center" label="管理员名称" prop="account"/>

      <el-table-column align="center" label="管理员角色" prop="roleName"/>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchForm.page" :limit.sync="searchForm.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="管理员名称" prop="account">
          <el-input v-model="dataForm.account"/>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="管理员角色" prop="roleId">
          <el-select v-model="dataForm.roleId" placeholder="请选择" style="width:280px;">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.name"
              :value="item.roleId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { queryAdmin, addAdmin, editAdmin, delAdmin } from '@/api/sys/admin'
import { queryRole } from '@/api/sys/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
      searchForm: {
        roleName: '', // 管理员姓名
        page: 1,
        limit: 20
      },

      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        roleId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        account: [
          { required: true, message: '管理员名称不能为空', trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '密码不能为空', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 查询管理员列表
     */
    getList() {
      const para = {
        roleName: this.searchForm.roleName,
        limit: this.searchForm.limit,
        page: this.searchForm.page
      }
      this.listLoading = true
      queryAdmin(para).then((res) => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
      queryRole(para).then((res) => {
        this.roleOptions = res.data.data
      })
    },

    handleQuery() {
      this.getList()
    },
    handleRest() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        password: undefined,
        roleId: ''
      }
    },
    /**
     *  新增管理员弹框
     */
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 确认新增
     */
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            roleId: this.dataForm.roleId,
            password: this.dataForm.password,
            account: this.dataForm.account
          }
          addAdmin(para).then((res) => {
            this.$message.success(res.data.message)
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    /**
     * 修改弹框
     */
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dataForm.password = ''
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 确认修改
     */
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            userId: this.dataForm.userId,
            roleId: this.dataForm.roleId,
            password: this.dataForm.password,
            account: this.dataForm.account
          }
          editAdmin(para).then((res) => {
            this.$message.success(res.data.message)
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('删除管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const para = {
          userId: row.userId
        }
        delAdmin(para).then(res => {
          this.$message.success(res.data.message)
          this.getList()
        }).catch(res => {
          this.$message.success(res.data.message)
        })
      }).catch(() => {
      })
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
</style>
