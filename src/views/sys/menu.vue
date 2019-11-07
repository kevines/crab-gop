/*
 * @Author: wangyang
 * @Date: 2019-04-10 10:19:29
 * @Last Modified by: wangyang
 * @Last Modified time: 2019-04-10 10:20:59
 */
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="box-card">
          <div class="menu">
            <h3>一级菜单</h3>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleFirstCreate">新增一级菜单</el-button>
          </div>
          <!-- 查询结果 -->
          <el-table v-loading="listLoading" :data="firstMenuList" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row @row-click="getSecondLevel">
            <el-table-column align="center" label="菜单名称" prop="name"/>

            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleFirstUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="menu">
            <h3>二级菜单</h3>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleSecondCreate">新增二级菜单</el-button>
          </div>
          <!-- 查询结果 -->
          <el-table v-loading="listLoading" :data="secondMenuList" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
            <el-table-column align="center" label="菜单名称" prop="name"/>

            <el-table-column align="center" label="Url" prop="url"/>

            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleSecondUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item v-if="!noUrl" label="Url" prop="url">
          <el-input v-model="dataForm.url"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='firstCreate'" type="primary" @click="createFirstData">确 认</el-button>
        <el-button v-if="dialogStatus=='firstUpdate'" type="primary" @click="updateFirstData">确 认</el-button>
        <el-button v-if="dialogStatus=='secondCreate'" type="primary" @click="createSecondData">确 认</el-button>
        <el-button v-if="dialogStatus=='secondUpdate'" type="primary" @click="updateSecondData">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryMenu, addMenu, editMenu, delMenu } from '@/api/sys/menu'
import Pagination from '@/components/Pagination'
export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      searchForm: {
        roleName: '',
        page: 1,
        limit: 10
      },
      firstMenuList: null,
      secondMenuList: null,
      total: 0,
      listLoading: true,

      dataForm: {
        id: undefined,
        name: undefined,
        url: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        firstCreate: '新增一级菜单',
        firstUpdate: '修改一级级菜单',
        secondCreate: '新增二级菜单',
        secondUpdate: '修改二级级菜单'
      },
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'Url地址不能为空', trigger: 'blur' }
        ]
      },
      noUrl: true,
      pcode: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取菜单列表
     */
    getList() {
      this.listLoading = true
      queryMenu().then((res) => {
        this.firstMenuList = res.data.data
        this.secondMenuList = this.firstMenuList[0].children
        this.pcode = this.firstMenuList[0].code
        this.listLoading = false
      })
    },
    /**
     * 获取二级菜单
     */
    getSecondLevel(row, column, event) {
      this.secondMenuList = row.children
      this.pcode = row.code
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        url: undefined
      }
    },
    /**
     * 新增一级菜单弹框
     */
    handleFirstCreate() {
      this.resetForm()
      this.dialogStatus = 'firstCreate'
      this.noUrl = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 确认新增一级菜单
     */
    createFirstData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            levels: 1,
            name: this.dataForm.name,
            url: '#',
            pcode: ''
          }
          addMenu(para).then((res) => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    /**
     * 修改一级菜单弹框
     */
    handleFirstUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'firstUpdate'
      this.noUrl = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 确认修改一级菜单
     */
    updateFirstData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            menuId: this.dataForm.menuId,
            code: this.dataForm.code,
            name: this.dataForm.name,
            url: '#',
            pcode: ''
          }
          editMenu(para).then((res) => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    /**
     * 新增二级菜单弹框
     */
    handleSecondCreate() {
      this.resetForm()
      this.dialogStatus = 'secondCreate'
      this.noUrl = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 确认新增二级菜单
     */
    createSecondData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            levels: 2,
            name: this.dataForm.name,
            url: this.dataForm.url,
            pcode: this.pcode
          }
          addMenu(para).then((res) => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    /**
     * 修改二级菜单弹框
     */
    handleSecondUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'secondUpdate'
      this.noUrl = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 确认修改一级菜单
     */
    updateSecondData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const para = {
            menuId: this.dataForm.menuId,
            code: this.dataForm.code,
            name: this.dataForm.name,
            url: this.dataForm.url,
            pcode: this.pcode
          }
          editMenu(para).then((res) => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
            this.getList()
          })
        }
      })
    },
    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm('删除菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const para = {
          menuId: row.menuId
        }
        delMenu(para).then((res) => {
          this.$message.success(res.data.message)
          this.getList()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
.menu {
  display: -webkit-flex;
  display: -webkit-box;
  display: flex;
  line-height: 36px;
  justify-content: space-between;
  margin-bottom: 16px;
}
h3 {
  margin: 0;
}
</style>

