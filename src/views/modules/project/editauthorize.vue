<template>
  <div class="mod-config">
    <el-collapse accordion >
      <el-collapse-item style="border: 1px solid #8c939d">
        <template slot="title">
          <span class="span_title">项目基本信息</span>
        </template>
        <div class="span_text">
          <div>项目编号：{{projectInfo.projectNo}}</div>
          <div>项目名称：{{projectInfo.projectName}}</div>
          <div>项目类型：{{projectInfo.projectType}}</div>
          <div>工作内容：{{projectInfo.workNote}}</div>
          <div>联系人：{{projectInfo.userName}}</div>
          <div>联系电话：{{projectInfo.userPhone}}</div>
          <div>项目负责人：{{projectInfo.projectCharge}}</div>
          <div>业务负责人：{{projectInfo.contractBusiness}}</div>
          <div>工作内容：{{projectInfo.workNote}}</div>
          <div>工作要求：{{projectInfo.workRequire}}</div>
          <div>质量综述：{{projectInfo.qualityNote}}</div>
          <div>质量评分：{{projectInfo.qualityScore}}</div>
          <div>质量等级：{{projectInfo.qualityLevel}}</div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-card class="card_header">
      <div slot="header" class="header_span" >
        <span>审定意见：  </span>
      </div>
      <el-input type="textarea" maxlength="1000" size="large" show-word-limit rows="4" v-model="dataForm.examineNote" placeholder="审定意见"></el-input>
    </el-card>

    <div class="bottom_btn">
      <el-button type="warning" size="large"  @click="goBack">返回</el-button>
      <el-button type="primary" size="large" @click="saveForm">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'

  export default {
    data () {
      return {
        projectInfo: '',
        projectNo: this.$route.query.projectNo,
        dataForm: {
          id: '',
          projectNo: '',
          examineNote: ''
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getInfoByProjectNo(this.projectNo)
        this.getEntityByProjectNo(this.projectNo)
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
              if (this.projectInfo.qualityScore < 60) {
                this.projectInfo.qualityLevel = '不合格'
              } else if (this.projectInfo.qualityScore >= 60 && this.projectInfo.qualityScore <= 70) {
                this.projectInfo.qualityLevel = '合格'
              } else if (this.projectInfo.qualityScore > 70 && this.projectInfo.qualityScore < 90) {
                this.projectInfo.qualityLevel = '良'
              } else if (this.projectInfo.qualityScore >= 90) {
                this.projectInfo.qualityLevel = '优'
              }
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目的实体信息
      getEntityByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getByProjectNo/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.id = data.project.id
              this.dataForm.projectNo = data.project.projectNo
              this.dataForm.examineNote = data.project.examineNote
              resolve(this.examineNote)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 提交项目审定
      saveForm () {
        if (this.dataForm.id == null || this.dataForm.id === '') {
          this.$message.error('当前项目不存在，请刷新后重试！')
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/project/project/authorize`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'projectNo': this.dataForm.projectNo,
            'examineNote': this.dataForm.examineNote
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '提交成功',
              type: 'success',
              duration: 1500
            })
            this.goBack()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-editauthorize')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editauthorize') {
          this.init()
        } else {
          this.goBack()
        }
      }
    }
  }
</script>

<style scoped>
  .span_title{
    font-weight: 700;
    color: black;
    font-size: 18px;
  }
  .span_text{
    background-color: #DAD8D8;
    color: black;
    font-size: 15px;
  }
  .header_span{
    font-weight: 700;
    color: black;
    font-size: 18px;
  }
  .bottom_btn{
    margin: 20px;
    width: 100%;
    text-align: center;
  }
</style>
