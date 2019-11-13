<!-- 已兑换蟹券列表页 -->
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="兑换码" prop="ticketNo">
          <el-input
            v-model="searchForm.ticketNo"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="兑换码"
          />
        </el-form-item>

        <el-form-item label="联系人姓名" prop="userName">
          <el-input
            v-model="searchForm.userName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="联系人姓名"
          />
        </el-form-item>

        <el-form-item label="联系电话" prop="mobile">
          <el-input
            v-model="searchForm.mobile"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="联系电话"
          />
        </el-form-item>

        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input
            v-model="searchForm.logisticsNo"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="物流单号"
          />
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleRest">重置</el-button>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      size="small"
      element-loading-text="更新列表中......"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="兑换券名称" prop="ticketName">
        <template slot-scope="scope">
          <span>{{scope.row.exchangeTicketSpecificationResult.ticketName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换码" prop="ticketNo" />

      <el-table-column align="center" label="兑换状态" prop="isExchange">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.exchangeTicket.isExchange ?'success':'danger'"
          >{{ scope.row.exchangeTicket.isExchange ? '已兑换' : '未兑换' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发货状态" prop="isSend">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.exchangeTicket.isSend?'success':'danger'"
          >{{ scope.row.exchangeTicket.isSend ? '已发货' : '未发货' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换日期" prop="exchangeDate">
        <template slot-scope="scope">
          <span v-if="scope.row.exchangeTicket.exchangeDate === null">暂无</span>
          <span
            v-if="scope.row.exchangeTicket.exchangeDate != null"
          >{{scope.row.exchangeTicket.exchangeDate}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发货日期" prop="sendDate">
        <template slot-scope="scope">
          <span v-if="scope.row.exchangeTicket.sendDate === null">暂无</span>
          <span
            v-if="scope.row.exchangeTicket.sendDate != null"
          >{{scope.row.exchangeTicket.sendDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
          <el-button
            v-if="scope.row.exchangeTicket.isSend === false"
            type="success"
            size="small"
            @click="handleSendDialog(scope.row)"
          >处理发货</el-button>
          <!-- <el-button type="success" size="small" @click="handleCancleSend((scope.row))">撤销发货</el-button> -->
        </template>
      </el-table-column>
    </el-table>

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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="searchForm.page"
      :limit.sync="searchForm.limit"
      @pagination="getList"
    />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
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
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from "@/utils/auth";
import { send } from "q";

export default {
  name: "examList",
  components: { BackToTop, Pagination },
  data() {
    return {
      searchForm: {
        ticketNo: "", //兑换券编号
        userName: "", //用户姓名
        mobile: "", //联系方式
        logisticsNo: "", //物流单号
        page: 1,
        limit: 10
      },
      list: [],
      ticketInfo: {
        ticketNo: "",
        logisticsName: "",
        logisticsNo: ""
      },
      uploadPath,
      rules: {
        logisticsName: [
          { required: true, message: "请输入物流公司名称", trigger: "blur" }
        ],
        logisticsNo: [
          { required: true, message: "请输入物流单号", trigger: "blur" }
        ]
      },
      ticketDialogVisible: false,
      total: 0,
      listLoading: false,
      downloadLoading: false
    };
  },
  computed: {
    headers() {
      return {
        Authorization: getToken()
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /**
     * 查询蟹券列表
     */
    getList() {
      const para = {
        ticketNo: this.searchForm.ticketNo, //兑换券码
        userName: this.searchForm.userName, //用户姓名
        mobile: this.searchForm.mobile, //联系方式
        logisticsNo: this.searchForm.logisticsNo, //物流单号
        page: this.searchForm.page,
        limit: this.searchForm.limit
      };
      this.listLoading = true;
      queryConvertedTicketList(para)
        .then(res => {
          this.list = res.data.data;
          this.total = Number(res.data.count);
          this.listLoading = false;
          console.log(this.list);
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    /**
     * 条件查询
     */
    handleQuery() {
      this.searchForm.page = 1;
      this.getList();
    },
    /**
     * 重置
     */
    handleRest() {
      this.$refs["searchForm"].resetFields();
      this.getList();
    },
    /**
     * 查看兑换券详情
     */
    handleDetail(row) {
      this.$router.push({
        path: "/ticket/have/exchange/detail",
        query: {
          id: row.id
        }
      });
    },
    /**
     * 点击出现处理发货弹窗
     */
    handleSendDialog(row) {
      //打开弹窗
      this.ticketDialogVisible = true;
      //渲染信息到弹窗中
      const para = {
        id: row.id
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
              this.getList();
              this.ticketDialogVisible = false;
            })
            .catch(respoonse => {
              this.$message.error(response.data.message);
              this.getList();
            });
        } else {
          return false;
        }
      });
    },
    /**
     * 撤销发货
     */
    handleCancleSend(row) {
      const para = {
        ticketNo: row.ticketNo
      };
      cancelSendTicketGood(para)
        .then(res => {
          this.$message.success(res.data.message);
          this.getList();
        })
        .catch(response => {
          this.$message.error(response.data.message);
          this.getList();
        });
    }
  }
};
</script>

<style>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 100px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.gallery {
  width: 80px;
  margin-right: 10px;
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
