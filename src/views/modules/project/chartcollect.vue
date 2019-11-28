<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="项目启动时间:">
          <el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始时间" class="date_type" @change="getChartCollectDat"></el-date-picker>至
          <el-date-picker v-model="dataForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束时间" class="date_type" @change="getChartCollectDat"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-printer" type="primary" @click="printChart">打印</el-button>
        </el-form-item>
      </el-form>
      <div id="chartId" style="width: 100%">
        <div class="chart_title">
          <div>各部门汇总产值统计表</div>
          <div class="date_title">{{dateTitle}}</div>
        </div>
        <div class="table_class" v-loading="dataListLoading">
          <el-row class="table_row">
            <el-col :span="8"><div class="grid-header">工作组</div></el-col>
            <el-col :span="8"><div class="grid-header">项目个数</div></el-col>
            <el-col :span="8"><div class="grid-header">产值</div></el-col>
          </el-row>
          <div v-for="(data, index) in dataList">
            <el-row  class="table_row item_row">
              <el-col :span="8"><div>{{data.groupName}}</div></el-col>
              <el-col :span="8"><div>{{data.projectNum}}</div></el-col>
              <el-col :span="8"><div>{{data.output}}</div></el-col>
            </el-row>
          </div>
          <el-row  class="table_row item_footer">
            <el-col :span="8"><div class="group-header">合计</div></el-col>
            <el-col :span="8"><div class="group-header">{{totalProjectNum}}</div></el-col>
            <el-col :span="8"><div class="group-header">{{totalOutPut}}</div></el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data () {
      return {
        dataForm: {
          startDate: '',
          endDate: ''
        },
        totalProjectNum: 0, // 合计项目数
        totalOutPut: 0,     // 合计产值
        dateTitle: '', // 时间标题
        dataList: [],
        dataListLoading: false
      }
    },
    activated () {
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
      this.getChartCollectDat()
    },
    methods: {
      // 获取数据列表
      getChartCollectDat () {
        // 时间判断 （结束时间大于开始时间 ，则清空结束时间）
        if (new Date(this.dataForm.startDate) >= new Date(this.dataForm.endDate)) {
          this.dataForm.endDate = ''
        }
        this.dateTitle = (this.dataForm.startDate === null ? '' : this.dataForm.startDate) + '至' + (this.dataForm.endDate === '' ? '今' : this.dataForm.endDate)
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/chartcollect/list'),
          method: 'get',
          params: this.$http.adornParams({
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.totalProjectNum = 0
            this.totalOutPut = 0
            this.dataList = data.list
            data.list.forEach((item, index) => {
              this.totalProjectNum += item.projectNum
              this.totalOutPut += item.output
            })
            this.totalOutPut = this.totalOutPut.toFixed(2)
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 打印报表
      printChart () {
        const print = document.getElementById('chartId').innerHTML
        // 把当前页面替换成要打印的内容
        document.body.innerHTML = print
        // 打印
        window.print()
        // 刷新页面
        window.location.reload()
      }
    }
  }
</script>

<style scoped>
  .date_type{
    max-width: 140px;
  }
  .chart_title{
    width: 100%;
    text-align: center;
    margin-top: 20px;
    font-size: 27px;
    font-weight: 700;
  }
  .chart_title .date_title{
    margin-top: 4px;
    font-size: 18px;
    font-weight: 500;
  }
  .table_class{
    margin-top: 10px;
    line-height: 150%;
  }
  .table_class .table_row{
    border-bottom: 1px solid #6f7180;
  }
  .table_class .item_row{
    border-bottom: 1px solid #6f7180;

  }
  .table_class .item_row:hover{
    cursor: pointer;
    background-color: rgba(0, 183, 238, 0.59);
  }
  .table_class .table_row .grid-header{
    font-weight: 900;
    font-size: 16px;
    line-height: 150%;
    color: rgba(15, 17, 23, 0.61);
  }
  .table_class .table_row .group-header{
    font-weight: 700;
    font-size: 15px;
  }
  .table_class .item_footer{
    color: #00b7ee;
  }
</style>
