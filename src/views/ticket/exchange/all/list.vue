<!--  所有蟹券列表页 -->
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="兑换券名称" prop="ticketName">
          <el-select v-model="searchForm.ticketName" placeholder="请选择">
            <el-option
              v-for="item in ticketSpecificationList"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="兑换状态" prop="isExchange">
          <el-select v-model="searchForm.isExchange" placeholder="请选择">
            <el-option
              v-for="item in isExchangeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="发货状态" prop="isSend">
          <el-select v-model="searchForm.isSend" placeholder="请选择">
            <el-option
              v-for="item in isSendList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="兑换码" prop="ticketNo">
          <el-input
            v-model="searchForm.ticketNo"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="兑换码"
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

      <el-table-column align="center" label="兑换券名称" prop="ticketName" />
      <el-table-column align="center" label="卡号" prop="cardNo" />
      <el-table-column align="center" label="兑换码" prop="ticketNo" />

      <el-table-column align="center" label="商品名称" prop="goodName" />
      <el-table-column align="center" label="商品规格" prop="specification" />
      <el-table-column align="center" label="商品图片" prop="goodPic" >
        <template slot-scope="scope">
          <img :src="scope.row.goodPic" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品数量" prop="goodNum">
        <template slot-scope="scope">
          {{scope.row.goodNum}}对
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换状态" prop="isExchange">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isExchange?'success':'danger'"
          >{{ scope.row.isExchange ? '已兑换' : '未兑换' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发货状态" prop="isSend">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isSend?'success':'danger'"
          >{{ scope.row.isSend ? '已发货' : '未发货' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换截止日期" prop="expiryDate" />

      <el-table-column align="center" label="创建日期" prop="gmtCreated" />

      

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
  </div>
</template>

<script>
import { createTicket,queryTicketList,queryTicketNameSelectList } from "@/api/ticket/ticket";
import { uploadPath } from '@/api/public'
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
  name: "examList",
  components: { BackToTop, Pagination },
  data() {
    return {
      searchForm: {
        ticketName: "", //兑换券名称
        ticketNo: "",  //兑换券编号
        isExchange: "",
        isSend: "",
        page: 1,
        limit: 10
      },
      list: [],
      //兑换券名称下拉列表
      ticketSpecificationList: [],
      isExchangeList: [
        {
          code: true,
          name: "已兑换"
        },
        {
          code: false,
          name: "未兑换"
        }
      ],
      isSendList: [
        {
          code: true,
          name: "已发货"
        },
        {
          code: false,
          name: "未发货"
        }
      ],
      uploadPath,
      categoryDialogVisible: false,
      total: 0,
      listLoading: false,
      downloadLoading: false
    };
  },
  computed: {
    headers() {
      return {
        'Authorization': getToken()
      }
    }
  },
  created() {
    this.findTicketNameSelectList();
    this.getList();
  },
  methods: {
   
    /**
     * 查询蟹券列表
     */
    getList() {
      const para = {
        ticketName: this.searchForm.ticketName,
        goodName: this.searchForm.goodName,
        ticketNo: this.searchForm.ticketNo,
        isExchange: this.searchForm.isExchange,
        isSend: this.searchForm.isSend,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      };
      this.listLoading = true;
      queryTicketList(para)
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
     * 查询兑换券名称下拉列表
     */
    findTicketNameSelectList() {
      queryTicketNameSelectList().then(res => {
        this.ticketSpecificationList = res.data.data;
      });
    },
    /**
     * 查看兑换券详情
     */
    handleDetail(row) {
      this.$router.push({
        path: "/ticket/all/exchange/detail",
        query: {
          id: row.id
        }
      });
    },
    /**
     * 上传蟹券商品图片成功回调
     */
    uploadPicUrl: function(res) {
      this.dataForm.imgUrl = res.data
      console.log(this.dataForm.imgUrl)
      if(this.dataForm.imgUrl === null) {
        return;
      }
      this.ticketInfo.goodPic = this.dataForm.imgUrl
    },
    /**
     * 删除兑换券记录
     */
    handleDelete(row) {
      this.$confirm(
        "删除活动记录会将此活动所有相关数据及考试调研记录和获奖信息等都删除，属于极度危险操作, 请问是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const para = {
          id: row.id
        };
        deleteExam(para)
          .then(res => {
            this.$message.success(res.data.message);
            this.getList();
          })
          .catch(response => {
            console.log(response)
            this.$message.error(response.data.message);
            this.getList();
          });
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
