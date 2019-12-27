<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getFinance()">
        <el-form-item style="margin-left: 20px;">
          <el-date-picker v-model="dataForm.startDate" type="date"  placeholder="开始日期" style="width: 150px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
          <el-date-picker v-model="dataForm.endDate" type="date"  placeholder="结束日期" style="width: 150px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.projectType" placeholder="类型选择" clearable style="width: 150px;"
                     @change="getFinance">
            <el-option v-for="item in workGroupList" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-input v-model="dataForm.contractname" placeholder="合同关键字搜索" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getFinance()">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="chart_title">
        <div>财务操作</div>
        <div class="date_title">{{dateTitle}}</div>
      </div>
      <div class="table_class">

        <el-table :data="dataList" border  v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
          <el-table-column prop="contractNo" header-align="center" align="center" label="合同编号" sortable width="110"
                           :sort-orders="['descending','ascending']"></el-table-column>
          <el-table-column prop="contractName" header-align="center" align="center" label="合同名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contractAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contractBusiness" header-align="center" align="center" label="业务负责人" width="120"></el-table-column>
          <el-table-column label="签订时间" prop="contractAddTime" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column prop="contractMoney" header-align="center" align="center" label="应收" width="90"></el-table-column>
          <el-table-column prop="projectActuallyReceipts" header-align="center" align="center" label="实收" width="90"></el-table-column>
          <el-table-column prop="projectNotReceipts" header-align="center" align="center" label="未收" width="90"></el-table-column>
          <el-table-column prop="projectExpenditure" header-align="center" align="center" label="支出" width="90"></el-table-column>
          <el-table-column  header-align="center" align="center" width="100" label="操作">
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
        <edit-account v-if="visible" ref="ShowAccount" @refreshDataList="getFinance"></edit-account>

      </div>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import index from '../../../icons'
  import EditAccount from './edit-account'

  export default {
    data () {
      return {
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        dataForm: {
          //关键字搜索 这里定为合同名称
          key: '',
          //业务负责人
          business: '',
          //类型选择
          projectType: '',
          startDate: '',
          endDate: '',
          order: 'desc',
          sidx: 'id'
        },
        monthTitle: '', // 月份标题
        //业务负责人列表
        workGroupList: [],
        dataList: [],
        totalProjectSum: 0,  // 项目合计数
        totalProjectShould: 0, // 统计实收
        totalProjectAct: 0, //统计实收
        totalProjectNot: 0, //统计未收
        dataListLoading: false,
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        visible: false
      }
    },

    components: {
      EditAccount
    },

    activated () {
      this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.changeEnd()
      this.dataForm.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      this.changeStart()
      // 类型选择选项
      this.getworkGroupListFromApi()
      this.getFinance()
    },
    methods: {
      // 获取数据列表
      getFinance () {
        this.dateTitle = (this.dataForm.startDate === null ? '' : moment(this.dataForm.startDate).format('YYYY-MM-DD')) + '至' + (this.dataForm.endDate === '' ? '今' : moment(this.dataForm.endDate).format('YYYY-MM-DD'))
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/finance/account/getFinanceOperationPage'),
          method: 'get',
          params: this.$http.adornParams({
            'projectType': this.dataForm.projectType,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.contractname,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'business': this.dataForm.business,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

      // 编辑财务操作
      addOrUpdateHandle (contractNo) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.ShowAccount.init(contractNo)
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
        // this.dataForm.sidx = val.prop
        this.getFinance()
      },

      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getFinance()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getFinance()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

      // 从后台获得类型选择数据列表内容  填充至选项
      getworkGroupListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/projecttype/getProjectTypelist'),
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
      // 开始时间改变
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getFinance()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getFinance()
      }
    }
  }
</script>

<style scoped>
  .month_type {
    width: 150px;
  }

  .chart_title {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    font-size: 27px;
    font-weight: 700;
  }

  .chart_title .date_title {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 500;
  }

  .table_class {
    margin-top: 10px;
  }

  .table_class .table_row {
    border-bottom: 1px solid #6f7180;
  }

  .table_class .item_row {
    border-bottom: 1px solid #6f7180;
  }

  .table_class .table_row .grid-header {
    font-weight: 700;
    font-size: 16px;
    color: rgba(15, 17, 23, 0.78);
  }

  .table_class .table_row .group-header {
    font-weight: 700;
    font-size: 15px;
  }

</style>



