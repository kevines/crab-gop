<!--  中奖用户列表页 -->
<template>
  <div class="app-container">
    <h3>注意：获取实时考试用户获奖记录请在下面输入框内选择对应活动名称进行查询</h3>
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="活动名称" prop="examId">
          <el-select v-model="searchForm.examId" placeholder="请选择">
            <el-option
              v-for="item in selectExamName"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="领奖状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option key="0" label="未领奖" value="1" />
            <el-option key="1" label="已领奖" value="2" />
            <el-option key="2" label="奖品已过期" value="3" />
          </el-select>
        </el-form-item>

      
        <el-form-item label="中奖日期" class="filter-item" prop="gmtCreated">
          <el-date-picker
            v-model="searchForm.gmtCreated"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleRest">重置</el-button>
        <el-button class="filter-item" type="success" icon="el-icon-search" @click="noticeDrawUser">发送通知</el-button>

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
      </el-table-column>
      <el-table-column align="center" label="活动名称" prop="examName"/>
      <el-table-column align="center" label="微信名称" prop="wxName"/>
      <el-table-column align="center" label="用户姓名" prop="userName"/>
      <el-table-column align="center" label="用户性别" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 'M'">男</span>
          <span v-if="scope.row.sex === 'N'">女</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信头像" prop="wxName">
        <template slot-scope="scope">
            <img :src="scope.row.appUser.wxPhoto" width="60" height="60" /> 
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话" prop="phone"/>
      

      <el-table-column align="center" label="领奖状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status === 1">未领奖</el-tag>
          <el-tag type="success" v-if="scope.row.status === 2">已领奖</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 3">奖品已过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="获奖日期" prop="gmtCreated" />

      <el-table-column align="center" label="领奖日期" prop="gmtModified" />

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.status === 1 " @click="changeStatus(scope.row.id, 2)">确认领奖</el-button>
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
import {
  queryExamDrawUserList,
  editExamDrawUser,
  noticeDrawUser
} from "@/api/draw/user";
import { queryExamListSelect } from "@/api/exam/exam";
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "examDrawUserList",
  components: { BackToTop, Pagination },
  data() {
    return {
      searchForm: {
        examId: "", //报名考试id
        userId: "", //报名用户id
        userName: "", //用户名称
        status: "",
        gmtCreated: "", //创建日期
        gmtModified: "", //修改日期
        page: 1,
        limit: 10
      },
      list: [],
      selectExamName:[],
      total: 0,
      listLoading: false,
      rules: {}
    };
  },
  created() {
    this.getPaperSelect();
    this.getList();
  },
  methods: {
    /**
     * 查询考卷名称下拉列表
     */
    getPaperSelect() {
      queryExamListSelect().then(res => {
        this.selectExamName = res.data.data
      })
    },
    /**
     * 查询获奖用户用户列表
     */
    getList() {
      const para = {
        examId: this.searchForm.examId,
        userId: this.searchForm.userId,
        status: this.searchForm.approveStatus,
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
        page: this.searchForm.page,
        limit: this.searchForm.limit
      };
      this.listLoading = true;
      queryExamDrawUserList(para)
        .then(res => {
          this.list = res.data.data;
          this.total = Number(res.data.count);
          this.listLoading = false;
          console.log(this.list)
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
          this.$message.error(res.data.message);
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
     * 修改审核状态
     */
    changeStatus(id, status) {
      const para = {
        id: id,
        status: status
      };
      this.listLoading = true;
      editExamDrawUser(para).then(res => {
        this.listLoading = false;
        this.getList();
      });
    },
    /**
     * 发送获奖通知消息
     */
    noticeDrawUser() {
      const para = {
        examId: this.searchForm.examId
      }
      this.listLoading = true;
      noticeDrawUser(para).then(res => {
        this.listLoading = false;
        this.$message.success(res.data.message);      
      }).catch(() => { 
        this.listLoading = false;
        this.$message.error(res.data.message);
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
</style>
