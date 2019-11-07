<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="searchForm.roleName" clearable placeholder="请输入"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleRest">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">新增</el-button>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="角色名称" prop="name"/>

      <el-table-column align="center" label="说明" prop="description"/>
      <el-table-column align="center" label="权限" prop="menuName"/>

      <el-table-column align="center" label="创建时间" prop="createTime"/>

      <el-table-column align="center" label="修改时间" prop="updateTime"/>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handlePermission(scope.row)">授权</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchForm.page" :limit.sync="searchForm.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="dataForm.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog :visible.sync="permissionDialogFormVisible" title="权限配置">
      <el-tree
        ref="tree"
        :data="systemPermissions"
        :default-checked-keys="assignedPermissions"
        :default-expanded-keys="assignedPermissions"
        :props="defaultProps"
        show-checkbox
        node-key="menuId"
        highlight-current>
        <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.name }}</span>
          <el-tag v-if="data.api" type="success" size="mini">{{ data.api }}</el-tag>
        </span> -->
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePermission">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { queryRole, addRole, editRole, delRole, queryMenuTree, editMenuTreePermission } from '@/api/sys/role'
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
      list: null,
      total: 0,
      listLoading: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },

      dataForm: {
        id: undefined,
        name: undefined,
        description: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改角色',
        create: '新增角色'
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      permissionForm: {
        roleId: undefined,
        permissions: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const para = {
        name: this.searchForm.roleName,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      }
      this.listLoading = true
      queryRole(para).then((res) => {
        this.list = res.data.data
        this.total = res.data.count
        this.listLoading = false
      })
    },
    /**
     * 查询角色列表
     */
    handleQuery() {
      this.searchForm.page = 1
      this.getList()
    },
    /**
     * 重置查询
     */
    handleRest() {
      this.$refs['searchForm'].resetFields()
      this.getList()
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        desc: undefined
      }
    },
    /**
     * 新增弹框
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
            name: this.dataForm.name,
            description: this.dataForm.description
          }
          addRole(para).then((res) => {
            this.dialogFormVisible = false
            this.$message.success(res.data.message)
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
            roleId: this.dataForm.roleId,
            name: this.dataForm.name,
            description: this.dataForm.description
          }
          editRole(para).then((res) => {
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
      this.$confirm('删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const para = {
          roleId: row.roleId
        }
        delRole(para).then((res) => {
          this.$message.success(res.data.message)
          this.getList()
        })
      }).catch(() => {
      })
    },
    handlePermission(row) {
      this.permissionDialogFormVisible = true
      this.permissionForm.roleId = row.roleId
      this.assignedPermissions = row.menuIds
      queryMenuTree({ roleId: row.roleId })
        .then(response => {
          this.systemPermissions = response.data.data
        })
    },
    updatePermission() {
      this.permissionForm.permissions = this.$refs.tree.getCheckedKeys(true)
      const arr = []
      this.permissionForm.permissions.forEach((item) => {
        arr.push(item)
      })
      const para = {
        roleId: this.permissionForm.roleId,
        menuIds: arr
      }
      editMenuTreePermission(para).then(response => {
        this.permissionDialogFormVisible = false
        this.getList()
      })
    }
  }
}
</script>
