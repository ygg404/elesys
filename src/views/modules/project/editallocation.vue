<template>
  <div class="mod-config">
    <el-row :gutter="24">
      <el-col :span="14">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" style="text-align: left;">
          <el-card class="box-card" >
            <div slot="header" class="clearfix" style="padding: 0">
              <span class="span_title">项目安排信息</span>
              <el-form-item label="开工日期:" prop="projectBegunDateTime" style="float:right;width: 240px;margin-top: -10px;">
                <el-date-picker v-model="dataForm.projectBegunDateTime" type="date" placeholder="项目开工日期" style="max-width: 150px;"></el-date-picker>
              </el-form-item>
            </div>
            <el-select  placeholder="执行标准短语快捷输入" v-model="executeValue" multiple collapse-tags style="width: 100%;" @change="executelistHandler()" >
              <el-option v-for="item in executelist" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="executeStandard">
              <el-input type="textarea" placeholder="请输入执行标准" maxlength="1000" show-word-limit class="allo_text" v-model="dataForm.executeStandard" ></el-input>
            </el-form-item>
            <el-select  placeholder="作业内容短语快捷输入" v-model="worknoteValue" collapse-tags multiple style="width: 100%;margin-top: 20px;" @change="worknotelistHandler()">
              <el-option v-for="item in worknotelist" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="workNote">
              <el-input type="textarea" placeholder="请输入作业内容" maxlength="1000" show-word-limit class="allo_text" v-model="dataForm.workNote"></el-input>
            </el-form-item>
            <el-select  placeholder="作业要求短语快捷输入"  v-model="workrequireValue" collapse-tags multiple style="width: 100%;margin-top: 20px;" @change="workrequirelistHandler()">
              <el-option v-for="item in workrequireList" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="workRequire">
              <el-input type="textarea" placeholder="请输入作业要求" maxlength="1000" show-word-limit class="allo_text" v-model="dataForm.workRequire"></el-input>
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="预计工作量:" prop="projectWorkload">
                  <el-input placeholder="工作量" style="max-width: 140px;" v-model="dataForm.projectWorkload" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计产值:" prop="projectOutput">
                  <el-input placeholder="产值" type="number" style="max-width: 120px;" v-model="dataForm.projectOutput" @change="countWorkDateHandler" min="0" ></el-input>
                  <el-tooltip class="item"  content="产值明细计算" placement="right"  >
                    <el-button type="primary"  icon="el-icon-s-platform" @click="setProjectOutputHandle()" ></el-button>
                  </el-tooltip>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="作业工期    :" prop="projectWorkDate">
                  <el-input placeholder="作业工期" type="number" style="max-width: 140px;" v-model="dataForm.projectWorkDate" min="0"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="质检工期:" prop="projectQualityDate">
                  <el-input placeholder="质检工期" type="number" style="max-width: 120px;" v-model="dataForm.projectQualityDate" min="0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card project_info"  >
          <div slot="header" class="clearfix">
            <span class="span_title">项目基本信息</span>
          </div>
          <div class="info_class">
            <el-row :gutter="24"><el-col :span="8"><span>项目编号：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectNo}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>项目名称：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectName}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>项目类型：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectType}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>委托单位：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectAuthorize}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>委托要求：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectNote}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>业务负责人：</span></el-col> <el-col :span="16"><span>{{projectInfo.contractBusiness}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>项目立项人：</span></el-col> <el-col :span="16"><span>{{projectInfo.createUserName}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>联系人：</span></el-col> <el-col :span="16"><span>{{projectInfo.userName}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>联系人电话：</span></el-col> <el-col :span="16"><span>{{projectInfo.userPhone}}</span></el-col></el-row>
          </div>
        </el-card>
        <div style="margin-top: 10px;">
          <el-button type="primary" size="large" @click="projectGroupHandle(projectNo)">选择作业组</el-button>
        </div>
        <el-card class="box-card group_info" style="margin-top: 10px;" v-if="dataForm.projectCharge != null">
          <div slot="header" class="clearfix" style="padding: 0">
            <span class="span_title">作业组数据</span>
            <div style="float:right;">
              <span>项目负责人:{{dataForm.projectCharge}}</span>
            </div>
          </div>
          <div v-for="group in this.groupWorkList" :key="group.groupId" class="group_item" v-if="group.checked">
            {{group.groupName}}:占比{{group.outputRate}}%，产值:{{group.projectOutput}}，最短工期:{{group.shortDateTime}}，最长工期:{{group.lastDateTime}}。
          </div>
        </el-card>
        <!--预计产值明细表-->
        <el-card style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="padding: 0">
            <span class="span_title">预计产值明细  </span>
            <span v-if="totalOutPut !== 0" style="color:#00b7ee;">(预计总产值：{{totalOutPut}})</span>
          </div>
          <el-table :data="chooseRatio(workTypelist)" border  style="width: 100%;">
            <el-table-column prop="typeName" header-align="center" align="left" label="作业类型" ></el-table-column>
            <el-table-column prop="unit" header-align="center" align="center"  label="量单位" ></el-table-column>
            <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单位" ></el-table-column>
            <el-table-column prop="projectRatio" header-align="center" align="center" label="难度系数" ></el-table-column>
            <el-table-column prop="workLoad" header-align="center" align="center" label="工作量" ></el-table-column>
            <el-table-column prop="typeOutput" header-align="center" align="center" label="产值" ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="rate_info">
      <el-table  :data="groupRateList" style="width: 100%" >
        <el-table-column type="expand" >
          <template slot-scope="props">
            <el-table  :data="props.row.projectList" style="width: 100%;" :row-class-name="getTableclass" border>
              <el-table-column label="项目名称" prop="projectName"></el-table-column>
              <el-table-column label="项目启动时间" prop="projectStartDateTime"></el-table-column>
              <el-table-column label="预算产值" prop="projectOutput"></el-table-column>
              <el-table-column label="实际产值" prop="projectActuallyOutput"></el-table-column>
              <el-table-column label="进度" prop="scheduleRate">
                <template slot-scope="scope">
                  <el-progress :text-inside="true"  :stroke-width="26" :percentage="scope.row.scheduleRate" ></el-progress>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="组名" prop="groupName"></el-table-column>
        <el-table-column label="已安排产值" prop="isSetOutput"></el-table-column>
        <el-table-column label="未完成产值" prop="isNotOutput"></el-table-column>
        <el-table-column label="未完成项目数" prop="undoneNum"></el-table-column>
        <!--<el-table-column label="安排系数" prop="groupRate"></el-table-column>-->
      </el-table>
    </el-card>

    <div class="bottom_btn">
      <el-button type="warning" size="large"  @click="goBack">返回</el-button>
      <el-button type="primary" size="large" @click="dataFormSubmit">提交</el-button>
    </div>

    <!--产值明细计算-->
    <el-dialog title="产值明细计算" :visible.sync="outputCalVisible" width="70%" :close-on-click-modal="false">
      <el-row :gutter="24" class="card_work">
        <el-col :span="8">
          <el-card class="box-card"  >
            <div slot="header" class="clearfix">
              <span style="font-size: 13px;">项目类型：</span>
              <el-select  v-model="ptValue" multiple collapse-tags style="width: 75%;" @change="projectTypeChangeHandler()" >
                <el-option v-for="item in projectTypelist" :label="item.name" :key="item.id" :value="item.id"  ></el-option>
              </el-select>
            </div>
            <div class="left_work">
              <el-checkbox
                v-for="(workType, index) in workTypelist"
                :key="index"
                :label="workType.typeName"
                v-model="workType.checked"
                v-if="workType.isVisible"
                @change="checkOutputVoInit"
                class="checkbox_class"
              ></el-checkbox>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-table :data="chooseRatio(workTypelist)" border  style="width: 100%;">
            <el-table-column prop="typeName" header-align="center" align="left" label="作业类型" width="120"></el-table-column>
            <el-table-column prop="unit" header-align="center" align="center"  label="工作量单位" width="110"></el-table-column>
            <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单位" ></el-table-column>
            <el-table-column prop="projectRatio" header-align="center" align="center" label="难度系数" width="110">
              <template slot-scope="scope">
                <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.projectRatio" @change="checkOutputVoInit" ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="workLoad" header-align="center" align="center" label="工作量" width="110">
              <template slot-scope="scope">
                <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.workLoad" @change="checkOutputVoInit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="typeOutput" header-align="center" align="center" label="产值" width="100"></el-table-column>
          </el-table>
          <div>
            <span style="color: #00b7ee">预计总产值：{{totalOutPut}}</span>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outputCalVisible = false"  plain>返回</el-button>
        <el-button @click="putProjectOutputToApiHandle"  type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改  项目组-->
    <projectgroup-add-or-update v-if="projectGroupVisible" ref="projectgroupAddOrUpdate" @refreshDataList="init"></projectgroup-add-or-update>
  </div>
</template>

<script>
  import projectgroupAddOrUpdate from './projectgroup-add-or-update'
  import {closeTab} from '@/utils/tabs'
  import moment from 'moment'

  export default {
    data () {
      return {
        projectNo: this.$route.query.projectNo,
        projectGroupVisible: false,
        ptValue: [],
        outputCalVisible: false, // 产值明细计算
        projectInfo: '',
        dataForm: {
          executeStandard: '',
          workNote: '',
          workRequire: '',
          projectWriter: '',
          projectNo: '',
          projectCharge: '',
          projectChargeAccount: '',
          projectOutput: '',
          projectOutputNote: '',
          projectWorkload: '',
          projectBegunDateTime: '',
          projectWorkDate: '',
          projectQualityDate: '',
          projectActuallyOutput: ''
        },
        groupRateList: [],
        produceList: [],
        dataRule: {
          executeStandard: [
            { required: true, message: '执行标准不能为空', trigger: 'blur' }
          ],
          workNote: [
            { required: true, message: '作业内容不能为空', trigger: 'blur' }
          ],
          workRequire: [
            { required: true, message: '作业要求不能为空', trigger: 'blur' }
          ],
          projectWorkDate: [
            { required: true, message: '作业工期不能为空', trigger: 'blur' }
          ],
          projectQualityDate: [
            { required: true, message: '质检工期不能为空', trigger: 'blur' }
          ],
          projectOutput: [
            { required: true, message: '预计产值不能为空', trigger: 'blur' }
          ],
          projectWorkload: [
            { required: true, message: '预计工作量不能为空', trigger: 'blur' }
          ],
          projectBegunDateTime: [
            { required: true, message: '项目开工时间不能为空', trigger: 'blur' }
          ]
        },
        executelist: [], // 执行标准列表
        executeValue: '',
        worknotelist: [], // 作业内容列表
        worknoteValue: '',
        workrequireList: [],   // 作业要求列表
        workrequireValue: '',
        groupWorkList: [],  // 作业分组情况

        projectTypelist: [],  // 项目类型列表
        workTypelist: [],     // 工作类型列表
        totalOutPut: 0    // 预计总产值计算数值
      }
    },
    components: {
      projectgroupAddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        // this.$refs['dataForm'].resetFields()
        this.getPlanByProjectNo()
        this.getExecutelist()
        this.getWorkNotelist()
        this.getWorkRequireList()
        this.getProjectDataCoe()
        this.getInfoByProjectNo(this.projectNo)  // 获取项目基本信息
        this.getGroupByProjectNo(this.projectNo) // 获取项目分组情况
        this.getWorkTypelist(this.projectNo).then(success => {
          this.checkOutputVoInit()
        })
        this.dataForm.projectBegunDateTime = moment(new Date()).format('YYYY-MM-DD')
        // this.getProjectCharge(this.projectNo)  // 获取项目负责人
      },
      // 工作日期
      countWorkDateHandler () {
        let workNum = this.dataForm.projectOutput / 2400 - parseInt(this.dataForm.projectOutput / 2400)
        console.log(workNum)
        if (workNum === 0) {
          this.dataForm.projectWorkDate = Math.round(this.dataForm.projectOutput / 2400)
        } else if (workNum < 0.5) {
          this.dataForm.projectWorkDate = parseInt(this.dataForm.projectOutput / 2400) + 0.5
        } else {
          this.dataForm.projectWorkDate = Math.round(this.dataForm.projectOutput / 2400)
        }
        let qualityNum = this.dataForm.projectWorkDate * 0.25 - parseInt(this.dataForm.projectWorkDate * 0.25)
        if (qualityNum === 0) {
          this.dataForm.projectQualityDate = Math.round(this.dataForm.projectWorkDate * 0.25)
        } else if (qualityNum < 0.5) {
          this.dataForm.projectQualityDate = parseInt(this.dataForm.projectWorkDate * 0.25) + 0.5
        } else {
          this.dataForm.projectQualityDate = Math.round(this.dataForm.projectWorkDate * 0.25)
        }
      },
      // 选择作业组
      projectGroupHandle (projectNo) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataFormSubmit(false)
            this.projectGroupVisible = true
            this.$nextTick(() => {
              console.log(this.dataForm.projectOutput)
              this.$refs.projectgroupAddOrUpdate.init(projectNo, this.dataForm.projectOutput)
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit (goback = true) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/save`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'projectNo': this.projectNo,
                'projectWorkload': this.dataForm.projectWorkload,
                'projectWorkDate': this.dataForm.projectWorkDate,
                'projectQualityDate': this.dataForm.projectQualityDate,
                'projectOutput': this.dataForm.projectOutput,
                'executeStandard': this.dataForm.executeStandard,
                'workRequire': this.dataForm.workRequire,
                'workNote': this.dataForm.workNote,
                'projectWriter': this.projectInfo.createUserName,
                'projectBegunDateTime': this.dataForm.projectBegunDateTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '保存并提交成功',
                  type: 'success',
                  duration: 1500
                })
                if (goback) this.goBack()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false
          }
        })
      },
      // 项目分组信息
      getGroupByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getListByProjectNo/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.groupWorkList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目计划
      getPlanByProjectNo () {
        return new Promise((resolve, reject) => {
          if (this.projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/info/${this.projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.projectPlan != null) {
                  this.dataForm.id = data.projectPlan.id
                  this.dataForm.projectNo = data.projectPlan.projectNo
                  this.dataForm.projectWorkload = data.projectPlan.projectWorkload
                  this.dataForm.projectWorkDate = data.projectPlan.projectWorkDate
                  this.dataForm.projectQualityDate = data.projectPlan.projectQualityDate
                  this.dataForm.projectOutput = data.projectPlan.projectOutput
                  this.dataForm.executeStandard = data.projectPlan.executeStandard
                  this.dataForm.workRequire = data.projectPlan.workRequire
                  this.dataForm.workNote = data.projectPlan.workNote
                  this.dataForm.projectBegunDateTime = data.projectPlan.projectBegunDateTime
                  this.dataForm.projectCharge = data.projectPlan.projectCharge
                }
                resolve(data)
              } else {
                this.$message.error(data.msg)
                reject(data.msg)
              }
            })
          } else {
            ;
          }
        })
      },
      // 获取项目基本信息
      getInfoByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/projectInfo/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectInfo = data.projectInfo
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取生产负责人列表
      getProduceList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProduceList`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.produceList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取执行标准列表
      getExecutelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/1`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.executelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取作业内容列表
      getWorkNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/3`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.worknotelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取作业要求列表
      getWorkRequireList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/4`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workrequireList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 执行内容处理
      executelistHandler () {
        console.log(this.executeValue)
        this.dataForm.executeStandard = ''
        for (let value of this.executeValue) {
          for (let worknote of this.executelist) {
            if (worknote.id === value) this.dataForm.executeStandard = this.dataForm.executeStandard + worknote.shortcutNote + ';'
          }
        }
      },
      // 工作内容处理
      worknotelistHandler () {
        console.log(this.worknoteValue)
        this.dataForm.workNote = ''
        for (let value of this.worknoteValue) {
          for (let worknote of this.worknotelist) {
            if (worknote.id === value) this.dataForm.workNote = this.dataForm.workNote + worknote.shortcutNote + ';'
          }
        }
      },
      // 技术要求处理
      workrequirelistHandler () {
        console.log(this.workrequireValue)
        this.dataForm.workRequire = ''
        for (let value of this.workrequireValue) {
          for (let worknote of this.workrequireList) {
            if (worknote.id === value) this.dataForm.workRequire = this.dataForm.workRequire + worknote.shortcutNote + ';'
          }
        }
      },
      // 获取项目负责人
      getProjectCharge (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/plan/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.projectPlan)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取各组项目产值和进度数据
      getProjectDataCoe () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getProjectDataCoe`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.groupRateList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目类型列表
      getProjectTypelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/projecttype/getProjectTypelist`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectTypelist = []
              this.projectTypelist.push({id: 0, name: '全部'})
              console.log(this.projectTypelist)
              for (let item of data.list) {
                this.projectTypelist.push({id: item.id, name: item.name})
              }
              resolve(data.projectTypelist)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取工作类型列表
      getWorkTypelist (projectNo) {
        console.log(projectNo)
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutputtemp/list`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workTypelist = data.list
              resolve(data.workTypelist)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 工作类型可见或不可见
      workTypeInit () {
        for (let workType of this.workTypelist) {
          workType.isVisible = false
          // 工作类型 不属于 任意项目则设为 可见
          if (workType.projectTypeIdList.length === 0) {
            workType.isVisible = true
          } else {
            for (let ptypeId of workType.projectTypeIdList) {
              for (let ptvalue of this.ptValue) {
                if (ptvalue === ptypeId) workType.isVisible = true
              }
            }
          }
        }
      },
      // 项目类型改变
      projectTypeChangeHandler () {
        console.log(this.ptValue)
        for (let ptvalue of this.ptValue) {
          // 选择全部项目时
          if (ptvalue === 0) {
            this.ptValue = []
            for (let pw of this.projectTypelist) if (pw.id !== 0) this.ptValue.push(pw.id)
            break
          }
        }
        this.workTypeInit()
        this.checkOutputVoInit()
      },
      // 产值明细计算
      setProjectOutputHandle () {
        this.ptValue = []
        this.totalOutPut = 0
        this.getProjectTypelist().then(success => {
          this.getWorkTypelist(this.projectNo).then(success => {
            let ptType = this.projectInfo.projectType.split(',')
            console.log(ptType)
            for (let pt of this.projectTypelist) {
              for (let type of ptType) {
                if (pt.name === type) {
                  this.ptValue.push(pt.id)
                }
              }
            }
            this.workTypeInit()
            this.checkOutputVoInit()
          })
        })
        this.outputCalVisible = true
      },
      // 提交 预算产值明细
      putProjectOutputToApiHandle () {
        this.outputCalVisible = false
        this.$http({
          url: this.$http.adornUrl(`/project/checkoutputtemp/save`),
          method: 'post',
          data: this.$http.adornData({
            'projectNo': this.projectNo,
            'tempOutputlist': this.workTypelist
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.projectOutput = this.totalOutPut
            this.countWorkDateHandler()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        //  console.log(params)
        let temp = []
        params.forEach(e => {
          if (e.checked) {
            e.typeOutput = this.numFilter(
              e.workLoad * e.projectRatio * e.unitOutput
            )
            if (e.projectRatio == null || e.workLoad == null) {
              e.projectRatio = 1
              e.workLoad = 0
            }
            temp.push(e)
          }
        })
        return temp
      },
      // 根据工作类型可见不可见 来显示右侧工作组工作类型数据
      checkOutputVoInit () {
        let totalOutPut = 0
        let worktypeList = this.workTypelist
        worktypeList.forEach((ele, index) => {
          if (ele.checked) {
            ele.typeOutput = parseFloat((ele.projectRatio * ele.unitOutput * ele.workLoad).toFixed(2))
            totalOutPut = parseFloat((totalOutPut + ele.typeOutput).toFixed(2))
          }
        })
        this.workTypelist = worktypeList
        this.totalOutPut = totalOutPut
      },
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-editallocation')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editallocation') {
          this.init()
        } else {
          this.goBack()
        }
      }
    }
  }
</script>

<style>
  .span_title{
    font-weight: 700;
    font-size: 20px;
  }

  .project_info{
    background-color: #58798E;
    color: white;
  }

  .group_info{
    background-color: #5daf34;
    color: white;
  }

  .group_item{
    font-size: 15px;
  }
  .allo_text{
    height: 100px;
    margin-top: 5px;
  }

  .allo_text textarea{
    height: 100px;
  }

  .bottom_btn{
    margin: 20px;
    width: 100%;
    text-align: center;
  }

  .info_class span{
    font-size: 15px;
  }

  .rate_info{
    margin-top: 10px;
  }

  .el-select-dropdown{
    max-width: 243px;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 00px;
  }
  .left_work{
    border: 1px solid #6f7180;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    height: 400px;
  }
  .checkbox_class{
    width: 99%;
    margin-left: 0;
  }
  .card_work{
    margin-top: 20px;
    font-size: 16px;
  }
</style>
