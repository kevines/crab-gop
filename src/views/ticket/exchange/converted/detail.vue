<!-- 已兑换记录详情页 -->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>兑换券内容</h3>
      <el-form ref="ticket" :model="ticket" label-width="150px" style="width: 600px;">
        <el-form-item label="兑换券名称：" prop="ticketName">
          <span>{{ticket.exchangeTicketSpecificationResult.ticketName}}</span>
        </el-form-item>

        <el-form-item label="兑换券号：" prop="ticketNo">
          <span>{{ticket.ticketNo}}</span>
        </el-form-item>

        <el-form-item label="套餐名称：" prop="goodName">
          <span>{{ticket.exchangeTicketSpecificationResult.goodName}}</span>
        </el-form-item>

        <el-form-item label="商品规格内容：" prop="specification">
          <span>{{ticket.exchangeTicketSpecificationResult.specification}}</span>
        </el-form-item>

        <el-form-item label="商品图片：" style="width: 1000px;" prop="goodPic">
          <img :src="ticket.exchangeTicketSpecificationResult.goodPic" width="300" />
        </el-form-item>
        <el-form-item label="商品数量：" prop="goodNum">
          <span>{{ticket.exchangeTicketSpecificationResult.goodNum}}对</span>
        </el-form-item>
        <el-form-item label="兑换状态：" prop="isExchange">
          <el-tag
            :type="ticket.exchangeTicket.isExchange ?'success':'danger'"
          >{{ ticket.exchangeTicket.isExchange ? '已兑换' : '未兑换' }}</el-tag>
        </el-form-item>
        <el-form-item label="兑换日期：" prop="expiryDate">
          <span>{{ticket.exchangeTicketSpecificationResult.expiryDate}}</span>
        </el-form-item>
        <el-form-item label="发货状态：" prop="isSend">
          <el-tag
            :type="ticket.exchangeTicket.isSend?'success':'danger'"
          >{{ ticket.exchangeTicket.isSend ? '已发货' : '未发货' }}</el-tag>
        </el-form-item>
        <el-form-item label="发货日期：" prop="sendDate">
          <span v-if="ticket.exchangeTicket.sendDate === null">未处理发货，暂无信息</span>
          <span v-if="ticket.exchangeTicket.sendDate != null">{{ticket.exchangeTicket.sendDate}}</span>
        </el-form-item>
        <el-form-item label="兑换人姓名：" prop="userName">
          <span>{{ticket.userName}}</span>
        </el-form-item>
        <el-form-item label="兑换人手机：" prop="mobile">
          <span>{{ticket.mobile}}</span>
        </el-form-item>
        <el-form-item label="兑换人地址：" prop="address">
          <span>{{ticket.address}}</span>
        </el-form-item>
        <el-form-item label="快递公司：" prop="logisticsName">
          <span v-if="ticket.logisticsName === null">未处理发货，暂无信息</span>
          <span v-if="ticket.logisticsName != null">{{ticket.logisticsName}}</span>
        </el-form-item>
        <el-form-item label="快递单号：" prop="logisticsNo">
          <span v-if="ticket.logisticsNo === null">未处理发货，暂无信息</span>
          <span v-if="ticket.logisticsNo != null">{{ticket.logisticsNo}}</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 处理发货对话框 -->
    <el-dialog :visible.sync="ticketDialogVisible" title="添加兑换券" width="700">
      <el-form
        ref="ticketInfo"
        :model="ticketInfo"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="兑换码：" prop="ticketNo">
          <el-input v-model="ticketInfo.ticketNo" placeholder="兑换券名称" disabled />
        </el-form-item>
        <el-form-item label="物流公司：" prop="logisticsName">
          <el-input v-model="ticketInfo.logisticsName" placeholder="物流公司" />
        </el-form-item>
        <el-form-item label="物流单号：" prop="logisticsNo">
          <el-input v-model="ticketInfo.logisticsNo" placeholder="物流单号" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ticketDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSend">确 定</el-button>
      </span>
    </el-dialog>

    <div class="op-container">
      <el-button @click="handleCancel">返回列表页</el-button>
      <el-button
        v-if="this.ticket.exchangeTicket.isSend === false"
        type="primary"
        @click="handleSendDialog"
      >处理发货</el-button>
    </div>
  </div>
</template>

<script>
import { queryConvertedTicketList } from "@/api/ticket/ticket";
import {
  sendTicketGood,
  queryTicketRecordDetail,
  cancelSendTicketGood
} from "@/api/ticket/record";
import { uploadPath } from "@/api/public";
import { getToken } from "@/utils/auth";

export default {
  name: "editTicket",
  data() {
    return {
      uploadPath,
      ticket: {
        exchangeTicketSpecificationResult: {},
        exchangeTicket: {}
      },
      picUrl: [],
      ticketInfo: {
        ticketNo: "",
        logisticsName: "",
        logisticsNo: ""
      },
      ticketDialogVisible: false,
      rules: {
        logisticsName: [
          { required: true, message: "请输入物流公司名称", trigger: "blur" }
        ],
        logisticsNo: [
          { required: true, message: "请输入物流单号", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    headers() {
      return {
        Authorization: getToken()
      };
    },
    ticketId() {
      return this.$route.query.id;
    }
  },
  created() {
    this.getTicketDetail();
  },

  methods: {
    /**
     * 获取兑换券详情
     */
    getTicketDetail() {
      if (this.ticketId === null) {
        return;
      }
      const para = {
        id: this.ticketId
      };
      queryTicketRecordDetail(para).then(res => {
        this.ticket = res.data.data;
        console.log(this.ticket);
      });
    },
    /**
     * 返回兑换券列表
     */
    handleCancel: function() {
      this.$router.push({ path: "/ticket/have/exchange/list" });
    },
    /**
     * 点击出现处理发货弹窗
     */
    handleSendDialog(row) {
      //打开弹窗
      this.ticketDialogVisible = true;
      //渲染信息到弹窗中
      const para = {
        id: this.ticketId
      };
      queryTicketRecordDetail(para).then(res => {
        this.ticketInfo.ticketNo = res.data.data.ticketNo;
      });
      //将之前填写的数据清楚
      this.ticketInfo.logisticsName = "";
      this.ticketInfo.logisticsNo = "";
    },
    /**
     * 发货操作
     */
    handleSend() {
      this.$refs["ticketInfo"].validate(valid => {
        if (valid) {
          const para = {
            ticketNo: this.ticketInfo.ticketNo,
            logisticsNo: this.ticketInfo.logisticsNo,
            logisticsName: this.ticketInfo.logisticsName
          };
          sendTicketGood(para)
            .then(res => {
              this.$message.success(res.data.message);
              this.getTicketDetail();
              this.ticketDialogVisible = false;
            })
            .catch(respoonse => {
              this.$message.error(response.data.message);
              this.getTicketDetail();
            });
        } else {
          return false;
        }
      });
    }
  }
};
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
