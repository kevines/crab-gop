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

      <el-table-column align="center" label="考试名称" prop="examName" />

      <el-table-column align="center" label="是否发布" prop="isPublish" width="200px">
        <template slot-scope="scope">
          <el-switch
            Fstyle="display: block"
            v-model="scope.row.isPublish"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上线"
            inactive-text="下线"
            @change="changePublishStatus(scope.row.id, scope.row.isPublish)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否需要审核" prop="isPermission">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isPermission?'success':'danger'"
          >{{ scope.row.isPermission ? '需要审核' : '不需要审核' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status === 1">报名未开始</el-tag>
          <el-tag type="success" v-if="scope.row.status === 2">报名中</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 3">报名结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考试状态" prop="isPublish">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.examPaperResult.status === 1">考试未开始</el-tag>
          <el-tag type="success" v-if="scope.row.examPaperResult.status === 2">考试中</el-tag>
          <el-tag type="danger" v-if="scope.row.examPaperResult.status === 3">考试已结束</el-tag>
        </template>
      </el-table-column>
      

      <el-table-column align="center" label="创建时间" prop="gmtCreated" />

      <el-table-column align="center" label="修改时间" prop="gmtModified" />

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="success" size="small" @click="postExamNotice(scope.row)">发送通知</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增蟹券对话框 -->
    <el-dialog :visible.sync="categoryDialogVisible" title="选择类目" width="800">
      <el-form ref="categoryInfo" :model="categoryInfo" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="所属类目" prop="categoryId">
          <el-select v-model="categoryInfo.categoryId" placeholder="请选择" style="width: 400px;">
            <el-option
              v-for="item in categoryList"
              :key="item.id+'@@'+item.name"
              :label="item.name"
              :value="item.id+'@@'+item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleToAdd">确 定</el-button>
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
import { createTicket } from "@/api/ticket/ticket";
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

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
      schoolList: [],
      paperList: [],
      surveyList: [],
      drawList: [],
      total: 0,
      listLoading: false,
      rules: {},
      downloadLoading: false
    };
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
        examId: this.searchForm.examId,
        schoolId: this.searchForm.schoolId,
        paperId: this.searchForm.paperId,
        surveyPaperId: this.searchForm.surveyPaperId,
        drawRuleId: this.searchForm.drawRuleId,
        startDate: this.searchForm.gmtCreated[0]
          ? this.$moment(new Date(this.searchForm.gmtCreated[0])).format(
              "YYYY-MM-DD"
            )
          : "",
        endDate: this.searchForm.gmtCreated[1]
          ? this.$moment(new Date(this.searchForm.gmtCreated[1])).format(
              "YYYY-MM-DD"
            )
          : "",
        isPublish: this.searchForm.isPublish,
        isPermission: this.searchForm.isPermission,
        page: this.searchForm.page,
        limit: this.searchForm.limit
      };
      this.listLoading = true;
      queryExamList(para)
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
     * 批量新增
     */
    handleAdd() {
      this.categoryDialogVisible = true
    },
    /**
     * 查看考试活动详情
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
     * 修改考试活动信息
     */
    handleUpdate(row) {
      const para = {
        id: row.id
      };
      checkExam(para)
        .then(res => {
          this.$router.push({
            path: "/activity/activity/edit",
            query: {
              id: row.id
            }
          });
        })
        .catch(response => {
          this.$message.error(response.data.message);
          this.getList();
        });
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
