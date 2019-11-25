<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="质检时间:">
          <el-date-picker v-model="dataForm.startDate" type="date"  placeholder="起始时间" class="date_type" @change="getOutputQuality"></el-date-picker>至
          <el-date-picker v-model="dataForm.endDate" type="date"  placeholder="结束时间" class="date_type" @change="getOutputQuality"></el-date-picker>
        </el-form-item>
        <el-form-item label="作业组:" >
          <el-select v-model="dataForm.groupId" placeholder="请选择工作组" clearable  style="width: 150px;" @change="getOutputQuality">
            <el-option v-for="item in workGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-printer" type="primary">打印</el-button>
        </el-form-item>
      </el-form>
      <div class="chart_title">
        <div>质量统计表</div>
        <div class="date_title">{{monthTitle}}</div>
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
        monthTitle: '', // 月份标题
        workGroupList: [],
        totalOutput: 0, // 合计总产值
        totalProjectSum: 0,  // 项目合计数
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
        datalist.forEach((item, index) => {
          item.groupShow = false
          item.footerShow = false
          this.totalProjectSum += 1
          if (item.qualityScore < 60) {
            item.qualityLevel = '不合格'
          } else if (item.qualityScore >= 60 && item.qualityScore <= 70) {
            item.qualityLevel = '合格'
          } else if (item.qualityScore > 70 && item.qualityScore < 90) {
            item.qualityLevel = '良'
          } else if (item.qualityScore >= 90) {
            item.qualityLevel = '优'
          }
        })
        // datalist.forEach((item, index) => {
        //   if (groupName !== item.groupName) {
        //     item.groupShow = true
        //     groupName = item.groupName
        //     let projectSum = 0
        //     let outputSum = 0
        //     for (let i = index; i < datalist.length; i++) {
        //       if (datalist[i].groupName === groupName) {
        //         projectSum += 1
        //         outputSum += datalist[i].projectActuallyOutput
        //         datalist[i].projectSum = projectSum
        //         datalist[i].outputSum = parseFloat(outputSum.toFixed(2))
        //         if (i >= datalist.length - 1) datalist[i].footerShow = true
        //       } else {
        //         datalist[i - 1].footerShow = true
        //         break
        //       }
        //     }
        //     // this.dataList.push(groupdat)
        //   }
        // })
        this.dataList = datalist
        console.log(this.datalist)
      },
      // 获取数据列表
      getOutputQuality () {
        // 时间判断 （结束时间大于开始时间 ，则清空结束时间）
        if (new Date(this.dataForm.startDate) >= new Date(this.dataForm.endDate)) {
          this.dataForm.endDate = null
        }
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
    }
  }
</script>

<style scoped>
  .date_type{
    max-width: 140px;
  }

</style>
