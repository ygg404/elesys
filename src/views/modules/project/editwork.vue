<template>
  <div class="mod-config">
    <el-collapse  >
      <el-collapse-item style="border: 1px solid #8c939d ">
        <template slot="title">
          <span class="span_title">项目基本信息</span>
        </template>
        <div style="background-color: #f0f0f0">
          <div>项目名称：{{projectInfo.projectName}}</div>
          <div>项目类型：{{projectInfo.projectType}}</div>
          <div>委托单位：{{projectInfo.projectAuthorize}}</div>
          <div>委托要求：{{projectInfo.projectNote}}</div>
          <div>业务负责人：{{projectInfo.contractBusiness}}</div>
          <div>联系人：{{projectInfo.userName}}</div>
          <div>联系人电话：{{projectInfo.userPhone}}</div>
          <div>项目开工时间：{{projectInfo.projectBegunDateTime}}</div>
          <div>执行标准：{{projectInfo.executeStandard}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item style="border: 1px solid #2D64B3 ">
        <template slot="title">
          <span class="span_title">项目进度信息</span>
        </template>
        <div style="background-color: #f0f0f0">
          <el-table :data="scheduleList">
            <el-table-column prop="createTime" header-align="center" align="center" label="日期" ></el-table-column>
            <el-table-column prop="scheduleRate" header-align="center" align="center" label="进度比率" ></el-table-column>
            <el-table-column prop="scheduleNote" header-align="center" align="center" label="进度内容"></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" class="form_class">
      <el-card class="box-card" >
        <div slot="header" class="clearfix" style="padding: 0">
          <span class="span_title">项目作业信息</span>
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-select  placeholder="技术交底快捷输入" v-model="disclosureValue" style="width: 100%" multiple collapse-tags  @change="disclosureValueHandler()" >
              <el-option v-for="item in disclosureNotesList" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="technicalDisclosureNote">
              <el-input type="textarea" placeholder="请输入技术交底" maxlength="1000" size="large" show-word-limit rows="4"   v-model="dataForm.technicalDisclosureNote" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-select  placeholder="过程检查意见快捷输入" v-model="checkValue" style="width: 100%" collapse-tags multiple @change="checkSuggestionHandler()">
              <el-option v-for="item in checkSuggestionsList" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="checkSuggestion">
              <el-input type="textarea" placeholder="请输入过程检查意见" maxlength="1000" show-word-limit rows="4"  v-model="dataForm.checkSuggestion"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-select  placeholder="上交资料快捷输入"  v-model="dataValue" collapse-tags multiple style="width: 100%;margin-top: 10px;" @change="dataNameHandler()">
              <el-option v-for="item in dataNameList" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="dataName">
              <el-input type="textarea" placeholder="请输入上交资料" maxlength="1000" show-word-limit rows="4" v-model="dataForm.dataName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-select  placeholder="工作小结快捷输入"  v-model="briefValue" collapse-tags multiple style="width: 100%;margin-top: 10px;" @change="briefSummaryHandler()">
              <el-option v-for="item in briefSummarysList" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="briefSummary">
              <el-input type="textarea" placeholder="请输入工作小结" maxlength="1000" show-word-limit rows="4" v-model="dataForm.briefSummary"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-select  placeholder="工作量快捷输入"  v-model="workValue" collapse-tags multiple style="width: 100%;margin-top: 10px;" @change="workLoadHandler()">
              <el-option v-for="item in workLoadList" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="workLoad">
              <el-input type="textarea" placeholder="请输入工作量" maxlength="1000" show-word-limit rows="4" v-model="dataForm.workLoad"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <div class="bottom_btn">
      <el-button type="warning" size="large"  @click="goBack">返回</el-button>
      <el-button type="primary" size="large" @click="dataFormSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'

  export default {
    data () {
      return {
        projectInfo: '',
        scheduleList: [], // 项目进度表
        disclosureNotesList: [],
        checkSuggestionsList: [],
        dataNameList: [],
        briefSummarysList: [],
        workLoadList: [],
        disclosureValue: '',
        checkValue: '',
        dataValue: '',
        briefValue: '',
        workValue: '',
        dataForm: {
          technicalDisclosureNote: '',
          checkSuggestion: '',
          dataName: '',
          workLoad: '',
          briefSummary: ''
        },
        dataRule: {
          technicalDisclosureNote: [
            { required: true, message: '技术交底不能为空', trigger: 'blur' }
          ],
          checkSuggestion: [
            { required: true, message: '过程检查不能为空', trigger: 'blur' }
          ],
          dataName: [
            { required: true, message: '上交资料不能为空', trigger: 'blur' }
          ],
          workLoad: [
            { required: true, message: '工作量不能为空', trigger: 'blur' }
          ],
          briefSummary: [
            { required: true, message: '工作小结不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let projectNo = this.$route.query.projectNo
        this.getScheduleList(projectNo)
        this.getInfoByProjectNo(projectNo)
        this.getWorkByProjectNo(projectNo)
        this.getdisclosureNote()
        this.getcheckSuggestion()
        this.getdataName()
        this.getbriefSummary()
        this.getworkLoad()
      },
      // 获取进度列表
      getScheduleList (projectNo) {
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
        })
      },
      // 获取项目工作
      getWorkByProjectNo (projectNo) {
        console.log(projectNo)
        return new Promise((resolve, reject) => {
          if (projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/work/getInfoByProjectNo/${projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.projectWork != null) {
                  this.dataForm.id = data.projectWork.id
                  this.dataForm.projectNo = data.projectWork.projectNo
                  this.dataForm.technicalDisclosureNote = data.projectWork.technicalDisclosureNote
                  this.dataForm.checkSuggestion = data.projectWork.checkSuggestion
                  this.dataForm.dataName = data.projectWork.dataName
                  this.dataForm.briefSummary = data.projectWork.briefSummary
                  this.dataForm.workLoad = data.projectWork.workLoad
                  this.dataForm.finishDateTime = data.projectWork.finishDateTime
                  this.dataForm.projectStatus = data.projectWork.projectStatus
                  this.dataForm.workNote = data.projectWork.workNote
                  this.dataForm.planWorkDate = data.projectWork.planWorkDate
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
              data.projectInfo.executeStandard = '☑' + data.projectInfo.executeStandard.replace(/;/g, '☑').slice(0, -1)
              this.projectInfo = data.projectInfo
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取技术交底列表
      getdisclosureNote () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/5`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.disclosureNotesList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取过程检查意见快捷数据
      getcheckSuggestion () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/6`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.checkSuggestionsList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取上交资料快捷数据
      getdataName () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/7`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataNameList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取工作小结快捷数据
      getbriefSummary () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/8`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.briefSummarysList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取工作量快捷数据
      getworkLoad () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/11`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workLoadList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 执行内容处理
      disclosureValueHandler () {
        console.log(this.disclosureValue)
        this.dataForm.technicalDisclosureNote = ''
        for (let value of this.disclosureValue) {
          for (let disclosureNote of this.disclosureNotesList) {
            if (disclosureNote.id === value) this.dataForm.technicalDisclosureNote = this.dataForm.technicalDisclosureNote + disclosureNote.shortcutNote + ';'
          }
        }
      },
      // 工作小结处理
      briefSummaryHandler () {
        console.log(this.briefValue)
        this.dataForm.briefSummary = ''
        for (let value of this.briefValue) {
          for (let note of this.briefSummarysList) {
            if (note.id === value) this.dataForm.briefSummary = this.dataForm.briefSummary + note.shortcutNote + ';'
          }
        }
      },
      // 资料上传处理
      dataNameHandler () {
        console.log(this.dataValue)
        this.dataForm.dataName = ''
        for (let value of this.dataValue) {
          for (let note of this.dataNameList) {
            if (note.id === value) this.dataForm.dataName = this.dataForm.dataName + note.shortcutNote + ';'
          }
        }
      },
      // 过程检查处理
      checkSuggestionHandler () {
        this.dataForm.checkSuggestion = ''
        for (let value of this.checkValue) {
          for (let note of this.checkSuggestionsList) {
            if (note.id === value) this.dataForm.checkSuggestion = this.dataForm.checkSuggestion + note.shortcutNote + ';'
          }
        }
      },
      // 工作量处理
      workLoadHandler () {
        this.dataForm.workLoad = ''
        for (let value of this.workValue) {
          for (let note of this.workLoadList) {
            if (note.id === value) this.dataForm.workLoad = this.dataForm.workLoad + note.shortcutNote + ';'
          }
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/work/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'projectNo': this.dataForm.projectNo,
                'technicalDisclosureNote': this.dataForm.technicalDisclosureNote,
                'checkSuggestion': this.dataForm.checkSuggestion,
                'dataName': this.dataForm.dataName,
                'briefSummary': this.dataForm.briefSummary,
                'workLoad': this.dataForm.workLoad
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.goBack()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-editwork')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editwork') {
          this.init()
        } else {
          this.goBack()
        }
      }
    }
  }
</script>

<style scoped>
    .form_class{
      margin-top: 20px;

    }

    .span_title {
      font-size: 18px;
      font-weight: 700;
    }

    .bottom_btn{
      margin: 20px;
      width: 100%;
      text-align: center;
    }

    .work_textare{
      width: 40%;
      margin-top: 4px;
    }
</style>
