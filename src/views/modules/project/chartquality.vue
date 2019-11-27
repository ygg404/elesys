<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="质检时间:">
          <el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始时间" class="date_type" @change="getOutputQuality"></el-date-picker>至
          <el-date-picker v-model="dataForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束时间" class="date_type" @change="getOutputQuality"></el-date-picker>
        </el-form-item>
        <el-form-item label="作业组:" >
          <el-select v-model="dataForm.groupId" placeholder="请选择工作组" clearable  style="width: 150px;" @change="getOutputQuality">
            <el-option v-for="item in workGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-printer" type="primary" @click="printChart">打印</el-button>
        </el-form-item>
      </el-form>
      <div id="chartId">
        <div class="chart_title">
          <div>质量统计表</div>
          <div class="date_title">{{dateTitle}}</div>
        </div>
        <div class="table_class" v-loading="dataListLoading">
          <el-row class="table_row">
            <el-col :span="9"><div class="grid-header">项目名称</div></el-col>
            <el-col :span="3"><div class="grid-header">质量评分</div></el-col>
            <el-col :span="3"><div class="grid-header">质量等级</div></el-col>
            <el-col :span="3"><div class="grid-header">项目负责人</div></el-col>
            <el-col :span="3"><div class="grid-header">质检员</div></el-col>
            <el-col :span="3"><div class="grid-header">质检审核员</div></el-col>
          </el-row>
          <div v-for="(data, index) in dataList">
            <el-row v-if="data.groupShow" class="table_row">
              <el-col :span="9"><div class="group-header">{{data.groupName}}</div></el-col>
              <el-col :span="15"></el-col>
            </el-row>
            <el-row  v-if="data.groupName != null" class="item_row">
              <el-col :span="9"><div >{{data.projectName}}</div></el-col>
              <el-col :span="3"><div >{{data.qualityScore  === null? '&ensp; ': data.qualityScore}}</div></el-col>
              <el-col :span="3"><div >{{data.qualityLevel}}</div></el-col>
              <el-col :span="3"><div >{{data.projectCharge  === null? '&ensp; ': data.projectCharge}}</div></el-col>
              <el-col :span="3"><div >{{data.qualityUserName}}</div></el-col>
              <el-col :span="3"><div >{{data.qualityConfirmName}}</div></el-col>
            </el-row>
            <el-row  v-if="data.groupName != null && data.footerShow" class="table_row">
              <el-col :span="9"><div class="group-header">{{data.groupName}}:合计{{data.projectSum}}个项目</div></el-col>
              <el-col :span="15">
                <div class="group-header">优:{{data.excellentCount}}项；良:{{data.goodCount}}项；及格:{{data.passCount}}项；不及格:{{data.failCount}}项；优良:{{data.goodexceSum}}项；优良率:{{data.goodRate}}%；</div>
              </el-col>
            </el-row>
          </div>
          <el-row  class="table_row item_footer">
            <el-col :span="9"><div class="group-header">总共合计{{totalProjectSum}}个项目</div></el-col>
            <el-col :span="15">
              <div class="group-header">优:{{projectSum.excellentCount}}项；良:{{projectSum.goodCount}}项；及格:{{projectSum.passCount}}项；不及格:{{projectSum.failCount}}项；优良:{{projectSum.goodexceSum}}项；优良率:{{projectSum.goodRate}}%；</div>
            </el-col>
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
          groupId: '',
          startDate: '',
          endDate: ''
        },
        dateTitle: '', // 时间标题
        workGroupList: [],
        totalOutput: 0, // 合计总产值
        totalProjectSum: 0,  // 项目合计数
        dataList: [],
        projectSum: {},
        dataListLoading: false
      }
    },
    activated () {
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
      this.getWorkGroupDataListFromApi()
      this.getOutputQuality()
    },

    methods: {
      // 从后台获得工作组数据列表内容  填充至选项
      getWorkGroupDataListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/workgroup/selectworkgroup'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workGroupList = data.list
              resolve(data.list)
            } else {
              this.workGroupList = []
            }
          })
        })
      },
      // 表格初始化
      tableDataInit (datalist) {
        this.dataList = []
        let groupName = null
        // 总项目 的 优良及格项
        this.projectSum = {
          'excellentCount': 0,
          'goodCount': 0,
          'passCount': 0,
          'failCount': 0,
          'goodexceSum': 0,
          'goodRate': 0
        }
        this.totalProjectSum = 0
        datalist.forEach((item, index) => {
          item.groupShow = false
          item.footerShow = false
          this.totalProjectSum += 1
          if (item.qualityScore < 60) {
            item.qualityLevel = '不合格'
            this.projectSum.failCount += 1
          } else if (item.qualityScore >= 60 && item.qualityScore <= 70) {
            item.qualityLevel = '合格'
            this.projectSum.passCount += 1
          } else if (item.qualityScore > 70 && item.qualityScore < 90) {
            item.qualityLevel = '良'
            this.projectSum.goodCount += 1
          } else if (item.qualityScore >= 90) {
            item.qualityLevel = '优'
            this.projectSum.excellentCount += 1
          }
        })
        this.projectSum.goodexceSum = this.projectSum.excellentCount + this.projectSum.goodCount
        if (this.totalProjectSum === 0) {
          this.projectSum.goodRate = 0
        } else {
          this.projectSum.goodRate = (this.projectSum.goodexceSum * 100 / this.totalProjectSum).toFixed(2)
        }
        datalist.forEach((item, index) => {
          if (groupName !== item.groupName) {
            item.groupShow = true
            groupName = item.groupName
            let excellentCount = 0    // 优
            let goodCount = 0         // 良
            let passCount = 0         // 及格
            let failCount = 0         // 不及格
            let projectSum = 0   // 项目数
            for (let i = index; i < datalist.length; i++) {
              if (datalist[i].groupName === groupName) {
                if (datalist[i].qualityScore < 60) {
                  failCount += 1
                } else if (datalist[i].qualityScore >= 60 && datalist[i].qualityScore <= 70) {
                  passCount += 1
                } else if (datalist[i].qualityScore > 70 && datalist[i].qualityScore < 90) {
                  goodCount += 1
                } else if (datalist[i].qualityScore >= 90) {
                  excellentCount += 1
                }
                projectSum += 1
                datalist[i].failCount = failCount
                datalist[i].passCount = passCount
                datalist[i].goodCount = goodCount
                datalist[i].excellentCount = excellentCount
                datalist[i].projectSum = projectSum
                datalist[i].goodexceSum = excellentCount + goodCount
                datalist[i].goodRate = (datalist[i].goodexceSum * 100 / projectSum).toFixed(2)
                if (i >= datalist.length - 1) datalist[i].footerShow = true
              } else {
                datalist[i - 1].footerShow = true
                break
              }
            }
            // this.dataList.push(groupdat)
          }
        })
        this.dataList = datalist
        console.log(this.dataList)
      },
      // 获取数据列表
      getOutputQuality () {
        // 时间判断 （结束时间大于开始时间 ，则清空结束时间）
        if (new Date(this.dataForm.startDate) >= new Date(this.dataForm.endDate)) {
          this.dataForm.endDate = ''
        }
        this.dateTitle = (this.dataForm.startDate === null ? '' : this.dataForm.startDate) + '至' + (this.dataForm.endDate === '' ? '今' : this.dataForm.endDate)
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/chartquality/list'),
          method: 'get',
          params: this.$http.adornParams({
            'groupId': this.dataForm.groupId,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            // this.dataList = data.list
            this.tableDataInit(data.list)
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
  }
  .table_class .table_row{
    border-bottom: 1px solid #6f7180;
  }
  .table_class .item_row{
    border-bottom: 1px solid rgba(111, 113, 128, 0.56);
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
