<template>
  <div class="mod-config">
    <el-collapse v-model="activeNames">
      <el-collapse-item>
        <template slot="title">
          <span class="span_title">项目基本信息</span>
        </template>
        <div style="background-color: #f0f0f0">
          <div>项目名称：{{projectInfo.projectName}}</div>
          <div>项目类型：{{projectInfo.projectType}}</div>
          <div>委托单位：{{projectInfo.projectAuthorize}}</div>
          <div>委托要求：{{projectInfo.projectNote}}</div>
          <div>业务负责人：{{projectInfo.contractBusiness}}</div>
          <div>项目负责人：{{projectInfo.projectCharge}}</div>
          <div>工作内容：{{projectInfo.workNote}}</div>
          <div>工作要求：{{projectInfo.workRequire}}</div>
          <div>工作小结：{{projectInfo.briefSummary}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="preReport">
        <template slot="title">
          <span class="span_title">返修记录信息</span>
        </template>
        <el-table :data="backWorkList" border>
          <el-table-column prop="backCreateTime" header-align="center" align="center" label="返修日期" ></el-table-column>
          <el-table-column prop="backNote" header-align="center" align="center" label="返修要求" >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="checkReportHandle(scope.row)">查看内容</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="submitCreateTime" header-align="center" align="center" label="修改日期"></el-table-column>
        </el-table>
        <!-- 质检反馈详情-->
        <el-card class="quality_card" v-if="proLoading">
          <div  class="loading_clss">
            <el-progress type="circle" :percentage="curRate"></el-progress>
          </div>
        </el-card>
        <el-card :class="proLoading == false && reportVisible? 'anim_report_view' : 'anim_not_view' " >
          <div class="quality_card_title">{{reportTitle}}</div>
          <div ref="reportPreId" class="quality_report" ></div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          <span class="span_title">质检反馈报告</span>
        </template>
        <div ref="reportId" class="quality_report" ></div>
      </el-collapse-item>
    </el-collapse>

    <el-card class="card_header">
      <div slot="header" class="header_span" >
        <span>质量综述：  </span>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="form_class">
        <el-select  placeholder="质量综述快捷输入" v-model="qualityNoteValue" style="width: 100%" multiple collapse-tags  @change="qualityNoteHandler()" >
          <el-option v-for="item in qualityNotelist" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
        </el-select>
        <el-form-item prop="qualityNote">
          <el-input type="textarea" maxlength="1000" size="large" show-word-limit rows="4" v-model="dataForm.qualityNote" placeholder="请填写质量综述"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

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
        proLoading: false,
        curRate: 0,
        curprog: 0,
        totalprog: 1,
        dataLoading: false,
        loadingText: '正在加载...',
        projectNo: '',
        reportVisible: false,
        reportTitle: '',
        isCheck: 0, // 检查状态： 2为返修中
        projectInfo: '',
        qualityNotelist: [],
        qualityNoteValue: '',
        qualityScoreVisible: false, // 质检分数可视图
        repairVisible: false, // 返修可视图
        editVisible: false,  // 编辑质检报告可视图
        backWorkList: [],
        activeNames: [],
        dataForm: {
          id: '',
          qualityNote: '',      // 质检综述
        },
        dataRule: {
          qualityNote: [
            { required: true, message: '质量综述不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.projectNo = this.$route.query.projectNo
        this.getInfoByProjectNo(this.projectNo)
        this.dataLoading = true
        this.loadingText = ''
        this.getQualityByProjectNo(this.projectNo).then(data => {
          this.dataLoading = false
        })
        this.getBackworkHandle(this.projectNo)
        this.getQualityNotelist()
        this.getRepairNotelist()
      },
      // 提交数据
      dataFormSubmit () {
        let that = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            that.dataLoading = true
            that.loadingText = ''
            that.activeNames = []
            this.$http({
              url: this.$http.adornUrl(`/project/quality/update`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'projectNo': this.projectNo,
                'qualityNote': this.dataForm.qualityNote
              }),
              onUploadProgress (proEvent) {
                that.loadingText = '正在上传中（' + parseInt(proEvent.loaded * 100 / proEvent.total).toString() + '%)'
              }
            }).then(({data}) => {
              if (data && data.code === 0) {
                that.dataLoading = false
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
                this.goBack()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 查看质检反馈内容
      checkReportHandle (item) {
        this.reportVisible = true
        this.reportTitle = '质检反馈报告（ 日期：' + item.backCreateTime + ')'
        this.curprog = 0
        this.$refs.reportPreId.innerHTML = item.backNote
      },
      // 返修列表关闭事件
      reportDialogClose () {
        this.reportVisible = false
        this.visible = false
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
      // 获取质检信息
      getQualityByProjectNo (projectNo ) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/quality/getInfo`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              if ( data.checkQuality != null) {
                this.dataForm.id = data.checkQuality.id
                this.dataForm.qualityNote = data.checkQuality.qualityNote
                this.dataForm.qualityScore = data.checkQuality.qualityScore
                this.dataForm.qualityReport = data.checkQuality.qualityReport
                this.$refs.reportId.innerHTML = data.checkQuality.qualityReport
              }
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取返修内容列表
      getBackworkHandle (projectNo) {
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
        })
      },
      // 获取质量综述列表
      getQualityNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/9`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.qualityNotelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取返修综述列表
      getRepairNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/12`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.repairNotelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 质量审核报告
      qualityNoteHandler () {
        this.dataForm.qualityNote = ''
        for (let value of this.qualityNoteValue) {
          for (let note of this.qualityNotelist) {
            if (note.id === value) this.dataForm.qualityNote = this.dataForm.qualityNote + note.shortcutNote + ';'
          }
        }
      },
      // 返回
      goBack () {
        closeTab('project-editqualityquth')
        this.$router.push('project-project')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editqualityquth') {
          this.init()
        } else {
          closeTab('project-editqualityauth')
        }
      },
      activeNames: function (val) {
        if (val.indexOf('preReport') !== -1) {
          this.reportVisible = false
          this.proLoading = false
          this.$refs.reportPreId.innerHTML = ''
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
  .span_title :hover{
    color: #00a0e9;
  }

  .bottom_btn{
    margin: 20px;
    width: 100%;
    text-align: center;
  }
  .quality_title{
    padding: 0;
    justify-content: space-between;
    display: flex
  }

  .col_item .el-collapse-item__header focusing is-active{
    border-bottom: 1px solid #2D64B3;
  }

  .back_title{
    color: #00a0e9;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #00a0e93f;
  }
  .quality_card{
    margin-top: 15px;
  }
  .quality_card .quality_card_title{
    font-weight: 700;
    font-size: 13pt;
    border-bottom: 1px solid #00a0e93f;
  }
  .quality_report{
    overflow: auto;
    padding: 8px;
  }

  .anim_not_view{
    opacity: 0;
  }
  /* 下拉动画 */
  .anim_report_view{
    display: block;
    animation:2s report_view 0s;
  }

  @keyframes report_view{
    0%{opacity:0}
    50%{opacity:.8;}
    100%{opacity:0;}
  }

  .loading_clss{
    width: 100%;
    text-align: center;
    background-color: #6f71805f;
    opacity: 0.8;
  }

  .card_header{
    margin-top: 18px;
  }
  .card_header .header_span{
    font-weight: 700;
    font-size: 14pt;

  }
</style>
