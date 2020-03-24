<template>
  <div class="mod-config">
    <el-card>
      <template slot="header">
        <div class="pay_item_title">全勤奖出勤天数设置</div>
      </template>
      <el-form :inline="true" >
        <el-form-item label="全勤年份：">
          <el-date-picker v-model="bonusForm.year"   type="year" style="width: 120px"
                          placeholder="请选择年份" class="pay_item" @change="getAttendBonus()"></el-date-picker>
        </el-form-item>
        <el-form-item label="全勤天数：">
          <el-input-number  :min="100" :max="366" step="1" v-model="bonusForm.bonusDay"></el-input-number>
        </el-form-item>
        <el-form-item style="margin-left: 100px;">
          <el-button type="primary" @click="saveBonusHandle">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <div class="pay_item_title">出勤天数设置</div>
      </template>
      <el-form :inline="true" >
        <el-form-item label="出勤年月：">
          <el-date-picker v-model="attendTime"   type="month"  placeholder="请选择出勤月份" class="pay_item"
                          value-format="yyyy-MM" @change="getAttendList(),getAttendDays()"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-edit" type="primary" @click="editAttendHandle">编辑</el-button>
          <el-button icon="el-icon-printer" type="success" @click="exportExcelHandle">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <div class="title_item">
        {{new Date(attendTime+ '-01').getFullYear()}}年{{new Date(attendTime+ '-01').getMonth()+1}}月  出勤情况
        <span class="title_item_span">(应出勤天数：
          <span :class="attendDays== '' || attendDays == null ? 'not_set': 'is_set'">
            {{attendDays == '' || attendDays == null? '未设置' :attendDays + '天' }}</span> )
        </span>
      </div>
      <el-table :data="attendList" border   style="width: 100%;" :span-method="objectSpanMethod">
        <el-table-column prop="branchName" header-align="center" align="center" label="部门" width="130"></el-table-column>
        <el-table-column prop="userName" header-align="center" align="center" label="用户名" width="120"></el-table-column>
        <el-table-column prop="inDay" header-align="center" align="center" label="内业天数" width="120"></el-table-column>
        <el-table-column prop="outDay" header-align="center" align="center" label="外业天数" width="120"></el-table-column>
        <el-table-column prop="overtime" header-align="center" align="center" label="加班天数" width="120"></el-table-column>
        <el-table-column prop="allDay" header-align="center" align="center" label="出勤天数" width="120"></el-table-column>
        <el-table-column prop="leave" header-align="center" align="center" label="请假天数" width="120"></el-table-column>
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

    <!-- 出勤情况弹窗,修改 -->
    <attend-add-or-update v-if="attendVisible" ref="attendAddOrUpdate" @refreshDataList="init"></attend-add-or-update>
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
  import moment from 'moment'
  import Vue from 'vue'
  import attendAddOrUpdate from './attend-add-or-update'
  // import AddOrUpdate from './rensalarybase-add-or-update'
  export default {
    data () {
      return {
        bonusForm: {
          year: '',
          bonusDay: ''
        },
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          payDate: '',
          filename: ''
        },
        attendTime: '',
        attendDays: '', // 应出勤天数
        attendVisible: false, // 出勤编辑可视图
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
    components: {
      attendAddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.isFirst || rowIndex === 0) {
            return {
              rowspan: row.sizeItem,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      // 页面初始化
      init () {
        let datenow = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        this.dataForm.payDate = new Date(datenow.getFullYear(), datenow.getMonth() - 1, 1)
        this.attendTime = moment(datenow).format('YYYY-MM')
        this.bonusForm.year = new Date(new Date().getFullYear() - 1, 1, 1)  // 全勤年份默认为上一年
        this.getAttendBonus()
        this.getDataList()
        this.getAttendList()
        this.getAttendDays()
      },
      // 获取全勤奖天数设置
      getAttendBonus () {
        this.$http({
          url: this.$http.adornUrl(`/ren/attendbonus/info/${this.bonusForm.year.getFullYear()}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.bonusForm.bonusDay = data.renAttendBonus.bonusDay
          }
        })
      },
      // 保存年度全勤天数设置
      saveBonusHandle () {
        this.$http({
          url: this.$http.adornUrl(`/ren/attendbonus/save`),
          method: 'post',
          data: this.$http.adornData({
            'year': this.bonusForm.year.getFullYear(),
            'bonusDay': this.bonusForm.bonusDay
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '设置全勤天数成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
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
              this.attendList = this.attendInit( data.list )
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
              this.attendDays = data.attendDays == null? null: data.attendDays.attendDays
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
        if (this.attendTime === '' || this.attendTime == null) {
          this.$message.error('出勤年月不能为空，请选择时间后再编辑！')
          return
        }
        this.attendVisible = true
        this.$nextTick(() => {
          this.$refs.attendAddOrUpdate.init(this.attendTime)
        })
      },
      // 出勤列表初始化
      attendInit (renAttendList) {
        let branchId = 0
        let size = 1
        let sizeList = []
        for (let i = 0; i < renAttendList.length ; i++) {
          if (branchId !== renAttendList[i].branchId) {
            if (size !== 1 ) {
              sizeList.push([branchId,size])
            }
            size = 1
            branchId = renAttendList[i].branchId
            if (i === renAttendList.length - 1){
              sizeList.push([branchId,size])
            }
            renAttendList[i].isFirst = true
          } else {
            size += 1
            renAttendList[i].isFirst = false
          }
        }
        for (let attend of renAttendList) {
          for (let sizeItem of sizeList) {
            if (sizeItem[0] === attend.branchId) {
              attend.sizeItem = sizeItem[1]
            }
          }
        }
        return renAttendList
      },
      // 导出出勤表Excel
      exportExcelHandle () {
        let attendTime = this.attendTime
        let downurl = window.SITE_CONFIG['baseUrl'] + '/ren/attend/exportAttendExcel?attendTime=' + attendTime
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
            console.log((e))
            let filename = attendTime.split('-')[0] + '年' + attendTime.split('-')[1] + '月出勤表.xls'
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
