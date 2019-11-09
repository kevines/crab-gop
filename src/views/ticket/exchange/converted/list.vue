<!--  所有蟹券列表页 -->
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="兑换券名称" prop="ticketName">
          <el-input
            v-model="searchForm.ticketName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="兑换券名称"
          />
        </el-form-item>
    
        <el-form-item label="兑换物品" prop="goodName">
          <el-input
            v-model="searchForm.goodName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="兑换物品"
          />
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
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
        >生成兑换券</el-button>
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

      <el-table-column align="center" label="兑换码" prop="ticketNo" />

      <el-table-column align="center" label="商品名称" prop="goodName" />
      <el-table-column align="center" label="商品规格" prop="specification" />
      <el-table-column align="center" label="商品图片" prop="goodPic" >
        <template slot-scope="scope">
          <img :src="scope.row.goodPic" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品数量" prop="goodNum" />

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
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增蟹券对话框 -->
    <el-dialog :visible.sync="categoryDialogVisible" title="选择类目" width="800">
      <el-form ref="ticketInfo" :model="ticketInfo" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="所属类目" prop="goodName">
          <el-input v-model="ticketInfo.goodName" placeholder="商品名称" />
        </el-form-item>
        <el-form-item label="类目图标" prop="goodPic">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.imgUrl" :src="dataForm.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTicket">确 定</el-button>
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
import { createTicket,queryTicketList } from "@/api/ticket/ticket";
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
        specification: "", //规格名称
        ticketNo: "",  //兑换券编号
        page: 1,
        limit: 10
      },
      list: [],
      uploadPath,
      categoryDialogVisible: false,
      ticketInfo: {
        goodName: "",   //商品名称
        ticketName: "",   //兑换券名称
        specification: "",  //商品规格详情
        stock: "", //生成兑换券张数
        expiryDate: "",  //截止日期
        goodPic: "",   //商品图片
        goodNum: ""   //商品个数
      },
      dataForm: {
        name: '',
        imgUrl: ''
      },
      total: 0,
      listLoading: false,
      rules: {},
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
     * 批量新增，弹出新增窗口
     */
    handleAdd() {
      this.categoryDialogVisible = true
    },
    /**
     * 添加兑换券
     */
    addTicket() {

    },
    /**
     * 查看兑换券详情
     */
    handleDetail(row) {
      this.$router.push({
        path: "/activity/activity/detail",
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
    },
    /**
     * 删除考试活动记录
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
    },
    /**
     * 修改发布状态
     */
    changePublishStatus(id, isPublish) {
      const para = {
        id: id,
        isPublish: isPublish
      };
      this.listLoading = true;
      editExam(para)
        .then(res => {
          this.listLoading = false;
          this.$message.success(res.data.message);
          this.getList();
        })
        .catch(response => {
          this.getList();

          this.$message.error(response.data.message);
          this.listLoading = false;
        });
    },
    /**
     * 修改考试活动报名是否需要审核步骤
     */
    changePermissionStatus(id, isPermission) {
      const para = {
        id: id,
        isPermission: isPermission
      };
      this.listLoading = true;
      editExam(para).then(res => {
        this.listLoading = false;
        this.getList();
      });
    },
    /**
     * 发送考试通知
     */
    postExamNotice(row) {
      this.$confirm("确定发送考试通知给已报名的用户么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const para = {
            examId: row.examId
          };
          noticeExam(para).then(res => {
            this.$message.success(res.data.message);
            console.log(res.data.data);
            this.getList();
          });
        })
        .catch(() => {});
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
</style>
