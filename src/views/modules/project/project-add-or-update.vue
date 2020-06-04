<template>
  <div>
    <el-dialog customClass="customWidth"
               :title="!dataForm.id ? '新增项目' : '修改项目'"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="生产负责人" prop="projectProduceId" >
              <el-row style="display: flex">
                <el-select v-model="dataForm.produceGroupId" placeholder="部门" style="width: 140px;" @change="groupChangeHandle">
                  <el-option v-for="item in groupList" :label="item.name" :key="item.id" :value="item.id" ></el-option>
                </el-select>
                <el-select v-model="dataForm.projectProduceId" placeholder="生产负责人" style="width: 120px;"  >
                  <el-option v-for="item in produceList" :label="item.username" :key="item.userId" :value="item.userId" ></el-option>
                </el-select>
              </el-row>
            </el-form-item>
            <el-form-item label="项目编号" prop="projectNo">
              <el-input v-model="dataForm.projectNo" placeholder="项目编号" disabled></el-input>
            </el-form-item>
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="dataForm.contractNo" placeholder="合同编号" disabled></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="委托单位" prop="projectAuthorize">
              <el-input v-model="dataForm.projectAuthorize" placeholder="委托单位" disabled></el-input>
            </el-form-item>
            <el-form-item label="委托要求" prop="projectNote">
              <el-input v-model="dataForm.projectNote" placeholder="委托要求" disabled ></el-input>
            </el-form-item>
            <el-form-item label="业务负责人" prop="projectBusiness">
              <el-input v-model="dataForm.projectBusiness" placeholder="业务负责人" disabled></el-input>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <el-input v-model="dataForm.projectType" placeholder="项目类型" disabled></el-input>
            </el-form-item>
            <el-form-item label="项目启动时间" prop="projectStartDateTime">
              <el-date-picker v-model="dataForm.projectStartDateTime" type="date" value-format="yyyy-MM-dd" placeholder="项目启动时间" style="width: 150px;" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="预计产值" prop="projectOutput" >
              <el-input type="number" style="width: 200px;" v-model="dataForm.projectOutput"></el-input>
              <el-tooltip class="item"  content="产值明细计算" placement="right"  >
                <el-button type="primary"  icon="el-icon-s-platform" @click="editOutputHandle()" ></el-button>
              </el-tooltip>
            </el-form-item>
            <!--预计产值明细表-->
            <el-card style="margin-top: 10px;">
              <div slot="header" class="clearfix" style="padding: 0">
                <span class="span_title">预计产值明细  </span>
              </div>
              <el-table :data="chooseRatio(workTypelist)" border  style="width: 100%;" show-summary >
                <el-table-column prop="typeName" header-align="center" align="left" label="作业类型" ></el-table-column>
                <el-table-column prop="unit" header-align="center" align="center"  label="量单位" ></el-table-column>
                <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单价" ></el-table-column>
                <el-table-column prop="projectRatio" header-align="center" align="center" label="难度系数" ></el-table-column>
                <el-table-column prop="workLoad" header-align="center" align="center" label="工作量" ></el-table-column>
                <el-table-column prop="typeOutput" header-align="center" align="center" label="产值" ></el-table-column>
              </el-table>
              <div style="margin-top: 10px;width: 100%;" v-if="dataForm.outputRemark != '' && dataForm.outputRemark != null">
                <div><span style="font-weight: 700;font-size: 11pt;">备注:</span>
                  <span style="color: #00b7ee;">{{dataForm.outputRemark}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>

    <!--  编辑预算产值 -->
    <output-add-or-update v-if="addOrUpdateVisible" ref="outputAddOrUpdate" @refreshDataList="refreshOutputHandle"></output-add-or-update>
  </div>
</template>

<script>
  import outputAddOrUpdate from './output-add-or-update'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        addOrUpdateVisible: false,
        visible: false,
        dataForm: {
          id: 0,
          projectNo: '',
          contractNo: '',
          projectName: '',
          projectMoney: '',
          projectAuthorize: '',
          projectNote: '',
          projectBusiness: '',
          pStage: '',
          examineNote: '',
          projectType: '',
          projectStage: '',
          projectProduce: '',
          projectProduceAccount: '',
          projectProduceId: '',
          projectStartDateTime: '',
          projectOutput: '',
          outputRemark: '',  // 预算产值备注
          produceGroupId: ''
        },
        produceList: [],
        workTypelist: [],
        groupList: [], // 一级部门列表
        dataRule: {
          projectNo: [
            { required: true, message: '项目编号不能为空', trigger: 'blur' }
          ],
          contractNo: [
            { required: true, message: '合同编号不能为空', trigger: 'blur' }
          ],
          projectName: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' }
          ],
          projectMoney: [
            { required: true, message: '项目金额不能为空', trigger: 'blur' }
          ],
          projectAuthorize: [
            { required: true, message: '委托单位不能为空', trigger: 'blur' }
          ],
          projectNote: [
            { required: true, message: '项目要求不能为空', trigger: 'blur' }
          ],
          projectBusiness: [
            { required: true, message: '业务负责人不能为空', trigger: 'blur' }
          ],
          projectType: [
            { required: true, message: '项目类型不能为空', trigger: 'blur' }
          ],
          projectStage: [
            { required: true, message: '项目阶段不能为空', trigger: 'blur' }
          ],
          projectProduce: [
            { required: true, message: '生产负责人不能为空', trigger: 'blur' }
          ],
          projectProduceId: [
            { required: true, message: '生产负责人不能为空', trigger: 'blur' }
          ],
          projectStartDateTime: [
            { required: true, message: '项目启动时间不能为空', trigger: 'blur' }
          ],
          projectOutput: [
            {required: true, message: '预计产值不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      outputAddOrUpdate
    },
    methods: {
      init (id, item) {
        this.getProduceList()
        this.getWorkgroupList().then(list => {
          this.groupList = list
        })
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/project/project/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectNo = data.project.projectNo
                this.dataForm.contractNo = data.project.contractNo
                this.dataForm.projectName = data.project.projectName
                this.dataForm.projectMoney = data.project.projectMoney
                this.dataForm.projectAuthorize = data.project.projectAuthorize
                this.dataForm.projectNote = data.project.projectNote
                this.dataForm.projectBusiness = data.project.projectBusiness
                this.dataForm.examineNote = data.project.examineNote
                this.dataForm.projectType = data.project.projectType
                this.dataForm.projectStage = data.project.projectStage
                this.dataForm.projectProduce = data.project.projectProduce
                this.dataForm.pStage = data.project.pStage
                this.dataForm.projectProduceAccount = data.project.projectProduceAccount
                this.dataForm.produceGroupId = data.project.produceGroupId
                this.dataForm.projectProduceId = data.project.projectProduceId
                this.dataForm.projectStartDateTime = data.project.projectStartDateTime
                this.dataForm.projectCreateDateTime = data.project.projectCreateDateTime
                this.dataForm.createuserid = data.project.createuserid
                this.getWorkTypelist(data.project.projectNo).then(list => {
                  this.workTypelist = list
                  this.getPlanByProjectNo()
                })
              }
            })
          } else {
            // 新增项目 获取项目号
            this.getProjectNo(item.contractNo).then(projectNo => {
              this.dataForm.projectNo = projectNo
              this.getWorkTypelist(projectNo).then(list => {
                this.workTypelist = list
                this.getPlanByProjectNo()
              })
            })
            this.dataForm.contractNo = item.contractNo
            this.dataForm.projectName = item.contractName
            this.dataForm.projectMoney = item.contractMoney
            this.dataForm.projectAuthorize = item.contractAuthorize
            this.dataForm.projectNote = item.contractNote
            this.dataForm.projectBusiness = item.contractBusiness
            this.dataForm.projectType = item.projectType
            this.dataForm.projectProduceId = ''
            this.dataForm.produceGroupId = ''
            this.dataForm.projectProduce = ''
          }
        })
      },
      // 编辑预算产值
      editOutputHandle () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.outputAddOrUpdate.init(this.dataForm)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 项目负责人
            this.dataForm.projectProduce = this.produceList.find(produce => produce.userId === this.dataForm.projectProduceId)['username']
            console.log(this.dataForm.projectProduceId,this.dataForm.projectProduce)
            this.$http({
              url: this.$http.adornUrl(`/project/project/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'projectNo': this.dataForm.projectNo,
                'contractNo': this.dataForm.contractNo,
                'projectName': this.dataForm.projectName,
                'projectMoney': this.dataForm.projectMoney,
                'projectAuthorize': this.dataForm.projectAuthorize,
                'projectNote': this.dataForm.projectNote,
                'projectBusiness': this.dataForm.projectBusiness,
                'pStage': this.dataForm.pStage,
                'examineNote': this.dataForm.examineNote,
                'projectType': this.dataForm.projectType,
                'projectStage': this.dataForm.projectStage,
                'projectProduce': this.dataForm.projectProduce,
                'projectProduceAccount': this.dataForm.projectProduceAccount,
                'projectProduceId': this.dataForm.projectProduceId,
                'produceGroupId': this.dataForm.produceGroupId,
                'projectStartDateTime': this.dataForm.projectStartDateTime,
                'outputRemark': this.dataForm.outputRemark,
                'createuserid': this.dataForm.createuserid
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.postProjectPlanHandle().then( success => {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                  this.visible = false
                  this.$emit('refreshDataList' , this.dataForm.contractNo)
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 添加项目 获取项目编号
      getProjectNo (contractNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProjectNo`),
            method: 'get',
            params: this.$http.adornParams({ 'contractNo': contractNo })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.projectNo)
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
      // 获取一级部门列表
      getWorkgroupList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/workgroup/list`),
            method: 'get',
            params: this.$http.adornParams({
              pid: 12
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
      // 选择部门发生的事件，默认选择生产负责人的是经理或副经理
      groupChangeHandle () {
        for (let group of this.groupList) {
          if ( group.id === this.dataForm.produceGroupId) {
            this.produceList = []
            if (!stringIsNull(group.headId)) {
              this.produceList.push({
                userId: group.headId,
                username: group.headMan
              })
            }
            if (!stringIsNull(group.deputyId)) {
              this.produceList.push({
                userId: group.deputyId,
                username: group.deputyLeader
              })
            }
          }
        }
        console.log(this.produceList)
        this.dataForm.projectProduceId = ''
      },
      // 获取预算产值工作类型列表
      getWorkTypelist (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutputtemp/list`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
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
      // 预算产值设置后
      refreshOutputHandle (projectNo,totalOutPut,outputRemark) {
        this.getWorkTypelist(projectNo).then( list => {
          this.workTypelist = list
          this.dataForm.projectOutput = totalOutPut
          this.dataForm.outputRemark = outputRemark
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
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
      // 工作安排预算产值
      postProjectPlanHandle () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/plan/saveTemp`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.dataForm.projectNo,
              'projectOutput': this.dataForm.projectOutput
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取项目计划
      getPlanByProjectNo () {
        return new Promise((resolve, reject) => {
          if (this.dataForm.projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/info/${this.dataForm.projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.projectPlan != null) {
                  this.dataForm.projectOutput = data.projectPlan.projectOutput
                }
                resolve(data)
              } else {
                this.$message.error(data.msg)
                reject(data.msg)
              }
            })
          }
        })
      },
    }
  }
</script>

<style>
  .customWidth {
    width: 1000px;
  }
  .span_title{
    font-weight: 700;
    font-size: 20px;
  }
</style>
