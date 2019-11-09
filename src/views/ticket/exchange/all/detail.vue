<!-- 兑换券编辑页 -->
<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>兑换券内容</h3>
      <el-form ref="ticket" :rules="rules" :model="ticket" label-width="150px" style="width: 600px;">

        <el-form-item label="兑换券名称：" prop="ticketName">
          <span>{{ticket.ticketName}}</span>
        </el-form-item>

        <el-form-item label="兑换券号：" prop="ticketNo">
          <span>{{ticket.ticketNo}}</span>
        </el-form-item>

        <el-form-item label="套餐名称：" prop="goodName">
          <span>{{ticket.goodName}}</span>
        </el-form-item>

        <el-form-item label="商品规格内容：" prop="specification">
          <span>{{ticket.specification}}</span>
        </el-form-item>

        <el-form-item label="商品图片：" style="width: 1000px;" prop="goodPic">
           <img :src="ticket.goodPic" width="300">
        </el-form-item>
        <el-form-item label="商品数量：" prop="goodNum">
            <span>{{ticket.goodNum}}对</span>
        </el-form-item>
      </el-form>
    </el-card>

    

    <div class="op-container">
      <el-button @click="handleCancel">返回列表页</el-button>
    </div>
  </div>
</template>

<script>
import { eidtTicket, queryTicketDetail } from '@/api/ticket/ticket'
import { uploadPath } from '@/api/public'
import { getToken } from '@/utils/auth'

export default {
  name: 'editTicket',
  data() {   
    return {
      uploadPath,
      ticket: {
        ticketName: '',
        ticketNo: '',
        goodName: '',
        goodPic: '',
        goodNum: '',
        exchangeDate: '',
        sendDate: ''
      },
      picUrl: [],
      rules: {
       
      }
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': getToken()
      }
    },
    ticketId() {
      return this.$route.query.id
    }
  },
  created() {
    this.getTicketDetail()
  },

  methods: {
    /**
     * 获取兑换券详情
     */
    getTicketDetail() {
      if (this.ticketId === null) {
        return
      }
      const para = {
        id: this.ticketId
      }
      queryTicketDetail(para).then((res) => {
        this.ticket = res.data.data
        console.log(this.ticket)
      })
    },
    /**
     * 返回兑换券列表
     */
    handleCancel: function() {
      this.$router.push({ path: '/ticket/all/exchange/list' })
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
  .input-new-tag {
    width: 100px;
  }
  .skuKey {
    padding: 10px 0;
  }
  .handleColor {
    color: #0193de;
    cursor: pointer;
    padding: 0 5px;
  }
  .batch {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
