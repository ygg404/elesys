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
          <el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期"
                          style="width: 145px;" @change="getDataList"></el-date-picker>
          至
          <el-date-picker v-model="dataForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期"
                          style="width: 145px;" @change="getDataList"></el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable @change="getDataList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
        <el-form-item style="right: 0">
          <el-button @click="outputChartHandle" type="primary" icon="el-icon-s-data" v-if="isAuth('project:chartoutput')">产值表</el-button>
          <el-button @click="collectChartHandle" type="primary" icon="el-icon-s-data" v-if="isAuth('project:chartcollect')">产值汇总表</el-button>
          <el-button @click="qualityChartHandle" type="primary" icon="el-icon-s-data" v-if="isAuth('project:chartquality')">质量表</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
        <el-table-column prop="projectNo" header-align="center" align="center" width="120" label="项目编号" sortable
                         :sort-orders="['descending','ascending']"></el-table-column>
        <el-table-column prop="projectName" header-align="center" align="left" label="项目名称"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="projectCharge" header-align="center" align="center" label="项目负责人"
                         width="120"></el-table-column>
        <el-table-column prop="projectStatus" header-align="center" align="center" label="项目状态" width="85">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.projectStatus === 0" size="small" type="primary">启动</el-tag>
            <el-tag v-else-if="scope.row.projectStatus === 1" size="small" type="danger">暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()"  prop="isPlan" header-align="center" align="center" label="安排情况" width="85" v-if="roleradio===1">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPlan == 1" size="small" type="success">已安排</el-tag>
            <el-tag  v-if="scope.row.isPlan != 1" size="small" type="info">未安排</el-tag>
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()"  prop="isWork" header-align="center" align="center" label="作业情况" width="85" v-if="roleradio===2">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.isWork === 1" size="small" type="success">已作业</el-tag>
            <el-tag v-else size="small" type="info">未作业</el-tag>
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()"  prop="isCheck" header-align="center" align="center" label="质检情况" width="85" v-if="roleradio===3">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.isCheck == 1" size="small" type="success">已质检</el-tag>
            <el-tag v-if="scope.row.isCheck != 1" size="small" type="info">未质检</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isOutput" header-align="center" align="center" label="核算情况" width="85" v-if="roleradio===4">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOutput == 1" size="small" type="success">已核算</el-tag>
            <el-tag v-if="scope.row.isOutput != 1" size="small" type="info">未核算</el-tag>
          </template>
        </el-table-column>
        <el-table-column :key="Math.random()"  prop="isAuthorize" header-align="center" align="center" label="审核情况" width="85" v-if="roleradio===5">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAuthorize === 1" size="small" type="success">已审核</el-tag>
            <el-tag v-else size="small" type="info">未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="scheduleRate" header-align="center" align="center" width="120" label="项目进度">
          <template slot-scope="scope">
            <!--是作业人员则添加 进度-->
            <div v-if="roleradio==2" @click="setScheduleHandle(scope.row)">
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
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="190" label="操作" v-if="roleradio==2">
          <template slot-scope="scope">
            <el-tooltip class="item"  content="编辑工作" placement="left-start" >
              <el-button type="success" size="mini" icon="el-icon-edit" @click="editWorkHandle(scope.row)" v-if="isAuth('project:work:update')"></el-button>
            </el-tooltip>
            <el-tooltip class="item"  content="任务单打印" placement="left-start">
              <el-button type="success" size="mini" icon="el-icon-printer" @click="printWorkHandle(scope.row)" v-if="isAuth('project:work:print')"></el-button>
            </el-tooltip>
            <el-tooltip class="item"  :content="scope.row.projectStatus === 0? '暂停项目' : '启动项目'" placement="left-start">
              <el-button :type="scope.row.projectStatus === 0? 'danger' : 'success'" size="mini" icon="el-icon-refresh-left" @click="stopProjectHandle(scope.row)" v-if="isAuth('project:work:list')">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--质量检查按钮-->
        <el-table-column :key="Math.random()"  header-align="center" align="center" width="100" label="操作" v-if="roleradio==3">
          <template slot-scope="scope">
            <el-tooltip class="item"  content="编辑质检" placement="left">
              <el-button class="quality_btn" size="mini" icon="el-icon-edit-outline" @click="editQualityHandle(scope.row)" v-if="isAuth('project:quality:update')"></el-button>
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
    </el-card>
    <!-- 弹窗, 新增 / 修改  项目组-->
    <projectschedule-add-or-update v-if="projectscheduleVisible" ref="projectscheduleAddOrUpdate"
                                   @refreshDataList="getDataList"></projectschedule-add-or-update>
  </div>
</template>

<script>
  import moment from 'moment'
  import projectscheduleAddOrUpdate from './projectschedule-add-or-update'
  import {isAuth} from '../../../utils'

  export default {
    data () {
      return {
        projectscheduleVisible: false,
        dateItemList: [], // 时间类型列表
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
      projectscheduleAddOrUpdate
    },
    activated () {
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
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
        // 时间判断 （结束时间大于开始时间 ，则清空结束时间）
        if (new Date(this.dataForm.startDate) >= new Date(this.dataForm.endDate)) {
          this.dataForm.endDate = null
        }
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
            'endDate': this.dataForm.endDate,
            'dateItemId': this.dataForm.dateItemId
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
      // 提交进度
      setScheduleHandle (item) {
        this.projectscheduleVisible = true
        this.$nextTick(() => {
          this.$refs.projectscheduleAddOrUpdate.init(item)
        })
      },
      // 编辑安排
      editProjectHandle (item) {
        console.log(this.$router)
        this.$router.push({path: '/project-editallocation', query: {projectNo: item.projectNo}})
      },
      // 编辑工作
      editWorkHandle (item) {
        if (item.scheduleRate < 90) {
          this.$message.error('项目未完结，最高进度只可达90%，请添加进度后再进行作业编辑')
          return
        }
        this.$router.push({path: '/project-editwork', query: {projectNo: item.projectNo}})
      },
      // 作业任务单打印
      printWorkHandle (item) {
        this.$router.push({path: '/project-printwork', query: {projectNo: item.projectNo}})
      },
      // 任务流程单打印
      printProjectHandle (item) {
        this.$router.push({path: '/project-printproject', query: {projectNo: item.projectNo}})
      },
      // 编辑质量检查
      editQualityHandle (item) {
        this.$router.push({path: '/project-editquality', query: {projectNo: item.projectNo}})
      },
      // 产值核算
      editOutputHandle (item) {
        this.$router.push({path: '/project-editoutput', query: {projectNo: item.projectNo}})
      },
      // 项目审定
      editExamineHandle (item) {
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
