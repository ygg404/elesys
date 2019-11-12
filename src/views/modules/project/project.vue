<template>
  <el-card class="box-card">
    <div slot="header" class="clearfixz" >
      <span style="color: #2D64B3">角色选择：  </span>
      <el-radio-group v-model="radio" style="margin-left: 20px;">
        <el-radio :label="1" disabled="isAuth('project:project:manage')" >项目安排员</el-radio>
        <el-radio :label="2">项目作业员</el-radio>
        <el-radio :label="3">质检人员</el-radio>
        <el-radio :label="4">产值核算</el-radio>
      </el-radio-group>
    </div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item style="margin-left: 20px;">
        <el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 150px;" @change="getDataList"></el-date-picker> 至
        <el-date-picker v-model="dataForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 150px;" @change="getDataList"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading"  @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="projectNo" header-align="center" align="center" width="120" label="项目编号" sortable :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="projectName" header-align="center" align="left" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectCharge" header-align="center" align="center" label="项目负责人" width="120"></el-table-column>
      <el-table-column prop="scheduleRate" header-align="center" align="center" width="120" label="项目进度" >
        <template slot-scope="scope"  >
          <el-progress class="proclass" @click="getScheduleList(scope.row)" :text-inside="true" :stroke-width="18" :percentage="scope.row.scheduleRate != null? scope.row.scheduleRate : 0">
          </el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="projectStartDateTime" header-align="center" align="center" width="120" label="项目启动时间">

      </el-table-column>
      <el-table-column header-align="center" align="left" width="320" label="操作" style="z-index: -1">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="addOrUpdateProjectHandle(id = '' ,scope.row)" v-if="isAuth('project:project:save')">添加项目</el-button>
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)" v-if="isAuth('project:contract:update')">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row)" v-if="isAuth('project:contract:delete')">删除</el-button>
          <el-button v-if="scope.row.filename" style="background-color: #5daf34;color: white;" size="mini" @click="downloadFile(scope.row)">下载</el-button>
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
  </el-card>
</template>

<script>
  import moment from 'moment'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          startDate: '',
          endDate: ''
        },
        radio: 1,
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        projectAddOrUpdateVisible: false
      }
    },
    activated () {
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
      this.getDataList()
    },
    methods: {
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
        this.dataForm.sidx = val.prop
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/manage/page'),
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
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
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
      // 获取进度列表
      getScheduleList (item) {
        let projectNo = item.projectNo
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/schedule/list'),
          method: 'get',
          params: this.$http.adornParams({
            'projectNo': projectNo
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      }
    }

  }
</script>

<style scoped>
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .proclass{
    cursor:pointer;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
</style>
