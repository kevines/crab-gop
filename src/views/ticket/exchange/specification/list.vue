<!--  所有蟹券列表页 -->
<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="兑换券名称" prop="ticketName">
          <el-select v-model="searchForm.examId" placeholder="请选择">
            <el-option
              v-for="item in ticketSpecificationList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
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
      <el-table-column align="center" label="商品名称" prop="goodName" />
      <el-table-column align="center" label="商品规格" prop="specification" />
      <el-table-column align="center" label="商品图片" prop="goodPic">
        <template slot-scope="scope">
          <img :src="scope.row.goodPic" width="40" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品数量" prop="goodNum">
        <template slot-scope="scope">{{scope.row.goodNum}}对</template>
      </el-table-column>

      <el-table-column align="center" label="兑换截止日期" prop="expiryDate" />

      <el-table-column align="center" label="创建日期" prop="gmtCreated" />

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="exportExcel(scope.row)">导出Excel</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增蟹券对话框 -->
    <el-dialog :visible.sync="ticketDialogVisible" title="添加兑换券" width="700">
      <el-form
        ref="ticketInfo"
        :model="ticketInfo"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="兑换券名称：" prop="ticketName">
          <el-input v-model="ticketInfo.ticketName" placeholder="兑换券名称" />
        </el-form-item>
        <el-form-item label="套餐名称：" prop="goodName">
          <el-input v-model="ticketInfo.goodName" placeholder="套餐名称" />
        </el-form-item>
        <el-form-item label="商品规格：" prop="specification">
          <el-input v-model="ticketInfo.specification" placeholder="商品规格" />
        </el-form-item>
        <el-form-item label="商品数量：" prop="goodNum">
          <el-input v-model="ticketInfo.goodNum" placeholder="商品数量/对" maxlength="2"/>
        </el-form-item>
        <el-form-item label="兑换券张数：" prop="stock">
          <el-input v-model="ticketInfo.stock" placeholder="生成兑换券张数" maxlength="5"/>
        </el-form-item>
        <el-form-item label="截止日期：" prop="expiryDate">
          <template>
            <div class="block">
              <el-date-picker v-model="ticketInfo.expiryDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="商品图片：" prop="goodPic">
          <el-upload
            :headers="headers"
            :action="uploadMiniPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.imgUrl" :src="dataForm.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ticketDialogVisible = false">取 消</el-button>
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
import {
  createTicket,
  queryTicketSpecificationList,
  queryTicketNameSelectList,
  deleteTicketSpecification
} from "@/api/ticket/ticket";
import { uploadMiniPath } from "@/api/public";
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from "@/utils/auth";

export default {
  name: "examList",
  components: { BackToTop, Pagination },
  data() {
    /**
     * 选择不限定考试人数时对人数不做校验，否则需要做校验
     */
    let checkGoodNum = (rule, value, callback) => {
      if (Number(value) && value % 1 === 0 && value > 0) {
        callback();
      } else {
        return callback(new Error("请输入1～99之间的整数！"));
      }
    };
    /**
     * 生成的兑换券张数
     */
    let checkStockNum = (rule, value, callback) => {
      if (Number(value) && value % 1 === 0 && value > 0) {
        callback();
      } else {
        return callback(new Error("请输入1～99999之间的整数！"));
      }
    };
    return {
      searchForm: {
        ticketName: "", //兑换券名称
        specification: "", //规格名称
        ticketNo: "", //兑换券编号
        page: 1,
        limit: 10
      },
      list: [],
      uploadMiniPath,
      ticketDialogVisible: false,
      ticketInfo: {
        goodName: "", //商品名称
        ticketName: "", //兑换券名称
        specification: "", //商品规格详情
        stock: "", //生成兑换券张数
        expiryDate: "", //截止日期
        goodPic: "", //商品图片
        goodNum: "" //商品个数
      },
      dataForm: {
        name: "",
        imgUrl: ""
      },
      //兑换券名称下拉列表
      ticketSpecificationList: [],
      total: 0,
      listLoading: false,
      rules: {
        ticketName: [
          { required: true, message: "请输入兑换券名称", trigger: "blur" }
        ],
        goodName: [
          { required: true, message: "请输入套餐名称", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请输入商品规格名称", trigger: "blur" }
        ],
        goodNum: [{ validator: checkGoodNum, trigger: "blur" }],
        stock: [
          { validator: checkStockNum, trigger: "blur" }
        ],
        expiryDate: [
          { required: true, message: "请选择兑换截止日期", trigger: "blur" }
        ],
        goodPic: [
          { required: true, message: "请上传商品图片", trigger: "blur" }
        ]
      },
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
        page: this.searchForm.page,
        limit: this.searchForm.limit
      };
      this.listLoading = true;
      queryTicketSpecificationList(para)
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
     * 批量新增，弹出新增窗口
     */
    handleAdd() {
      this.ticketDialogVisible = true;
    },
    /**
     * 添加兑换券
     */
    addTicket() {
      this.$refs["ticketInfo"].validate(valid => {
        if (valid) {
          const para = {
            ticketName: this.ticketInfo.ticketName,
            specification: this.ticketInfo.specification,
            stock: this.ticketInfo.stock,
            expiryDate: this.ticketInfo.expiryDate
              ? this.$moment(new Date(this.ticketInfo.expiryDate)).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "",
            goodName: this.ticketInfo.goodName,
            goodPic: this.dataForm.imgUrl,
            goodNum: this.ticketInfo.goodNum
          };
          createTicket(para)
            .then(res => {
              this.$message.success(res.data.message);
              this.ticketDialogVisible = false;
              this.getList();
            })
            .catch(res => {
              this.$message.error(response.data.message);
              this.getList();
            });
        } else {
          return false;
        }
      });
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
      this.dataForm.imgUrl = res.data;
      this.ticketInfo.goodPic = res.data;
    },
    /**
     * 删除兑换券属性
     */
    handleDelete(row) {
      this.$confirm(
        "删除兑换券属性记录会将此记录下批量生成的兑换券都删除，属于极度危险操作, 请问是否继续?",
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
        deleteTicketSpecification(para)
          .then(res => {
            this.$message.success(res.data.message);
            this.getList();
          })
          .catch(response => {
            this.$message.error(response.data.message);
            this.getList();
          });
      });
    },
    /**
     * 导出Excel
     */
    exportExcel(row) {
      const url =
        process.env.BASE_API +
        "/exchange/ticket/specification/export/excel.do?id=" +
        row.id;
      window.location.href = url;
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
