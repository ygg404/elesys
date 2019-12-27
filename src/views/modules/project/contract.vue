<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('project:contract:save')" type="primary" @click="addOrUpdateHandle()">添加合同</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-date-picker v-model="dataForm.startDate" type="date"  placeholder="开始日期" style="width: 150px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
        <el-date-picker v-model="dataForm.endDate" type="date"  placeholder="结束日期" style="width: 150px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" @sort-change="changeSort" style="width: 100%;">
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-table  :data="props.row.projectList" style="width: 98%;margin-left: 2%;"  border>
            <el-table-column label="项目编号" prop="projectNo" width="120"></el-table-column>
            <el-table-column label="项目名称" prop="projectName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="项目启动时间" prop="projectStartDateTime" width="120" >
              <template slot-scope="scope">{{scope.row.projectStartDateTime != null? scope.row.projectStartDateTime.substring(0,10) : ''}}</template>
            </el-table-column>
            <el-table-column label="业务负责人" prop="projectBusiness" width="120"></el-table-column>
            <el-table-column label="生产负责人" prop="projectProduce" width="120"></el-table-column>
            <el-table-column label="项目类型" prop="projectType">
              <template slot-scope="scope"> <el-tag v-for="(item,index) in scope.row.projectType.split(',')" :key="index" style="margin-left: 5px;">{{item}}</el-tag></template>
            </el-table-column>
            <el-table-column  width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="addOrUpdateProjectHandle(id = scope.row.id)" v-if="isAuth('project:project:update')">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteProjectHandle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="contractNo" header-align="center" align="center" width="120" label="合同编号" sortable :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="contractName" header-align="center" align="left" label="合同名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="contractAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="contractType" header-align="center" align="center" width="100" label="合同类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.contractType === 0" size="small" type="success">合同委托</el-tag>
          <el-tag v-else-if="scope.row.contractType === 1" size="small" type="warning">一般合同</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractAddTime" header-align="center" align="center" width="120" label="签订时间">
        <template slot-scope="scope">{{scope.row.contractAddTime != null? scope.row.contractAddTime.substring(0,10) : ''}}</template>
      </el-table-column>
      <el-table-column header-align="center" align="left" width="320" label="操作" style="z-index: -1">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="addOrUpdateProjectHandle(id = '' ,scope.row)" v-if="isAuth('project:project:save')">添加项目</el-button>
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)" v-if="isAuth('project:contract:update')">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row)" v-if="isAuth('project:contract:delete')">删除</el-button>
          <el-button v-if="scope.row.filename" type="success" size="mini" @click="downloadFile(scope.row)">下载</el-button>
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
    <!-- 弹窗, 新增 / 修改  合同-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 新增 / 修改  项目-->
    <project-add-or-update v-if="projectAddOrUpdateVisible" ref="projectAddOrUpdate" @refreshDataList="getDataList" ></project-add-or-update>
  </div>
</template>

<script>
  import Vue from 'vue'
  import AddOrUpdate from './contract-add-or-update'
  import ProjectAddOrUpdate from './project-add-or-update'
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
        downContractUrl: window.SITE_CONFIG['baseUrl'] + '/project/contract/download?contractNo=',  // 合同下载路径接口,
        tokenHeaders: { token: Vue.cookie.get('token') },  // token请求
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
    components: {
      AddOrUpdate,
      ProjectAddOrUpdate
    },
    activated () {
      this.pageSize = 25
      this.pageIndex = 1
      this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.changeEnd()
      this.dataForm.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1 , 0)
      this.changeStart()
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
        let startDate = ''
        let endDate = ''
        if (this.dataForm.startDate != null) startDate = moment(new Date(this.dataForm.startDate)).format('YYYY-MM-DD')
        if (this.dataForm.endDate != null) endDate = moment(new Date(this.dataForm.endDate)).format('YYYY-MM-DD')
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/contract/list'),
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
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
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
      // 新增 / 修改 合同
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改 项目
      addOrUpdateProjectHandle (id, item) {
        this.projectAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.projectAddOrUpdate.init(id, item)
        })
      },
      // 删除
      deleteHandle (scop) {
        var ids = scop.id ? [scop.id] : this.dataListSelections.map(item => {
          return item.ids
        })
        this.$confirm('确定对合同编号[' + scop.contractNo + ']进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/project/contract/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
      // 下载合同文件
      downloadFile (item) {
        let downurl = this.downContractUrl + item.contractNo
        let xhr = new XMLHttpRequest()
        // GET请求,请求路径url,async(是否异步)
        xhr.open('GET', downurl, true)
        // 设置请求头参数的方式,如果没有可忽略此行代码
        xhr.setRequestHeader('token', Vue.cookie.get('token'))
        // 设置响应类型为 blob
        xhr.responseType = 'blob'
        // 关键部分
        xhr.onload = function (e) {
          // 如果请求执行成功
          if (this.status === 200) {
            let blob = this.response
            let filename = item.filename
            let a = document.createElement('a')
            // 创键临时url对象
            var url = URL.createObjectURL(blob)
            a.href = url
            a.download = filename
            a.click()
            // 释放之前创建的URL对象
            window.URL.revokeObjectURL(url)
          }
        }
        // 发送请求
        xhr.send()
      },
      // 删除项目将项目放入回收站
      deleteProjectHandle (item) {
        console.log(item)
        let tip = '此操作将项目编号为[' + item.projectNo + ']的项目放入回收站, 是否继续?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/project/project/delete'),
            method: 'post',
            data: this.$http.adornData(item.id, false)
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
