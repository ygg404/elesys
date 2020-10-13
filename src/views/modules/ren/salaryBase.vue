<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm">
        <el-form-item label="工资表时间：">
          <el-date-picker v-model="dataForm.payDate"   type="month"  @change="getDataList"
                          placeholder="请选择工资表月份" class="pay_item" ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="exportExcelHandle" icon="el-icon-printer">导出excel</el-button>
<!--          <el-button type="primary" @click="saveFormHandle" >保存工资记录</el-button>-->
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <h2>{{dataForm.payDate.getFullYear() + '年' + (dataForm.payDate.getMonth() + 1) + '月'}} 基本工资表</h2>
      </div>
      <el-table border :data="dataList" border v-loading="dataListLoading">
        <el-table-column prop="username" header-align="center" align="center" label="姓名" ></el-table-column>
        <el-table-column prop="edAllscore" header-align="center" align="center" label="学历评分" ></el-table-column>
        <el-table-column prop="titleAllscore" header-align="center" align="center" label="职称评分" ></el-table-column>
        <el-table-column prop="dutyScore" header-align="center" align="center" label="职务评分" ></el-table-column>
        <el-table-column prop="jobRank" header-align="center" align="center" label="职级" ></el-table-column>
        <el-table-column prop="workScore" header-align="center" align="center" label="工龄分" ></el-table-column>
        <el-table-column prop="fixedSalary" header-align="center" align="center" label="固定工资" >
          <template slot-scope="scope">
            <span style="color: #1989fa">{{scope.row.fixedSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="housingSalary" header-align="center" align="center" label="住房补贴" >
          <template slot-scope="scope">
            <span style="color: #1989fa">{{scope.row.housingSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="kbiFinalScore" header-align="center" align="center" label="效能分" ></el-table-column>
        <el-table-column prop="kbiSalary" header-align="center" align="center" label="效能工资" >
          <template slot-scope="scope">
            <span style="color: #1989fa">{{scope.row.kbiSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="总基本工资">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.fixedSalary + scope.row.housingSalary + scope.row.kbiSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column  header-align="center" align="center" width="110" label="操作" >
          <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-tickets" type="primary"
                         @click="salaryDetailHandle(scope.row)" >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <salary-base-detail ref="salaryBaseDetail" v-if="detailVisible" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import salaryBaseDetail from './salaryBase-detail'

  export default {
    data () {
      return {
        detailVisible: false,
        dataForm: {
          payDate: '',
          year: '',     // 年份
          updown: ''    // 上下半年(0-上半年，1-下半年 )
        },
        dataListLoading: false,
        dataList: []
      }
    },
    components: {
      salaryBaseDetail
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        let datenow = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        this.dataForm.payDate = new Date(datenow.getFullYear(), datenow.getMonth(), 1)
        this.getDataList()
      },
      getDataList () {
        // 由工资时间来获取 考核的年度
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/ren/salarybase/list`),
          method: 'get',
          params: this.$http.adornParams({
            salaryYear: this.dataForm.payDate.getFullYear(),
            salaryMonth: this.dataForm.payDate.getMonth() + 1
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      salaryDetailHandle (item) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.salaryBaseDetail.init(item)
        })
      },
      // 导出excel
      exportExcelHandle () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/ren/salarybase/exportExcel`),
          method: 'get',
          params: this.$http.adornParams({
            year: this.dataForm.year,
            updown: this.dataForm.updown,
            salaryYear: this.dataForm.payDate.getFullYear(),
            salaryMonth: this.dataForm.payDate.getMonth() + 1
          }),
          responseType: 'blob'
        }).then(({data}) => {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(data) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = '基本工资列表（' + this.dataForm.payDate.getFullYear() + '-' + (this.dataForm.payDate.getMonth() + 1) + '）.xls' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          this.dataListLoading = false
        })
      },
      // 保存工资记录
      saveFormHandle () {

      }
    }
  }
</script>

<style scoped>

</style>
