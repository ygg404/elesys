<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item style="margin-left: 20px;">
        <el-date-picker v-model="dataForm.startDate" type="date"  placeholder="开始日期" style="width: 150px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
        <el-date-picker v-model="dataForm.endDate" type="date"  placeholder="结束日期" style="width: 150px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable @change="pageIndex=1,getDataList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="pageIndex=1,getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="projectNo" header-align="center" align="center" width="120" label="项目编号" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>
      <!--<el-table-column prop="contractNo" header-align="center" align="center" width="120" label="合同编号" ></el-table-column>-->
      <el-table-column prop="projectName" header-align="center" align="left" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectCharge" header-align="center" align="center" label="项目负责人" :show-overflow-tooltip="true" width="100"></el-table-column>
      <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectStartDateTime" header-align="center" align="center" label="项目启动时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{scope.row.projectStartDateTime != null? scope.row.projectStartDateTime.substring(0,10) : ''}}</template>
      </el-table-column>
      <!--<el-table-column prop="projectStageName" header-align="center" align="center" label="项目阶段" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="left" width="190" label="操作" style="z-index: -1">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="restoreHandle(scope.row)">恢复项目</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.projectNo)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data () {
      return {
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          startDate: '',
          endDate: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {},
    activated () {
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
      // 开始时间改变
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/recycle/list'),
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 根据项目编号删除
      deleteHandle (projectNo) {
        console.log(projectNo)
        let tip = '此操作将永久删除编号为[' + projectNo + ']的项目信息, 是否继续?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/project/recycle/delete'),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 恢复项目
      restoreHandle (row) {
        let tip = '是否将恢复编号为[' + row.projectNo + ']的项目信息?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/project/recycle/update'),
            method: 'post',
            data: {
              'id': row.id,
              'projectNo': row.projectNo,
              'contractNo': row.contractNo
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
