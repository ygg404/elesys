<template>
  <div class="mod-config">
    <el-collapse >
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
          <div>项目负责人：{{projectInfo.projectCharge}}</div>
          <div>工作内容：{{projectInfo.workNote}}</div>
          <div>工作要求：{{projectInfo.workRequire}}</div>
          <div>工作小结：{{projectInfo.briefSummary}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item style="border: 1px solid #2D64B3 ">
        <template slot="title">
          <span class="span_title">返修记录信息</span>
        </template>
        <el-table :data="backWorkList">
          <el-table-column prop="backCreateTime" header-align="center" align="center" label="返修日期" ></el-table-column>
          <el-table-column prop="backNote" header-align="center" align="center" label="返修要求" ></el-table-column>
          <el-table-column prop="submitNote" header-align="center" align="center" label="修改说明"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" class="form_class">
      <el-card class="box-card" >
        <div slot="header" class="clearfix" style="padding: 0">
          <span class="span_title">质量检查信息</span>
        </div>
        <el-row :gutter="24">
          <el-col :span="20">
            <el-select  placeholder="质量综述快捷输入" v-model="qualityNoteValue" style="width: 100%" multiple collapse-tags  @change="qualityNoteHandler()" >
              <el-option v-for="item in qualityNotelist" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
            <el-form-item prop="qualityNote">
              <el-input type="textarea" placeholder="请输入质量综述" maxlength="1000" size="large" show-word-limit rows="4"   v-model="dataForm.qualityNote" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
        <el-form-item label="质量评分" prop="qualityScore">
          <el-input type="number" placeholder="质量评分" oninput="if(value>100)value=100;if(value<0)value=0;" max="100" min="0" size="large"  v-model="dataForm.qualityScore" style="width: 140px;"></el-input>
        </el-form-item>
        <el-button type="primary" size="large" @click="addQualityscoreHandler">添加质量评分</el-button>
      </el-card>
    </el-form>
    <div class="bottom_btn">
      <el-button type="warning" size="large"  @click="goBack">返回</el-button>
      <el-button type="primary" size="large" @click="dataFormSubmit">提交</el-button>
      <el-button type="danger" size="large" @click="repairVisible = true" :disabled="isCheck == 2">退回返修</el-button>
    </div>

    <el-dialog title="提出返修" :close-on-click-modal="false" width="50%" :visible.sync="repairVisible">
      <el-select  placeholder="返修意见快捷输入" v-model="repairValue" style="width: 100%" multiple collapse-tags  @change="repairNoteHandler()" >
        <el-option v-for="item in repairNotelist" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>
      </el-select>
      <el-form :model="repairForm" :rules="repairRule" ref="repairForm" @keyup.enter.native="repairNoteSubmit()" class="form_class">
        <el-form-item prop="backNote">
          <el-input type="textarea" placeholder="请输入返修意见" maxlength="1000" size="large" show-word-limit rows="4"   v-model="repairForm.backNote" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="repairVisible = false">取消</el-button>
        <el-button type="primary" @click="repairNoteSubmit()">确定</el-button>
      </span>
    </el-dialog>

    <!--&lt;!&ndash; 弹窗, 新增 / 修改  质检评分-->
    <qualityscore-add-or-update v-if="qualityScoreVisible" ref="qualityscoreAddOrUpdate" @refreshDataList="setQualityScore"></qualityscore-add-or-update>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'
  import qualityscoreAddOrUpdate from './qualityscore-add-or-update'

  export default {
    data () {
      return {
        projectNo: '',
        isCheck: 0, // 检查状态： 2为返修中
        projectInfo: '',
        qualityNotelist: [],
        qualityNoteValue: '',
        qualityScoreVisible: false,
        repairVisible: false,
        backWorkList: [],
        dataForm: {
          id: '',
          qualityNote: '',
          qualityScore: ''
        },
        dataRule: {
          qualityNote: [
            { required: true, message: '质量综述不能为空', trigger: 'blur' }
          ],
          qualityScore: [
            { required: true, message: '质量分数不能为空', trigger: 'blur' }
          ]
        },
        repairNotelist: [], // 返修快捷输入列表
        repairValue: '', // 返修短语
        repairForm: {
          backNote: ''
        },  // 返修意见
        repairRule: {
          backNote: [
            { required: true, message: '返修意见不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      qualityscoreAddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.projectNo = this.$route.query.projectNo
        this.isCheck = this.$route.query.isCheck
        this.getInfoByProjectNo(this.projectNo)
        this.getQualityByProjectNo(this.projectNo)
        this.getBackworkHandle(this.projectNo)
        this.getQualityNotelist()
        this.getRepairNotelist()
      },
      // 提交数据
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/quality/save`),
              method: 'post',
              data: this.$http.adornData({
                'projectNo': this.projectNo,
                'qualityNote': this.dataForm.qualityNote,
                'qualityScore': this.dataForm.qualityScore
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
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
      getQualityByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/quality/getInfo`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.id = data.checkQuality.id
              this.dataForm.qualityNote = data.checkQuality.qualityNote
              this.dataForm.qualityScore = data.checkQuality.qualityScore
              resolve(data.projectInfo)
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
      qualityNoteHandler () {
        console.log(this.qualityNoteValue)
        this.dataForm.qualityNote = ''
        for (let value of this.qualityNoteValue) {
          for (let note of this.qualityNotelist) {
            if (note.id === value) this.dataForm.qualityNote = this.dataForm.qualityNote + note.shortcutNote + ';'
          }
        }
      },
      repairNoteHandler () {
        console.log(this.repairNote)
        this.repairNote = ''
        for (let value of this.repairValue) {
          for (let note of this.repairNotelist) {
            if (note.id === value) this.repairNote = this.repairNote + note.shortcutNote + ';'
          }
        }
      },
      // 提交返修意见
      repairNoteSubmit () {
        this.$refs['repairForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/backwork/save`),
              method: 'post',
              data: this.$http.adornData({
                'projectNo': this.projectNo,
                'backNote': this.repairForm.backNote
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
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
      // 添加质量评分
      addQualityscoreHandler () {
        this.qualityScoreVisible = true
        this.$nextTick(() => {
          this.$refs.qualityscoreAddOrUpdate.init(this.projectNo)
        })
      },
      // 质量评分设置
      setQualityScore (score) {
        this.dataForm.qualityScore = score
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-editquality')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editquality') {
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
</style>
