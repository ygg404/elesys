<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-date-picker v-model="dataForm.startDate" type="month" clearable placeholder="起始月份" class="month_type"></el-date-picker>至
          <el-date-picker v-model="dataForm.endDate" type="month" clearable placeholder="结束月份" class="month_type"></el-date-picker>
        </el-form-item>
        <el-form-item label="作业组:" >
          <el-select v-model="dataForm.workGroupID" placeholder="请选择工作组" clearable  style="width: 150px;">
            <el-option v-for="item in workGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data () {
      return {
        dataForm: {
          workGroupID: '',
          startDate: '',
          endDate: ''
        },
        workGroupList: [],
        dataList: [],
        dataListLoading: false
      }
    },
    activated () {
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM')
      this.getWorkGroupDataListFromApi()
      this.getOutputChart()
    },
    methods: {
      // 获取数据列表
      getOutputChart () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/chartoutput/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
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
    }
  }
</script>

<style scoped>
  .month_type{
    width: 150px;
  }
</style>
