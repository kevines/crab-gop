<!--分佣管理页面-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="list" :data="list">
        <div class="com-sty">
          发展合伙人分佣
          <span style="margin-left:100px;">单位：{{ list.partnerRate }}元</span>
        </div>
        <el-table
          v-loading="listLoading"
          :data="tableData"
          :show-header="false"
          element-loading-text="正在查询中。。。"
          border
          fit
          highlight-current-row
          style="width:20%;margin-left:50px;margin-top:10px;font-weight:bold;"
        >
          <el-table-column prop="name" align="center"/>

          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value"/>
            </template>
          </el-table-column>
        </el-table>
        <div class="com-sty">注：合伙人大礼包售价=总平台+乡镇合伙人+执行合伙人</div>
        <el-form-item>
          <template slot-scope="scope">
            <el-button class="btn-sty" type="primary" @click="handleSubmit(scope.row)">提交</el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { queryCommission, updateCommission } from '@/api/sys/commission'
export default {
  data() {
    return {
      tableData: [
        {
          name: '总平台',
          value: ''
        },
        {
          name: '乡镇合伙人',
          value: ''
        },
        {
          name: '执行合伙人',
          value: ''
        }
      ],
      goodsId: '',
      list: [],
      listLoading: false
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    /**
     * 获取分佣信息
     */
    getList() {
      this.listLoading = true
      queryCommission().then(res => {
        this.list = res.data.data
        this.goodsId = this.list.goodsId
        this.tableData.forEach(data => {
          if (data.name === '总平台') {
            data.value = this.list.platChange
          }
          if (data.name === '乡镇合伙人') {
            data.value = this.list.town
          }
          if (data.name === '执行合伙人') {
            data.value = this.list.thirdLevel
          }
          this.listLoading = false
        })
      })
    },
    /**
     * 初始化数据
     */
    initData() {
      this.getList()
    },
    /**
     * 配置分佣
     */
    handleSubmit(row) {
      var platChange
      var town
      var thirdLevel
      this.tableData.forEach(data => {
        if (data.name === '总平台') {
          platChange = data.value
        }
        if (data.name === '乡镇合伙人') {
          town = data.value
        }
        if (data.name === '执行合伙人') {
          thirdLevel = data.value
        }
      })
      const para = {
        goodsId: this.goodsId,
        thirdLevel: thirdLevel,
        platChange: platChange,
        town: town
      }
      updateCommission(para).then(res => {
        this.$message.success(res.data.message)
        this.getList()
      })
    }
  }
}
</script>

<style>
.com-sty {
  color: #606266;
  font-size: 13px;
  margin-top: 20px;
  margin-left: 50px;
}
.btn-sty {
  margin: 40px 0px 0px 50px;
}
</style>

