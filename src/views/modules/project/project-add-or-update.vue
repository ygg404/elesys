<template>
  <el-dialog
    :title="!dataForm.id ? '新增项目' : '修改项目'"
    :close-on-click-modal="false"
    width="40%"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="生产负责人" prop="projectProduce" >
        <el-select v-model="dataForm.projectProduceAccount" placeholder="生产负责人"  style="width: 100%;">
          <el-option v-for="item in produceList" :label="item.username" :key="item.useraccount" :value="item.useraccount"  ></el-option>
        </el-select>
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
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
          projectStartDateTime: ''
        },
        produceList: [],
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
          projectProduceAccount: [
            { required: true, message: '生产负责人账号不能为空', trigger: 'blur' }
          ],
          projectStartDateTime: [
            { required: true, message: '项目启动时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id, item) {
        this.getProduceList()
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
                this.dataForm.projectStartDateTime = data.project.projectStartDateTime
                this.dataForm.projectCreateDateTime = data.project.projectCreateDateTime
                this.dataForm.createuserid = data.project.createuserid
              }
            })
          } else {
            // 新增项目 获取项目号
            this.getProjectNo(item.contractNo)
            this.dataForm.contractNo = item.contractNo
            this.dataForm.projectName = item.contractName
            this.dataForm.projectMoney = item.contractMoney
            this.dataForm.projectAuthorize = item.contractAuthorize
            this.dataForm.projectNote = item.contractNote
            this.dataForm.projectBusiness = item.contractBusiness
            this.dataForm.projectType = item.projectType
            this.dataForm.projectProduceAccount = ''
            this.dataForm.projectProduce = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        // 项目负责人
        console.log(this.dataForm.projectProduceAccount)
        for (let produce of this.produceList) {
          if (this.dataForm.projectProduceAccount === produce.useraccount) { this.dataForm.projectProduce = produce.username }
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
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
                'projectStartDateTime': this.dataForm.projectStartDateTime,
                'createuserid': this.dataForm.createuserid
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
              this.dataForm.projectNo = data.projectNo
              resolve(data.list)
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
      }
    }
  }
</script>
