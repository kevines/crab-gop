<!--  考试用户列表页 -->
<template>
  <div class="app-container">
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
        <!-- <el-form-item label="用户编号" prop="userId">
          <el-input
            v-model="searchForm.userId"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="用户编号"
          />
        </el-form-item> -->
        <el-form-item label="用户姓名" prop="name">
          <el-input
            v-model="searchForm.name"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="用户姓名"
          />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input
            v-model="searchForm.company"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="公司名称"
          />
        </el-form-item>
        <el-form-item label="部分名称" prop="department">
          <el-input
            v-model="searchForm.department"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="部分名称"
          />
        </el-form-item>
        <el-form-item label="职位名称" prop="job">
          <el-input
            v-model="searchForm.job"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="职位名称"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="searchForm.phone"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="联系电话"
          />
        </el-form-item>
        
        <el-form-item label="接收通知" prop="isReceive">
          <el-select v-model="searchForm.isReceive" placeholder="请选择">
            <el-option key="0" label="否" value="0" />
            <el-option key="1" label="是" value="1" />
          </el-select>
        </el-form-item>

        

        <!-- <el-form-item label="是否发布" prop="isPublish">
          <el-select v-model="searchForm.isPublish" placeholder="请选择">
            <el-option key="0" label="未发布" value="0" />
            <el-option key="1" label="已发布" value="1" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="报名时间" class="filter-item" prop="gmtCreated">
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
      <el-table-column align="center" label="活动名称" prop="examName">
        <template slot-scope="scope">
            <span>{{ scope.row.exam.examName }}</span>    
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户姓名" prop="name"/>
      <el-table-column align="center" label="微信名称" prop="wxName">
        <template slot-scope="scope">
            <span>{{ scope.row.appUser.name }}</span>    
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户性别" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 'M'">男</span>
          <span v-if="scope.row.sex === 'W'">女</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信头像" prop="wxName">
        <template slot-scope="scope">
            <img :src="scope.row.appUser.wxPhoto" width="60" height="60" /> 
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话" prop="phone"/>
      <el-table-column align="center" label="公司名称" prop="company" />

      <el-table-column align="center" label="部门" prop="department">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.department == ''">未填</el-tag>
          <span v-if="scope.row.department != ''">{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位" prop="job">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.job == ''">未填</el-tag>
          <span v-if="scope.row.job != ''">{{ scope.row.job }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否接收通知" prop="isReceive">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isReceive?'success':'danger'">{{ scope.row.isReceive ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
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
  queryExamUserList,
  deleteExamUser
} from "@/api/exam/user";
import {
  queryExamListSelect
} from "@/api/exam/exam";
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "examApproveList",
  components: { BackToTop, Pagination },
  data() {
    return {
      searchForm: {
        examId: "", //报名考试id
        // userId: "", //报名用户id
        name: "", //用户姓名
        company: "", //课程内容
        sex: "", //性别
        phone: "", //电话
        major: "", //专业
        isReceive: "", //是否接收通知
        approveStatus: "",
        isPublish: "", //是否在app中展示
        sort: "", //活动列表排序
        gmtCreated: "", //创建日期
        gmtModified: "", //修改日期
        page: 1,
        limit: 10
      },
      list: [],
      selectExamName: [],
      total: 0,
      listLoading: false,
      rules: {}
    };
  },
  created() {
    this.getList();
    this.getExamelect();
  },
  methods: {
      /**
     * 查询考试活动名称下拉列表
     */
    getExamelect() {
      queryExamListSelect().then(res => {
        this.selectExamName = res.data.data
      })
    },
    /**
     * 查询考试报名成功用户列表
     */
    getList() {
      const para = {
        examId: this.searchForm.examId,
        userId: this.searchForm.userId,
        name: this.searchForm.name,
        sex: this.searchForm.sex,
        phone: this.searchForm.phone,
        company: this.searchForm.company,
        department: this.searchForm.department,
        job: this.searchForm.job,
        isReceive: this.searchForm.isReceive,
        approveStatus: this.searchForm.approveStatus,
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
      queryExamUserList(para)
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
     * 删除用户记录
     */
    handleDelete(row) {
      this.$confirm("删除该条考试报名记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const para = {
            id: row.id
          };
          deleteExamUser(para).then(res => {
            this.$message.success(res.data.message);
            this.getList();
          });
        })
        .catch(() => {});
    },
    /**
     * 修改审核状态
     */
    changeStatus(id, approveStatus) {
      const para = {
        id: id,
        approveStatus: approveStatus
      };
      this.listLoading = true;
      editExamApprove(para).then(res => {
        this.listLoading = false;
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
</style>
