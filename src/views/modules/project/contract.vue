<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('project:contract:save')" type="primary" @click="addOrUpdateHandle()">添加合同</el-button>
      </el-form-item>
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
                <el-button type="primary" size="mini" >修改</el-button>
                <el-button type="danger" size="mini" @click="deleteProject(scope.row)">删除</el-button>
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
          <el-tag v-if="scope.row.contractType === 0" size="small" type="danger">合同委托</el-tag>
          <el-tag v-else-if="scope.row.contractType === 1" size="small" type="success">一般合同</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractAddTime" header-align="center" align="center" width="120" label="签订时间">
        <template slot-scope="scope">{{scope.row.contractAddTime != null? scope.row.contractAddTime.substring(0,10) : ''}}</template>
      </el-table-column>
      <el-table-column header-align="center" align="left" width="300" label="操作" style="z-index: -1">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="addProject(scope.row)">添加项目</el-button>
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.fileName" type="success" size="mini" @click="downloadFile(scope.row)">下载</el-button>
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
  import AddOrUpdate from './contract-add-or-update'
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
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.dataForm.startDate =  moment(new Date(new Date().getFullYear(), new Date().getMonth() -1 , 1)).format('YYYY-MM-DD');
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
          url: this.$http.adornUrl('/project/contract/list'),
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
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
      }
    }
  }
</script>
