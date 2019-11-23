<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="结算时间:">
          <el-date-picker v-model="dataForm.startDate" type="month"  placeholder="起始月份" class="month_type" @change="startDateHandle"></el-date-picker>至
          <el-date-picker v-model="dataForm.endDate" type="month"  placeholder="结束月份" class="month_type" @change="endDateHandle"></el-date-picker>
        </el-form-item>
        <el-form-item label="作业组:" >
          <el-select v-model="dataForm.groupId" placeholder="请选择工作组" clearable  style="width: 150px;" @change="getOutputChart">
            <el-option v-for="item in workGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-printer" type="primary">打印</el-button>
        </el-form-item>
      </el-form>
      <div class="chart_title">
        <div>产值统计表</div>
        <div class="date_title">{{monthTitle}}</div>
      </div>
      <div class="table_class">
        <el-row class="table_row">
          <el-col :span="12"><div class="grid-header">项目名称</div></el-col>
          <el-col :span="4"><div class="grid-header">项目启动时间</div></el-col>
          <el-col :span="4"><div class="grid-header">作业完成时间</div></el-col>
          <el-col :span="4"><div class="grid-header">实际产值</div></el-col>
        </el-row>
        <div v-for="(data, index) in dataList">
          <el-row v-if="data.groupShow" class="table_row">
            <el-col :span="12"><div class="group-header">{{data.groupName}}</div></el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row  v-if="data.groupName != null" class="item_row">
            <el-col :span="12"><div>{{data.projectName}}</div></el-col>
            <el-col :span="4"><div >{{data.projectStartDateTime}}</div></el-col>
            <el-col :span="4"><div >{{data.wFinishDateTime === null? '#':data.wFinishDateTime}}</div></el-col>
            <el-col :span="4"><div >{{data.projectActuallyOutput}}</div></el-col>
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
          workGroupID: '',
          startDate: '',
          endDate: ''
        },
        monthTitle: '', // 月份标题
        workGroupList: [],
        dataList: [{
          groupName: '',
          projectList: []
        }],
        dataListLoading: false
      }
    },
    activated () {
      this.dataForm.startDate = this.dataForm.endDate = new Date()
      this.getWorkGroupDataListFromApi()
      this.getOutputChart()
    },
    methods: {
      // 获取数据列表
      getOutputChart () {
        // 月份标题
        if (this.dataForm.startDate === this.dataForm.endDate) {
          this.monthTitle = this.dataForm.startDate.getFullYear() + '年' + (this.dataForm.startDate.getMonth() + 1) + '月'
        } else {
          this.monthTitle = this.dataForm.startDate.getFullYear() + '年' + (this.dataForm.startDate.getMonth() + 1) + '月至'
            + this.dataForm.endDate.getFullYear() + '年' + (this.dataForm.endDate.getMonth() + 1) + '月'
        }
        let startDate = moment(new Date(this.dataForm.startDate.getFullYear(), this.dataForm.startDate.getMonth(), 1)).format('YYYY-MM-DD')
        let endDate = moment(new Date(this.dataForm.startDate.getFullYear(), this.dataForm.startDate.getMonth() + 1, 1)).format('YYYY-MM-DD')
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/chartoutput/list'),
          method: 'get',
          params: this.$http.adornParams({
            'groupId': this.dataForm.groupId,
            'startDate': startDate,
            'endDate': endDate
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
      // 表格初始化
      tableDataInit (datalist) {
        this.dataList = []
        let groupName = null
        datalist.forEach((item, index) => {
          item.groupShow = false
          if (groupName !== item.groupName) {
            item.groupShow = true
            groupName = item.groupName
            // for (let i = index; i < datalist.length; i++) {
            //   if (datalist[i].groupName === groupdat.groupName) {
            //     groupdat.projectList.push(datalist[i])
            //   } else {
            //     break
            //   }
            // }
            // this.dataList.push(groupdat)
          }
        })
        this.dataList = datalist
        console.log(this.dataList)
      },
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
      // 开始时间处理
      startDateHandle () {
        if (this.dataForm.startDate === null) {
          this.dataForm.startDate = new Date()
        }
        this.dataForm.endDate = this.dataForm.startDate
        this.getOutputChart()
      },
      // 结束时间处理
      endDateHandle () {
        if (this.dataForm.startDate === '') {
          this.dataForm.startDate = this.dataForm.endDate
        } else if (this.dataForm.endDate < this.dataForm.startDate) {
          this.dataForm.startDate = this.dataForm.endDate
        }
        this.getOutputChart()
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
    color: #051117;
  }
  .table_class .table_row .group-header{
    font-weight: 700;
    font-size: 15px;
  }
</style>
