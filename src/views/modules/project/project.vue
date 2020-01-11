<template>
  <div class="mod-config">
    <el-card class="box-card">
      <div slot="header" class="clearfixz">
        <span style="color: #2D64B3">角色选择：  </span>
        <el-radio-group v-model="roleradio" style="margin-left: 10px;">
          <el-radio :label="1" :disabled="!isAuth('project:project:plan')">项目安排员</el-radio>
          <el-radio :label="2" :disabled="!isAuth('project:work:list')">项目作业员</el-radio>
          <el-radio :label="3" :disabled="!isAuth('project:quality:list')">质检人员</el-radio>
          <el-radio :label="4" :disabled="!isAuth('project:checkoutput:list')">产值核算员</el-radio>
          <el-radio :label="5" :disabled="!isAuth('project:authorize:list')">项目审定员</el-radio>
        </el-radio-group>
      </div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="width: 100%;">
        <el-select v-model="dataForm.dateItemId" placeholder="时间类型" style="width: 135px;" @change="getDataList"
                   class="select_btn">
          <el-option v-for="item in dateItemList" :label="item.dateItem" :key="item.id" :value="item.id"></el-option>
        </el-select>
        <el-form-item style="margin-left: -2px;">
          <el-date-picker v-model="dataForm.startDate"   type="date"  placeholder="开始日期" style="width: 150px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
          <el-date-picker v-model="dataForm.endDate"  type="date"  placeholder="结束日期" style="width: 150px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable style="width: 150px;"  @change="getDataList"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: -10px;">
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="outputChartHandle" type="primary" icon="el-icon-s-data" v-if="isAuth('project:chartoutput')">产值表</el-button>
          <el-button @click="collectChartHandle" type="primary" icon="el-icon-s-data" v-if="isAuth('project:chartcollect')">产值汇总表</el-button>
          <el-button @click="qualityChartHandle" type="primary" icon="el-icon-s-data" v-if="isAuth('project:chartquality')">质量表</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
        <el-table-column prop="projectNo" header-align="center" align="center" width="120" label="项目编号" sortable="custom" :sort-orders="['descending','ascending']">
          <template slot-scope="scope">
            <el-popover placement="right" width="240" trigger="hover" >
              <div style="background-color:#f0f0f0;color: #00a0e9;border:1px solid #5daf34">
                <div >项目编号：{{scope.row.projectNo}}</div>
                <div >项目启动时间：{{scope.row.projectStartDateTime  == null?'-':scope.row.projectStartDateTime}}</div>
                <div >项目开工时间：{{scope.row.projectBegunDateTime  == null?'-':scope.row.projectBegunDateTime}}</div>
                <div >作业完成时间：{{scope.row.wFinishDateTime == null?'-':scope.row.wFinishDateTime}}</div>
                <div >质检完成时间：{{scope.row.qFinishDateTime == null?'-':scope.row.qFinishDateTime}}</div>
                <div >结算时间：{{scope.row.cutOffTime == null?'-':scope.row.cutOffTime.substring(0,7)}}</div>
                <div >作业工期：{{scope.row.projectWorkDate == null?'-':scope.row.projectWorkDate}}</div>
                <div >质检工期：{{scope.row.projectQualityDate == null?'-':scope.row.projectQualityDate}}</div>
                <div :style="scope.row.backDateNum>0?'color:red':''">返修天数：{{scope.row.backDateNum == null?'-':scope.row.backDateNum}}</div>
                <div :style="scope.row.woverTime>0?'color:red':''">作业超时天数：{{scope.row.woverTime == null?'-':scope.row.woverTime}}</div>
                <div :style="scope.row.qoverTime>0?'color:red':''">质检超时天数：{{scope.row.qoverTime == null?'-':scope.row.qoverTime}}</div>
              </div>
              <span slot="reference" style="cursor: pointer">{{scope.row.projectNo}}</span>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column prop="projectName" header-align="center" align="left" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="projectCharge" header-align="center" align="center" label="项目负责人" width="120" :sort-orders="['descending','ascending']" sortable="custom"></el-table-column>
        <el-table-column prop="projectStatus" header-align="center" align="center" label="项目状态" width="105" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.projectStatus === 0" size="small" type="primary">启动</el-tag>
            <el-tag v-else-if="scope.row.projectStatus === 1" size="small" type="danger">暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="a"  prop="isPlan" header-align="center" align="center" label="安排情况" width="105" v-if="roleradio===1" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPlan == 1" size="small" type="success">已安排</el-tag>
            <el-tag  v-if="scope.row.isPlan != 1" size="small" type="info">未安排</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="b"  prop="isWork" header-align="center" align="center" label="作业情况" width="105" v-if="roleradio===2" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.isWork === 1" size="small" type="success">已作业</el-tag>
            <el-tag v-else-if="scope.row.isWork === 2" size="small" type="danger">返修中</el-tag>
            <el-tag v-else size="small" type="info">未作业</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="c"  prop="isCheck" header-align="center" align="center" label="质检情况" width="105" v-if="roleradio===3" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.isCheck == 1" size="small" type="success">已质检</el-tag>
            <el-tag v-else-if="scope.row.isCheck === 2" size="small" type="danger">返修中</el-tag>
            <el-tag v-else-if="scope.row.isCheck === 3" size="small" type="primary">返修完成</el-tag>
            <el-tag v-else size="small" type="info">未质检</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="d" prop="isOutput" header-align="center" align="center" label="核算情况" width="105" v-if="roleradio===4" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOutput == 1" size="small" type="success">已核算</el-tag>
            <el-tag v-if="scope.row.isOutput != 1" size="small" type="info">未核算</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="e"  prop="isAuthorize" header-align="center" align="center" label="审核情况" width="105" v-if="roleradio===5" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAuthorize === 1" size="small" type="success">已审核</el-tag>
            <el-tag v-else size="small" type="info">未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="scheduleRate" header-align="center" align="center" width="120" label="项目进度" :sort-orders="['descending','ascending']" sortable="custom">
          <template slot-scope="scope">
            <!--是作业人员则添加 进度-->
            <div v-if="roleradio==2 && scope.row.isCharge == 1" @click="setScheduleHandle(scope.row)">
              <el-progress class="proclass" :text-inside="true" :stroke-width="22"
                           :percentage="scope.row.scheduleRate != null? scope.row.scheduleRate : 0">
              </el-progress>
            </div>
            <!--非作业人员则查看 进度-->
            <div v-else @click="getScheduleHandle(scope.row)">
              <el-progress class="proclass" :text-inside="true" :stroke-width="22"
                           :percentage="scope.row.scheduleRate != null? scope.row.scheduleRate : 0">
              </el-progress>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="projectStartDateTime" header-align="center" align="center" width="120" label="项目启动时间"
                         v-if="dataForm.dateItemId == 0"></el-table-column>
        <el-table-column prop="projectBegunDateTime" header-align="center" align="center" width="120" label="项目开工时间"
                         v-if="dataForm.dateItemId == 1"></el-table-column>
        <el-table-column prop="wFinishDateTime" header-align="center" align="center" width="120" label="作业完成时间"
                         v-if="dataForm.dateItemId == 2"></el-table-column>
        <el-table-column prop="qFinishDateTime" header-align="center" align="center" width="120" label="质检完成时间"
                         v-if="dataForm.dateItemId == 3"></el-table-column>
        <el-table-column prop="cutOffTime" header-align="center" align="center" width="120" label="结算时间"
                         v-if="dataForm.dateItemId == 4">
          <template slot-scope="scope">{{scope.row.cutOffTime != null? scope.row.cutOffTime.substring(0,7) : ''}}
          </template>
        </el-table-column>
        <!--项目安排按钮-->
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="100" label="操作"  v-if="roleradio==1">
          <template slot-scope="scope">
            <el-tooltip class="item" content="编辑安排" placement="left-start">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editProjectHandle(scope.row)" v-if="isAuth('project:project:plan')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--项目作业按钮-->
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="240" label="操作" v-if="roleradio==2">
          <template slot-scope="scope">
            <el-tooltip class="item"  content="编辑工作" placement="left-start" v-if="scope.row.isCharge === 1">
              <el-button type="success" size="mini" icon="el-icon-edit" @click="editWorkHandle(scope.row)" v-if="isAuth('project:work:update')"></el-button>
            </el-tooltip>
            <el-tooltip class="item"  content="任务单打印" placement="left-start">
              <el-button type="success" size="mini" icon="el-icon-printer" @click="printWorkHandle(scope.row)" v-if="isAuth('project:work:print')"></el-button>
            </el-tooltip>
            <el-tooltip class="item"  :content="scope.row.projectStatus === 0? '暂停项目' : '启动项目'" placement="left-start" v-if="scope.row.isCharge === 1">
              <el-button :type="scope.row.projectStatus === 0? 'danger' : 'success'" size="mini" icon="el-icon-refresh-left" @click="stopProjectHandle(scope.row)" v-if="isAuth('project:work:list')">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item"  content="查看返修" placement="left-start" v-if="scope.row.submitNote == null && scope.row.backId != null & scope.row.isCharge === 1" >
              <el-button type="warning" size="mini" icon="el-icon-s-tools" @click="setBackworkHandle(scope.row)" >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--质量检查按钮-->
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="188" label="操作" v-if="roleradio==3">
          <template slot-scope="scope">
            <el-tooltip class="item"  content="编辑质检" placement="left">
              <el-button class="quality_btn" size="mini" icon="el-icon-edit-outline" @click="editQualityHandle(scope.row)" v-if="isAuth('project:quality:update')"></el-button>
            </el-tooltip>
            <el-tooltip class="item"  content="质检单打印" placement="left">
              <el-button class="quality_btn" size="mini" icon="el-icon-printer" @click="printCheckHandle(scope.row)" v-if="isAuth('project:check:print')"></el-button>
            </el-tooltip>
            <el-tooltip class="item"  content="查看返修" placement="left-start" v-if="scope.row.backId != null">
              <el-button class="quality_btn" size="mini" icon="el-icon-s-tools" @click="getBackworkHandle(scope.row)" >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--产值核算按钮-->
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="100" label="操作" v-if="roleradio==4">
          <template slot-scope="scope">
            <el-tooltip class="item" content="编辑核算" placement="left">
              <el-button class="output_btn" size="mini" icon="el-icon-edit-outline" @click="editOutputHandle(scope.row)" v-if="isAuth('project:checkoutput:update')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--项目审定按钮-->
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="190" label="操作" v-if="roleradio==5">
          <template slot-scope="scope">
            <el-tooltip class="item" content="编辑审定" placement="left">
              <el-button class="examine_btn" size="mini" icon="el-icon-edit-outline"
                         @click="editExamineHandle(scope.row)" v-if="isAuth('project:authorize:update')"></el-button>
            </el-tooltip>
            <el-tooltip class="item" content="流程单打印" placement="left">
              <el-button class="examine_btn" size="mini" icon="el-icon-printer" @click="printProjectHandle(scope.row)" v-if="isAuth('project:authorize:print')"></el-button>
            </el-tooltip>
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

      <!--项目进度表-->
      <el-dialog :title="scheduleTip" :visible.sync="scheduleDialogVisible">
        <el-table :data="scheduleList">
          <el-table-column prop="createTime" header-align="center" align="center" label="日期"
                           width="150"></el-table-column>
          <el-table-column prop="scheduleRate" header-align="center" align="center" label="进度比率"
                           width="100"></el-table-column>
          <el-table-column prop="scheduleNote" header-align="center" align="center" label="进度内容"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="scheduleDialogVisible = false" type="primary" plain>返回</el-button>
      </span>
      </el-dialog>

      <!--返修内容表-->
      <el-dialog :title="backTip" :visible.sync="backDialogVisible" >
        <el-table :data="backWorkList">
          <el-table-column prop="backCreateTime" header-align="center" align="center" label="返修日期" ></el-table-column>
          <el-table-column prop="backNote" header-align="center" align="center" label="返修要求" ></el-table-column>
          <el-table-column prop="submitNote" header-align="center" align="center" label="修改说明"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="backDialogVisible = false" type="primary" plain>返回</el-button>
      </span>
      </el-dialog>

    </el-card>
    <!-- 弹窗, 新增 / 修改  项目组-->
    <projectschedule-add-or-update v-if="projectscheduleVisible" ref="projectscheduleAddOrUpdate"
                                   @refreshDataList="getDataList"></projectschedule-add-or-update>
    <!-- 弹窗, 新增 / 修改  返修-->
    <backwork-add-or-update v-if="backworkVisible" ref="backworkAddOrUpdate"
                                   @refreshDataList="getDataList"></backwork-add-or-update>
  </div>
</template>

<script>
  import moment from 'moment'
  import projectscheduleAddOrUpdate from './projectschedule-add-or-update'
  import backworkAddOrUpdate from './backwork-add-or-update'
  import {isAuth} from '../../../utils'

  export default {
    data () {
      return {
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        projectscheduleVisible: false,
        backworkVisible: false,
        backTip: '',
        backDialogVisible: false,
        dateItemList: [], // 时间类型列表
        backWorkList: [], // 返修列表
        dataForm: {
          dateItemId: 0,
          key: '',
          sidx: 'id',
          order: 'desc',
          startDate: '',
          endDate: ''
        },
        roleradio: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        projectAddOrUpdateVisible: false,
        scheduleDialogVisible: false,  // 项目进度表
        scheduleTip: '',
        scheduleList: [],
        allocationVisible: false  // 项目安排
      }
    },
    components: {
      projectscheduleAddOrUpdate,
      backworkAddOrUpdate
    },
    activated () {
      this.dateItemList = [{'id': 0, 'dateItem': '项目启动时间'},
        {'id': 1, 'dateItem': '项目开工时间'},
        {'id': 2, 'dateItem': '作业完成时间'},
        {'id': 3, 'dateItem': '质检完成时间'},
        {'id': 4, 'dateItem': '结算时间'}]
      this.pageIndex = 1
      this.pageSize = 25
      // 角色选择初始化
      if (isAuth('project:authorize:list')) this.roleradio = 5
      if (isAuth('project:checkoutput:list')) this.roleradio = 4
      if (isAuth('project:quality:list')) this.roleradio = 3
      if (isAuth('project:work:list')) this.roleradio = 2
      if (isAuth('project:project:plan')) this.roleradio = 1
      if (this.$cookie.get('jxrole') !== null && this.$cookie.get('jxrole') !== '') this.roleradio = parseInt(this.$cookie.get('jxrole'))
      if (this.$cookie.get('jxstartDate') !== null && this.$cookie.get('jxstartDate') !== '') {
        this.dataForm.startDate = new Date(this.$cookie.get('jxstartDate'))
        this.changeEnd()
      } else {
        this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        this.changeEnd()
      }
      if (this.$cookie.get('jxendDate') !== null && this.$cookie.get('jxendDate') !== '') {
        this.dataForm.endDate = new Date(this.$cookie.get('jxendDate'))
        this.changeStart()
      } else {
        this.dataForm.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        this.changeStart()
      }
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
        if (val.prop === 'projectNo') {
          this.dataForm.sidx = 'id'
        } else {
          this.dataForm.sidx = val.prop
        }
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
          url: this.$http.adornUrl('/project/manage/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'startDate': startDate,
            'endDate': endDate,
            'dateItemId': this.dataForm.dateItemId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            // 计算 质检 和 作业超时时间
            for (let data of this.dataList) {
              data.backDateNum = data.backDateNum === null ? 0 : data.backDateNum
              // 开工时间为空
              if (data.projectBegunDateTime == null) {
                data.woverTime = null
                data.qoverTime = null
              } else if (data.isPlan === 1) {   // 项目已经安排
                // 作业时间为空 工作时间 为当前时间
                if (data.wFinishDateTime === null) {
                  let woverTime = parseInt((new Date() - new Date(data.projectBegunDateTime)) / (24 * 60 * 60 * 1000) - data.projectWorkDate + data.backDateNum)
                  data.woverTime = woverTime < 0 ? 0 : woverTime
                  data.qoverTime = null
                } else {
                  let woverTime = parseInt((new Date(data.wFinishDateTime) - new Date(data.projectBegunDateTime)) / (24 * 60 * 60 * 1000) - data.projectWorkDate + data.backDateNum)
                  data.woverTime = woverTime < 0 ? 0 : woverTime
                  // 质检时间为空 质检时间 为当前时间
                  if (data.qFinishDateTime === null) {
                    let qoverTime = parseInt((new Date() - new Date(data.wFinishDateTime)) / (24 * 60 * 60 * 1000) - data.projectQualityDate)
                    data.qoverTime = qoverTime < 0 ? 0 : qoverTime
                  } else {
                    let qoverTime = parseInt((new Date(data.qFinishDateTime) - new Date(data.wFinishDateTime)) / (24 * 60 * 60 * 1000) - data.projectQualityDate)
                    data.qoverTime = qoverTime < 0 ? 0 : qoverTime
                  }
                }
              }
            }
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
      },
      // 改变开始时间
      changeStart () {
        if (this.dataForm.endDate === null || this.dataForm.endDate === '') {
          this.$cookie.set('jxendDate', '')
        } else {
          this.$cookie.set('jxendDate', moment(new Date(this.dataForm.endDate)).format('YYYY-MM-DD'))
        }
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
        if (this.dataForm.startDate === null || this.dataForm.startDate === '') {
          this.$cookie.set('jxstartDate', '')
        } else {
          this.$cookie.set('jxstartDate', moment(new Date(this.dataForm.startDate)).format('YYYY-MM-DD'))
        }
        console.log(this.$cookie.get('jxstartDate'))
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
      // 获取进度列表
      getScheduleHandle (item) {
        let projectNo = item.projectNo
        this.scheduleDialogVisible = true
        this.scheduleTip = '项目进度表（编号：' + projectNo + ')'
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/schedule/list'),
          method: 'get',
          params: this.$http.adornParams({
            'projectNo': projectNo
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.scheduleList = data.list
          } else {
            this.scheduleList = []
          }
          this.dataListLoading = false
        })
      },
      // 获取返修内容列表
      getBackworkHandle (item) {
        let projectNo = item.projectNo
        this.backDialogVisible = true
        this.backTip = '返修内容表（项目编号：' + projectNo + ')'
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.backWorkList = data.list
          } else {
            this.backWorkList = []
          }
          this.dataListLoading = false
        })
      },
      // 提交进度
      setScheduleHandle (item) {
        // 项目作业已提交，就无法提交进度
        if (item.isWork === 1) {
          this.$message.error('当前项目已作业完成，无法添加进度！')
          return
        }
        // 项目质检已提交，就无法提交进度
        if (item.isCheck === 1) {
          this.$message.error('当前项目已质检完成，无法添加进度！')
          return
        }
        this.projectscheduleVisible = true
        this.$nextTick(() => {
          this.$refs.projectscheduleAddOrUpdate.init(item)
        })
      },
      // 返修内容
      setBackworkHandle (item) {
        this.backworkVisible = true
        this.$nextTick(() => {
          this.$refs.backworkAddOrUpdate.init(item.projectNo)
        })
      },
      // 编辑安排
      editProjectHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        console.log(this.$router)
        this.$router.push({path: '/project-editallocation', query: {projectNo: item.projectNo}})
      },
      // 编辑工作
      editWorkHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        if (item.scheduleRate < 90) {
          this.$message.error('项目未完结，最高进度只可达90%，请添加进度后再进行作业编辑')
          return
        }
        this.$router.push({path: '/project-editwork', query: {projectNo: item.projectNo}})
      },
      // 作业任务单打印
      printWorkHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({path: '/project-printwork', query: {projectNo: item.projectNo}})
      },
      // 质检单打印
      printCheckHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({path: '/project-printcheck', query: {projectNo: item.projectNo}})
      },
      // 任务流程单打印
      printProjectHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({path: '/project-printproject', query: {projectNo: item.projectNo}})
      },
      // 编辑质量检查
      editQualityHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        if (item.isWork !== 1) {
          this.$confirm('当前项目作业未完成, 是否继续质检?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({path: '/project-editquality', query: {projectNo: item.projectNo,isCheck: item.isCheck}})
          })
        } else {
          this.$router.push({path: '/project-editquality', query: {projectNo: item.projectNo, isCheck: item.isCheck}})
        }
      },
      // 编辑产值核算
      editOutputHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({path: '/project-editoutput', query: {projectNo: item.projectNo}})
      },
      // 编辑项目审定
      editExamineHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({path: '/project-editauthorize', query: {projectNo: item.projectNo}})
      },
      // 产值统计表
      outputChartHandle () {
        this.$router.push({path: '/project-chartoutput'})
      },
      // 产值汇总统计表
      collectChartHandle () {
        this.$router.push({path: '/project-chartcollect'})
      },
      // 质量统计表
      qualityChartHandle () {
        this.$router.push({path: '/project-chartquality'})
      },
      // 暂停或启动项目
      stopProjectHandle (item) {
        this.$http({
          url: this.$http.adornUrl(`/project/work/updateStatus`),
          method: 'post',
          data: this.$http.adornData({
            'id': item.id,
            'projectNo': item.projectNo,
            'projectStatus': item.projectStatus === 0 ? 1 : 0
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
      }
    }

  }
</script>

<style scoped>
  .proclass {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .quality_btn {
    background-color: #006F94;
    color: white;
  }

  .output_btn {
    background-color: #785794;
    color: white;
  }

  .examine_btn {
    background-color: #32947e;
    color: white;
  }

  .select_btn {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }


</style>
