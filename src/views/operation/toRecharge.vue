<!-- 充值管理页面 -->
/*
 * @Author: wangyang
 * @Date: 2019-03-23 17:05:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-18 19:47:16
 */
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        label-width="120px"
        style="width:380px;"
      >
        <el-form-item label="用户ID" hidden prop="userId">
          <el-input v-model.number="addForm.userId" placeholder maxlength="11" readonly/>
        </el-form-item>
        <el-form-item label="充值帐号" prop="phone">
          <el-autocomplete
            v-model="addForm.phone"
            :fetch-suggestions="getPhoneAsync"
            style="width:260px;"
            class="inline-input"
            suffix-icon="el-icon-search"
            placeholder="请输入要充值的用户账号(手机号)"
            @select="handleSelectPhone"
          />
        </el-form-item>
        <el-form-item label="商家/企业名称" prop="buyUserName">
          <el-input v-model="addForm.buyUserName" readonly placeholder="这里是商家/企业名称" />
        </el-form-item>
        <el-form-item label="充值金额（元）" prop="amount">
          <el-input v-model.number="addForm.amount" placeholder="请输入充值金额"/>
        </el-form-item>
        <el-form-item label="线下打款凭证" prop="imageUpload" style="width:800px;">
          <el-upload
            ref="upload"
            :action="uploadPath"
            :limit="10"
            :headers="headers"
            :on-exceed="uploadOverrun"
            :on-success="handleGalleryUrl"
            :on-remove="handleRemove"
            multiple
            accept=".jpg, .jpeg, .png, .gif"
            list-type="picture-card"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <span>请尽量提供线下打款凭证，以便财务核实，支持图片格式：JPG,JPEG,PNG</span>
        </el-form-item>
        <el-form-item label="充值备注" prop="remark" style="width:500px;">
          <el-input
            v-model="addForm.remark"
            :rows="4"
            type="textarea"
            placeholder="请简要填写备注信息，长度限制为1000字符"
          />
        </el-form-item>
        <el-button class="filter-item" @click="handleRest('addForm')">重置</el-button>
        <el-button class="filter-item" type="primary" @click="handleConfirm">确定</el-button>
      </el-form>
    </div>

    <!-- 充值确认框 -->
    <el-dialog :visible.sync="applyConfirmDialogVisible" title="请核对充值信息" width="500px" height="200px;">
      <el-form :data="addForm" label-position="left" label-width="100px">
        <el-form-item label="充值账号">
          <span>{{ addForm.phone }}</span>
        </el-form-item>
        <el-form-item label="商家/企业名称">
          <span>{{ addForm.buyUserName }}</span>
        </el-form-item>
        <el-form-item label="充值金额">
          <span>{{ addForm.amount }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyConfirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发起充值申请成功后提醒框 -->
    <el-dialog :visible.sync="applySuccessDialogVisible" title="充值请求已发送，请耐心等待财务人员审核">
      <el-form >
        <el-steps
          v-show="true"
          :active="2"
          finish-status="success"
          align-center
          style="margin-top:10%"
        >
          <el-step title="发起申请"/>
          <el-step title="财务审核中"/>
          <el-step title="审核完成"/>
        </el-steps>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applySuccessDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadPath } from '@/api/public'
import { getUserByPhoneName } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { saveRequest } from '@/api/finance/accountCharge'

export default {
  name: 'ToRecharge',
  data() {
    return {
      addForm: {
        phone: '',
        buyUserName: '',
        chargeChannel: '',
        amount: 0,
        status: '',
        createTime: '',
        credenceImages: []
      },
      applySuccessDialogVisible: false, // 申请成功进度弹框
      applyConfirmDialogVisible: false, // 确认申请信息弹框
      uploadPath,
      rules: {
        phone: [
          { required: true, message: '请输入充值帐号', trigger: blur },
          { min: 11, max: 11, message: '手机号码不合法' }
        ],
        amount: [
          { required: true, message: '请输入充值金额', trigger: blur },
          { message: '充值金额不合法', type: 'number', trigger: blur },
          { validator: this.validateAmount, trigger: blur }
        ],
        remark: [{ max: 10000, message: '长度限制为1000字符' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        Authorization: getToken()
      }
    }
  },
  created() {},
  methods: {
    handleSelectPhone(data) {
      const para = {
        key: data.value
      }
      getUserByPhoneName(para).then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          this.addForm.buyUserName = res.data.data[0].real_name
          this.addForm.userId = res.data.data[0].user_id
        } else {
          this.addForm.buyUserName = ''
          this.addForm.userId = ''
        }
      })
    },
    validateAmount(rule, value, callback) {
      if (!value) {
        callback(new Error('充值金额必填!'))
      }
      value = Number(value)
      if (typeof value === 'number' && !isNaN(value)) {
        if (value < 0 || value > 10000000) {
          callback(new Error('充值金额必须在 0 至 10000000 之间'))
        } else {
          callback()
        }
      } else {
        callback(new Error('充值金额必须为数字'))
      }
    },
    // 保存
    handleSave() {
      const para = {
        userId: this.addForm.userId,
        phone: this.addForm.phone,
        amount: this.addForm.amount,
        credenceImages: this.addForm.credenceImages,
        remark: this.addForm.remark
      }
      saveRequest(para).then(res => {
        this.applyConfirmDialogVisible = false
        if (res.data.code === 200) {
          this.$refs['addForm'].resetFields()
          this.applySuccessDialogVisible = true

          this.$refs.upload.clearFiles()
        } else {
          this.$notify.error({
            title: '失败',
            message: res.data.errmsg
          })
        }
      })
    },
    // 确认框
    handleConfirm() {
      this.$refs.addForm.validate(isValid => {
        this.applyConfirmDialogVisible = isValid
      })
    },

    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传10张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.code === 200) {
        this.addForm.credenceImages.push(response.data)
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.addForm.credenceImages.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data
        }

        if (this.addForm.credenceImages[i] === url) {
          this.addForm.credenceImages.splice(i, 1)
        }
      }
    },
    getPhoneAsync(param, callback) {
      const para = {
        key: this.addForm.phone
      }
      var resultList = [{}]
      getUserByPhoneName(para).then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          resultList = []
          for (var value of res.data.data) {
            resultList.push({ value: value.phone })
          }
          callback(resultList)
        } else {
          this.addForm.buyUserName = ''
          this.addForm.userId = ''
        }
      })
    },
    uploadPicUrl: function(res) {
      this.addForm.credenceImages = res.data
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
</style>
