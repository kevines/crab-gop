<!-- 新增大牌任务页 -->
/*
 * @Author: wangyang
 * @Date: 2019-03-29 08:55:35
 * @Last Modified by: wangyang
 * @Last Modified time: 2019-05-23 15:23:11
 */
<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-steps :active="active" finish-status="success">
        <el-step title="填写基本信息"/>
        <el-step title="添加任务"/>
        <el-step title="完成"/>
      </el-steps>
    </el-card>

    <el-card v-if="active === 0" class="box-card">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="大牌任务标题" prop="title" style="width: 600px" >
          <el-input v-model="dataForm.title" placeholder="最多允许输入40个字符" maxlength="40"/>
        </el-form-item>
        <el-form-item label="大牌任务描述" prop="description" style="width: 600px">
          <el-input v-model="dataForm.description" placeholder="最多允许输入20个字符" maxlength="20"/>
        </el-form-item>
        <el-form-item label="大牌任务排序" prop="sort" style="width: 600px">
          <el-input v-model="dataForm.sort" placeholder="请输入1-9的整数，数字越小越排在前面"/>
        </el-form-item>
        <el-form-item label="大牌任务封面" prop="coverUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadCoverUrl"
            :before-upload="beforeUploadCoverUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.coverUrl" :src="dataForm.coverUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <span v-if="dataForm.sort == 1">图片大小不超过1M，建议尺寸为340*394或同等比例的图片，支持图片格式：JPG,JPEG,PNG</span>
          <span v-else>图片大小不超过1M，建议尺寸为340*186或同等比例的图片，支持图片格式：JPG,JPEG,PNG</span>
        </el-form-item>
        <el-form-item label="大牌任务宣传图" prop="publicityUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadpublicityUrl"
            :before-upload="beforeUploadpublicityUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.publicityUrl" :src="dataForm.publicityUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <span>图片大小不超过5M，建议尺寸为1125*1125或同等比例的图片，支持图片格式：JPG,JPEG,PNG</span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="active === 1" class="box-card">
      <el-button type="primary" style="margin-bottom: 20px;" @click="addMisson">添加任务</el-button>

      <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" label="任务编号" prop="bizId"/>

        <el-table-column align="center" property="imageUrl" label="任务主图">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="40">
          </template>
        </el-table-column>

        <el-table-column align="center" label="任务标题" prop="title"/>

        <el-table-column align="center" label="任务描述" prop="description"/>

        <el-table-column align="center" label="收益" prop="taskRate"/>

        <el-table-column align="center" label="关注人数" prop="joinCount"/>

        <el-table-column align="center" label="创建时间" prop="gmtCreated"/>

        <el-table-column align="center" label="操作" width="100" class-name="small-padding" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleRemove(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getTaskConfigsByBizId" />
    </el-card>

    <el-card v-if="active === 2" class="box-card" style="text-align:center;padding:200px;">
      <i class="el-icon-success" style="color:#409EFF;font-size:50px;"/>
      <div style="margin-top:30px;">恭喜大牌任务已经添加成功，将展示在APP大牌任务集合里～</div>
    </el-card>

    <el-card class="box-card" style="text-align:center">
      <el-button v-if="active !== 0" @click="prev">上一步</el-button>
      <el-button v-if="active !== 2" type="primary" @click="next">下一步</el-button>
      <el-button v-if="active === 2" type="primary" @click="confirmAddMission">确 认</el-button>
    </el-card>

    <!-- 选择任务对话框 -->
    <el-dialog :visible.sync="chooseMissionDialogVisible" title="选择任务" width="80%">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-position="right" label-width="80px">
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="searchForm.title" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="任务类目" prop="taskCategoryBizId">
          <el-select v-model="searchForm.taskCategoryBizId" placeholder="请选择">
            <el-option
              v-for="item in categoryList"
              :key="item.bizId"
              :label="item.title"
              :value="item.bizId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务区域" prop="addressCode">
          <el-cascader
            v-model="searchForm.addressCode"
            :options="provinceData"
            class="location"
            @active-item-change="(val) => {handleItemChange(val, 2)}"
          />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleRest">重置</el-button>
      </el-form>
      <el-table v-loading="listLoading" :data="addList" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row @selection-change="selsChange">

        <el-table-column align="center" label="任务编号" prop="bizId"/>

        <el-table-column align="center" property="imageUrl" label="任务图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="40">
          </template>
        </el-table-column>

        <el-table-column align="center" label="任务类目" prop="taskCategoryTitle"/>

        <el-table-column align="center" label="任务区域" prop=""/>

        <el-table-column align="center" label="任务标题" prop="title"/>

        <el-table-column align="center" label="任务佣金（元）" prop="taskRate"/>

        <el-table-column align="center" label="关注人数" prop="joinCount"/>

        <el-table-column align="center" label="创建时间" prop="gmtCreated"/>

        <el-table-column align="center" type="selection" width="80"/>
      </el-table>
      <pagination v-show="addTotal>0" :total="addTotal" :page.sync="searchForm.page" :limit.sync="searchForm.limit" @pagination="getTaskConfigsBySearchForm" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseMissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryTaskCategory } from '@/api/task/taskCategory'
import { queryTaskConfigsByBizId, addTopMission } from '@/api/operation/topMission'
import { getToken } from '@/utils/auth'
import { uploadPath } from '@/api/public'
import addressMixin from '@/utils/addressMixin.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'MissionCreate',
  components: { Pagination },
  mixins: [addressMixin],
  data() {
    return {
      categoryList: [],
      uploadPath,
      active: 0,
      inputLong: 0,
      dataForm: {
        title: '', // 标题
        description: '', // 任务描述
        sort: '',
        coverUrl: '', // 大牌任务封面
        publicityUrl: '', // 大牌任务宣传图
        taskIds: ''
      },
      rules: {
        title: [{ required: true, message: '请输入大牌任务标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入大牌任务描述', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入大牌任务排序', trigger: 'blur' }],
        coverUrl: [{ required: true, message: '请上传大牌任务封面', trigger: 'change' }],
        publicityUrl: [{ required: true, message: '请上传大牌任务宣传图', trigger: 'change' }]
      },
      list: [],
      page: 1,
      limit: 10,
      total: 0,
      addList: [{}],
      addTotal: 0,
      chooseMissionDialogVisible: false,
      searchForm: {
        title: '',
        taskCategoryBizId: '',
        addressCode: [],
        page: 1,
        limit: 10
      },
      listLoading: false,
      sels: [],
      ids: '',
      provinceData: []
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

  },
  methods: {
    /**
     * 查询类目列表
     */
    getCategoryList() {
      const para = {
        page: this.page,
        limit: this.limit
      }
      queryTaskCategory(para).then((res) => {
        this.categoryList = res.data.data
      })
    },
    /**
     * 新增任务查询任务列表
     */
    getTaskConfigsByBizId() {
      const para = {
        ids: this.ids || 0,
        page: this.page,
        limit: this.limit
      }
      queryTaskConfigsByBizId(para).then((res) => {
        this.list = res.data.data
        this.total = res.data.count
      })
    },
    /**
     * 移除任务
     */
    handleRemove(index) {
      this.list.splice(index, 1)
    },
    /**
     * 添加任务的查询任务列表
     */
    getTaskConfigsBySearchForm() {
      this.chooseMissionDialogVisible = true
      const para = {
        title: this.searchForm.title,
        taskCategoryBizId: this.searchForm.taskCategoryBizId,
        page: this.searchForm.page,
        limit: this.searchForm.limit,
        auditStatus: 2,
        isDisabled: 0,
        addressCode: this.searchForm.addressCode[2] ? this.searchForm.addressCode[2] : ''
      }
      queryTaskConfigsByBizId(para).then((res) => {
        this.addList = res.data.data
        this.addTotal = res.data.count
      })
    },
    /**
     * 上传封面图片
     */
    uploadCoverUrl(res) {
      this.dataForm.coverUrl = res.data
    },
    beforeUploadCoverUrl(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
    },
    /**
     * 上传宣传图片
     */
    uploadpublicityUrl(res) {
      this.dataForm.publicityUrl = res.data
    },
    beforeUploadpublicityUrl(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
    },
    /**
     * 上一步
     */
    prev() {
      if (this.active-- < 0) this.active = 2
    },
    /**
     * 下一步
     */
    next() {
      if (this.active === 0) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.active++
          } else {
            return false
          }
        })
      } else {
        if (this.ids !== '') {
          this.active++
        } else {
          this.$message.error('请添加任务')
        }
      }
      if (this.active === 1) {
        this.getTaskConfigsByBizId()
      } else if (this.active > 2) {
        this.active = 0
      }
    },
    /**
     * 添加任务
     */
    addMisson() {
      this.getCategoryList()
      this.getTaskConfigsBySearchForm()
      this.getAddressquery()
    },
    /**
     * 条件查询
     */
    handleQuery() {
      this.searchForm.page = 1
      this.getTaskConfigsBySearchForm()
    },
    /**
     * 重置
     */
    handleRest() {
      this.$refs['searchForm'].resetFields()
      this.getTaskConfigsBySearchForm()
    },
    // 多选事件
    selsChange(sels) {
      this.sels = sels
    },
    /**
     * 确认选择
     */
    confirm() {
      const arr = []
      this.sels.forEach((item) => {
        arr.push(item.id)
      })
      this.ids = arr.toString()
      this.chooseMissionDialogVisible = false
      this.getTaskConfigsByBizId()
    },
    /**
     * 确认条件大牌任务
     */
    confirmAddMission() {
      const para = {
        title: this.dataForm.title,
        description: this.dataForm.description,
        coverUrl: this.dataForm.coverUrl,
        publicityUrl: this.dataForm.publicityUrl,
        taskIds: this.ids,
        sort: this.dataForm.sort
      }
      addTopMission(para).then((res) => {
        this.$router.push({
          path: '/operation/topMission'
        })
      })
    }
  }
}
</script>

<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
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
