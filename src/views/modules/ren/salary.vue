<template>
  <div class="mod-config">
    <el-card>
      <template slot="header">
        <div class="pay_item_title">出勤天数设置</div>
      </template>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="出勤年月：">
          <el-date-picker v-model="attendTime"   type="month"  placeholder="请选择出勤月份" class="pay_item"
                          value-format="yyyy-MM" @change="getAttendList()"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-edit" type="primary" @click="editAttendHandle">编辑</el-button>
        </el-form-item>
      </el-form>
      <div class="title_item">
        {{new Date(attendTime+ '-01').getFullYear()}}年{{new Date(attendTime+ '-01').getMonth()+1}}月  出勤情况
        <span class="title_item_span">(应出勤天数：
          <span :class="attendDays== '' || attendDays == null ? 'not_set': 'is_set'">
            {{attendDays == '' || attendDays == null? '未设置' :attendDays + '天' }}</span> )
        </span>
      </div>
      <el-table :data="attendList" border   style="width: 100%;">
        <el-table-column prop="branchName" header-align="center" align="center" label="部门"></el-table-column>
        <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
        <el-table-column prop="outDay" header-align="center" align="center" label="外业天数"></el-table-column>
        <el-table-column prop="inDay" header-align="center" align="center" label="内业天数"></el-table-column>
        <el-table-column prop="overtime" header-align="center" align="center" label="加班天数"></el-table-column>
        <el-table-column prop="leave" header-align="center" align="center" label="请假天数"></el-table-column>
        <el-table-column prop="allDay" header-align="center" align="center" label="合计天数"></el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      </el-table>
    </el-card>
    <el-card>
      <template slot="header">
        <div class="pay_item_title">工资导入</div>
      </template>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="工资表时间：">
          <el-date-picker v-model="dataForm.payDate"   type="month"  placeholder="请选择工资表月份" class="pay_item"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-upload :action="upExcelUrl"
                     :data="{'payDate': dataForm.payDate}"
                     :limit="1"
                     name="file"
                     ref="upload"
                     accept=".xls,.xlxs"
                     :headers="tokenHeaders"
                     :on-preview="handleBeforeUpload"
                     :on-success="handleSuccess"
                     :on-error="handleError">
            <el-button type="success" >导入Excel</el-button>
            <div slot="tip" style="color: dodgerblue" v-if="dataForm.filename != null && dataForm.filename != ''">已上传文件:{{dataForm.filename}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading"   style="width: 100%;">
        <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
        <el-table-column prop="baseSalary" header-align="center" align="center" label="基本工资"></el-table-column>
        <el-table-column prop="workSalary" header-align="center" align="center" label="职务工资"></el-table-column>
        <el-table-column prop="titleSalary" header-align="center" align="center" label="职称工资"></el-table-column>
        <el-table-column prop="housingSalary" header-align="center" align="center" label="住房补贴"></el-table-column>
        <el-table-column prop="pcSalary" header-align="center" align="center" label="电脑补贴"></el-table-column>
        <el-table-column prop="mealSalary" header-align="center" align="center" label="餐补贴"></el-table-column>
        <el-table-column prop="socialSalary" header-align="center" align="center" label="社保"></el-table-column>
        <el-table-column prop="cutPay" header-align="center" align="center" label="扣款"></el-table-column>
        <el-table-column prop="actualPay" header-align="center" align="center" label="实发金额"></el-table-column>
        <el-table-column prop="payDate" header-align="center" align="center" label="发放时间"></el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗, 新增 / 修改 -->
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
  import moment from 'moment'
  import Vue from 'vue'
  // import AddOrUpdate from './rensalarybase-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          payDate: '',
          filename: ''
        },
        attendTime: '',
        attendDays: '', // 应出勤天数
        attendList: [],
        upExcelUrl: window.SITE_CONFIG['baseUrl'] + '/ren/salarybase/upBaseExcel/',  // 基本工资上传地址
        tokenHeaders: { token: Vue.cookie.get('token') },  // token请求
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    // components: {
    //   AddOrUpdate
    // },
    activated () {
      let datenow = new Date()
      this.dataForm.payDate = new Date(datenow.getFullYear(), datenow.getMonth() - 1, 1)
      this.attendTime = moment(datenow).format('YYYY-MM')
      this.getDataList()
      this.getAttendList().then(attendlist => {
        this.attendList = attendlist
      })
      this.getAttendDays()
    },
    methods: {
      // 获取出勤情况表
      getAttendList () {
        if (this.attendTime === '' || this.attendTime === null) {
          return
        }
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/attend/attendVoList`),
            method: 'get',
            params: this.$http.adornParams({
              'attendTime': this.attendTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取应出勤天数
      getAttendDays () {
        if (this.attendTime === '' || this.attendTime === null) {
          return
        }
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/attenddays/info/${this.attendTime}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.attendDays)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 编辑出勤情况
      editAttendHandle () {

      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ren/salarybase/list'),
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
            url: this.$http.adornUrl('/ren/salarybase/delete'),
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
      // 上传文件之前的钩子
      handleBeforeUpload (file) {
          if (file.name.indexOf('.xls') < 0 && file.name.indexOf('.xlsx') <0) {
            this.$message.error('该文件不是 Excel 文件!')
            return
          }
      },
      // 文件上传成功时的钩子
      handleSuccess (res, file, fileList) {
        console.log(res.fileName)
        this.dataForm.filename = res.fileName
        this.$message({
          message: '文件上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$refs.upload.clearFiles()
          }
        })
      },
      // 文件上传失败时的钩子
      handleError (err, file, fileList) {
        this.$message.error('文件上传失败')
      }
    }
  }
</script>

<style scoped>

  .pay_item_title{
    width: 99%;
    padding: 5px;
    font-size: 14pt;
    font-weight: 700;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }

  .pay_item {
    width: 180px;
    border: 1px solid cornflowerblue;
    color: #00a0e9;
    cursor: pointer;
  }

  .title_item{
    font-size: 14pt;
    font-weight: 700;
    text-align: center;
  }

  .title_item_span{
    font-size: 13pt;
    font-weight: 700;
  }

  .title_item_span .not_set{
    color: red;
  }
  .title_item_span .is_set{
    color: green;
  }
</style>
