<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" >
      <el-form-item label="项目启动时间:">
        <el-date-picker v-model="dataForm.startDate" size="small"  type="date"  placeholder="开始日期" style="width: 140px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
        <el-date-picker v-model="dataForm.endDate" size="small"  type="date"  placeholder="结束日期" style="width: 140px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="pageIndex=1,getDataList()" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="projectNo" header-align="center" align="center" label="项目编号" width="120"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label="联系人" width="120"></el-table-column>
      <el-table-column prop="userPhone" header-align="center" align="center" label="联系电话" width="150"></el-table-column>
      <el-table-column prop="projectStartDateTime" header-align="center" align="center" label="项目启动时间"
                       width="130" sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column  header-align="center" align="center" width="130" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)" icon="el-icon-edit">签名</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[25, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>

<script>
  import moment from 'moment'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        dataForm: {
          sidx: 'id',
          order: 'desc',
          projectType: '',
          startDate: '',
          endDate: ''
        },
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataList: []
      }
    },
    mounted () {
      this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.dataForm.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      this.getDataList()
    },
    methods: {
      getDataList () {
        let startDate = ''
        let endDate = ''
        if (this.dataForm.startDate != null) startDate = moment(new Date(this.dataForm.startDate)).format('YYYY-MM-DD')
        if (this.dataForm.endDate != null) endDate = moment(new Date(this.dataForm.endDate)).format('YYYY-MM-DD')
        this.dataListLoading = true
        // if (!stringIsNull(this.argsPageIndex)) {
        //   this.pageIndex = this.argsPageIndex
        // }
        // if (!stringIsNull(this.argsPageSize)) {
        //   this.pageSize = this.argsPageSize
        // }
        this.$http({
          url: this.$http.adornUrl('/dop/archives/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'startDate': startDate,
            'endDate': endDate
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 改变开始时间
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 改变结束时间
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 排序字段改变
      changeSort (val) {
        console.log(val)
        switch (val.order) {
          case 'ascending':
            this.dataForm.order = 'asc'
            break
          case 'descending':
            this.dataForm.order = 'desc'
            break
          default:
            this.dataForm.order = 'desc'
        }
        if (val.prop === 'projectNo') {
          this.dataForm.sidx = 'id'
        } else {
          this.dataForm.sidx = val.prop
        }
        this.getDataList()
      },
    }
  }
</script>

<style scoped>

</style>
