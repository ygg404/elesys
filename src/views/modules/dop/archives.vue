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
      <el-table-column prop="sigImage" header-align="center" align="center"  label="签署情况" width="110">
        <template slot-scope="scope">
          <el-tag v-if="stringIsNull(scope.row.sigImage)" size="small" type="info">未签字</el-tag>
          <el-popover v-else placement="right" width="340" trigger="hover" >
            <div style="background-color:#f0f0f0;">
              <div>项目编号: {{scope.row.projectNo}}</div>
              <div>项目名称: {{scope.row.projectName}}</div>
              <div>签字微信头像: <img class="sig_img" :src="scope.row.avatarUrl"/></div>
              <div>签字微信昵称: {{scope.row.nickName}}</div>
              <div>签字时间: {{scope.row.createTime}}</div>
              <div style="color: #00a0e9;border:1px solid #5daf34;">
                <img class="sig_canvas" :src="scope.row.sigImage">
              </div>
            </div>
            <span slot="reference" style="cursor: pointer"><el-tag size="small" type="primary">已签字</el-tag></span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column  header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getWxQRImg(scope.row)" icon="el-icon-edit">签名</el-button>
          <el-button type="success" size="mini" @click="exportExcelHandle(scope.row)" icon="el-icon-printer">导出</el-button>
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

    <archives-sig v-if="sigVisible" ref="archivesSig"></archives-sig>
  </div>
</template>

<script>
  import moment from 'moment'
  import archivesSig from './archives-sig'
  import {stringIsNull} from '@/utils'

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
        sigVisible: false,
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataList: []
      }
    },
    components: {
      archivesSig
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

      // 导出签名表
      exportExcelHandle (item) {
        this.$http({
          url: this.$http.adornUrl('/dop/archives/exportAuthExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'projectNo': item.projectNo
          }),
          withCredentials: false, // 允许携带cookie
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          responseType: 'blob'
        }).then(({data}) => {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(data) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = item.projectName + '.xlsx' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          this.dataListLoading = false
        })
      },
      // 仪器出借
      getWxQRImg (item) {
        this.sigVisible = true
        this.$nextTick(() => {
          this.$refs.archivesSig.init(item)
        })
      },
    }
  }
</script>

<style scoped>
  .sig_canvas {
    width: 99%;
    padding: 3px;
  }
  .sig_img {
    width: 35px;
    height: 35px;
    margin: 5px;
    border-radius: 50%;
  }
</style>
