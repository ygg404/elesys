<!--业务员统计表-->

<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="margin-left: 20px;">
          <el-date-picker v-model="dataForm.startDate" type="date"  placeholder="开始日期" style="width: 150px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
          <el-date-picker v-model="dataForm.endDate" type="date"  placeholder="结束日期" style="width: 150px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
        </el-form-item>
        <el-form-item label="业务负责人:" >
          <el-select v-model="dataForm.business" placeholder="全部" clearable  style="width: 150px;" @change=" getServiceChart">
            <el-option v-for="item in contractBusinessList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
          <el-button icon="el-icon-printer" type="primary" @click="printChart">打印</el-button>
        </el-form-item>
      </el-form>
      <div id="serviceId">
      <div class="chart_title">
        <div>业务员统计表</div>
        <div class="date_title">{{monthTitle}}</div>
      </div>
      <div class="table_class" v-loading="dataListLoading">
        <el-row class="table_row">

          <el-col :span="12"><div class="grid-header"><span><el-dropdown-item  @click.native="changeOrder()" class="el-icon-top">业务员</el-dropdown-item></span></div></el-col>

          <el-col :span="4"><div class="grid-header"><span class="ServiceChartTitlecentershow">应收</span></div></el-col>
          <el-col :span="4"><div class="grid-header"><span class="ServiceChartTitlecentershow">实收</span></div></el-col>
          <el-col :span="4"><div class="grid-header"><span class="ServiceChartTitlecentershow">未收</span></div></el-col>

        </el-row>
        <div v-for="(data, index) in dataList">
          <el-row v-if="data.BusinessShow" class="table_row">
            <el-col :span="12"><div class="group-header">负责人:{{data.contractBusiness}}</div></el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row  v-if="data.contractBusiness != null" class="item_row">
            <el-col :span="12"><div>{{data.contractName}}</div></el-col>
            <el-col :span="4"><div ><span class="ServiceChartcentershow">{{data.contractMoney}}</span></div></el-col>
            <el-col :span="4"><div ><span class="ServiceChartcentershow">{{data.projectActuallyReceipts}}</span></div></el-col>
            <el-col :span="4"><div ><span class="ServiceChartcentershow">{{data.projectNotReceipts}}</span></div></el-col>

          </el-row>
          <el-row  v-if="data.contractBusiness != null && data.footerShow" class="table_row">
            <el-col :span="12"><div class="group-header">合计{{data.projectSum}}个项目</div></el-col>
            <el-col :span="4"><div class="group-header"><span class="ServiceChartcentershow">{{data.projectShould}}</span></div></el-col>
            <el-col :span="4"><div class="group-header"><span class="ServiceChartcentershow">{{data.projectAct}}</span></div></el-col>
            <el-col :span="4"><div class="group-header"><span class="ServiceChartcentershow">{{data.projectNot}}</span></div></el-col>
          </el-row>
        </div>
        <el-row  class="table_row item_footer">
          <el-col :span="12"><div class="group-header">总共合计{{totalProjectSum}}个项目</div></el-col>
          <el-col :span="4"><div class="group-header">应收:{{totalProjectShould}}</div></el-col>
          <el-col :span="4"><div class="group-header">实收:{{totalProjectAct}}</div></el-col>
          <el-col :span="4"><div class="group-header">未收:{{totalProjectNot}}</div></el-col>
        </el-row>
      </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import index from '../../../icons'

  export default {
    data () {
      return {
        dataForm: {
          key:'',
          //业务负责人
          business: '',
          //类型选择
          projecttype: '',
          startDate: '',
          endDate: '',
          order:'asc',
          sidx: 'contract_business'
        },
        monthTitle: '', // 月份标题
        //业务负责人列表
        contractBusinessList: [],
        totalProjectSum: 0,  // 项目合计数
        totalProjectShould: 0, // 统计实收
        totalProjectAct: 0, //统计实收
        totalProjectNot:0, //统计未收
        dataListLoading: false,
        dataList:[]
      }
    },
    activated () {
       this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.changeEnd()
      //业务负责人选项
      this.getContractBusinessDataListFromApi()
      this.getServiceChart()
    },
    methods: {

      changeOrder(){
        if(this.dataForm.order == 'asc')
        {
          this.dataForm.order = 'desc'
        }
        else{
          this.dataForm.order = 'asc'
        }
        this.getServiceChart()
      },

      // 获取数据列表
      getServiceChart () {
        // 月份标题
        if (this.dataForm.startDate === this.dataForm.endDate ||this.dataForm.endDate == '') {
          //new Date(this.dataForm.startDate)
          this.monthTitle = new Date(this.dataForm.startDate).getFullYear() + '年' + (new Date(this.dataForm.startDate).getMonth() + 1) + '月至今'
        } else {
          this.monthTitle = new Date(this.dataForm.startDate).getFullYear() + '年' + (new Date(this.dataForm.startDate).getMonth() + 1) + '月至'
            + new Date(this.dataForm.endDate).getFullYear() + '年' + (new Date(this.dataForm.endDate).getMonth() + 1) + '月'
        }
        // 时间判断 （结束时间大于开始时间 ，则清空结束时间）
        if (new Date(this.dataForm.startDate) >= new Date(this.dataForm.endDate)) {
          this.dataForm.endDate = null
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/finance/account/getFinanceList'),
          method: 'get',
          params: this.$http.adornParams({
            'projecttype':'',
            'business': this.dataForm.business,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate,
            'order':this.dataForm.order,
            'sidx': this.dataForm.sidx
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableDataInit(data.list)
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

      // 表格初始化
      tableDataInit (datalist) {
        this.Should = 0, // 统计实收
          this.Act = 0, //统计实收
          this.Not = 0, //统计未收
          this.totalProjectSum = 0 //项目总和
        this.totalProjectShould = 0
        this.totalProjectAct = 0
        this.totalProjectNot = 0
        this.dataList = []
        let contractBusiness = null
        datalist.forEach((item, index) => {
          //选择业务负责人的时候
          item.BusinessShow = false
          item.footerShow = false
          this.totalProjectSum += 1
          let outputtemp = parseFloat((item.projectActuallyOutput == null ? 0 : item.projectActuallyOutput).toFixed(2))

        })

        //统计结算
        datalist.forEach((item, index) => {
          if (contractBusiness !== item.contractBusiness) {
            item.BusinessShow = true
            contractBusiness = item.contractBusiness
            let projectSum = 0
            let projectShould = 0
            let projectAct = 0
            let projectNot = 0

            for (let i = index; i < datalist.length; i++) {
              if (datalist[i].contractBusiness === contractBusiness) {
                projectSum += 1

                projectShould +=  datalist[i].contractMoney
                projectAct += datalist[i].projectActuallyReceipts
                projectNot +=datalist[i].projectNotReceipts

                //总的合计
                this.totalProjectShould += datalist[i].contractMoney
                this.totalProjectAct += datalist[i].projectActuallyReceipts
                this.totalProjectNot += datalist[i].projectNotReceipts
                //项目数量
                datalist[i].projectSum = projectSum
                //应收
                datalist[i].projectShould = parseFloat(projectShould.toFixed(2))
                //实收
                datalist[i].projectAct = parseFloat(projectAct.toFixed(2))
                //未收
                datalist[i].projectNot = parseFloat(projectNot.toFixed(2))
                if (i >= datalist.length - 1) datalist[i].footerShow = true
              } else {
                datalist[i - 1].footerShow = true
                break
              }
            }
            this.totalProjectAct = parseFloat(this.totalProjectAct).toFixed(2)
            this.totalProjectNot = parseFloat(this.totalProjectNot).toFixed(2)
          }
        })

        this.dataList = datalist
        console.log(this.datalist)
      },

      // 从后台获得业务负责人数据列表内容  填充至选项
      getContractBusinessDataListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/finance/account/getContractBusinessList'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.contractBusinessList = data.list
              resolve(data.list)
            } else {
              this.contractBusinessList = []
            }
          })
        })
      },

 // 打印报表
      printChart () {
        const print = document.getElementById('serviceId').innerHTML
        // 把当前页面替换成要打印的内容
        document.body.innerHTML = print
        // 打印
        window.print()
        // 刷新页面
        window.location.reload()
      },
        // 开始时间改变
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this. getServiceChart()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this. getServiceChart()
      }



    }


  }
</script>

<style scoped>
  .month_type{
    width: 150px;
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
    font-weight: 700;
    font-size: 16px;
    color: rgba(15, 17, 23, 0.78);
  }
  .table_class .table_row .group-header{
    font-weight: 700;
    font-size: 15px;
  }

  .ServiceChartcentershow{
    float:left;
    margin-left:16px;
  }
  .ServiceChartTitlecentershow{

    margin-left:12px;
    text-align: center;
  }
  .table_class .item_footer{
    color: #00b7ee;
  }
</style>



