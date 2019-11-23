<!--报表总览-->
<template>
  <div class="mod-config">
    <template>

      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

        <el-form-item style="margin-left: 20px;">
          <el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 150px;" @change="getDataList"></el-date-picker> 至
          <el-date-picker v-model="dataForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 150px;" @change="getDataList"></el-date-picker>
        </el-form-item>

        <el-select v-model="dataForm.ProjectTypeIdList" outlined  placeholder="类型选择" style="width: 30%;">
          <el-option
            v-for="item in ProjectTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-form-item style="margin-left: 20px;">
          <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>

    </template>
    <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="contractNo" header-align="center" align="center" label="合同编号"></el-table-column>
      <el-table-column prop="contractName" header-align="center" align="center" label="合同名称"></el-table-column>
      <el-table-column prop="contractAuthorize" header-align="center" align="center" label="委托单位"></el-table-column>
      <el-table-column prop="contractBusiness" header-align="center" align="center" label="业务负责人"></el-table-column>
      <el-table-column prop="contractCreateTime" header-align="center" align="center" label="启动时间"></el-table-column>
      <el-table-column prop="contractMoney" header-align="center" align="center" label="应收"></el-table-column>
      <el-table-column prop="projectActuallyReceipts" header-align="center" align="center" label="实收"></el-table-column>
      <el-table-column prop="projectNotReceipts" header-align="center" align="center" label="未收"></el-table-column>
      <el-table-column prop="projectExpenditure" header-align="center" align="center" label="支出"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.contractNo)">编辑</el-button>
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
    <!-- 编辑 -->
    <edit-account v-if="visible" ref="ShowAccount" @refreshDataList="getDataList"></edit-account>
  </div>
</template>

<script>

  import EditAccount from './edit-account'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        //编辑页面  edit-account对话框组件
        visible: false,

//类型选择 搜索作用
        ProjectTypeList:[]



      }
    },
    components: {
      EditAccount
    },
    activated () {
      this.getDataList()
      this.getProjectTypeListFromApi();
    },
    methods: {

//选择类型
      getProjectTypeListFromApi() {
        return new Promise((resolve,reject) =>{
          this.$http({
            url: this.$http.adornUrl('/set/projecttype/selectprojecttype'),
            method:'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              //项目类型数据 赋值
              this.ProjectTypeList = data.list;


              resolve(data.list)
            } else {
              //this.dataList = []
            }
          })
        })
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
        this.dataForm.sidx = val.prop
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/finance/account/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order
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

      //按钮点击事件
      addOrUpdateHandle (contractNo) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.ShowAccount.init(contractNo)
        })
      }

    }
  }
</script>
