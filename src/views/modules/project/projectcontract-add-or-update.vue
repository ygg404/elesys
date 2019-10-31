<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="合同编号" prop="contractNo">
      <el-input v-model="dataForm.contractNo" placeholder="合同编号"></el-input>
    </el-form-item>
    <el-form-item label="合同添加时间" prop="contractAddTime">
      <el-input v-model="dataForm.contractAddTime" placeholder="合同添加时间"></el-input>
    </el-form-item>
    <el-form-item label="合同创建时间" prop="contractCreateTime">
      <el-input v-model="dataForm.contractCreateTime" placeholder="合同创建时间"></el-input>
    </el-form-item>
    <el-form-item label="合同委托单位" prop="contractAuthorize">
      <el-input v-model="dataForm.contractAuthorize" placeholder="合同委托单位"></el-input>
    </el-form-item>
    <el-form-item label="合同名称" prop="contractName">
      <el-input v-model="dataForm.contractName" placeholder="合同名称"></el-input>
    </el-form-item>
    <el-form-item label="合同类型: 0.合同委托 1.一般委托" prop="contractType">
      <el-input v-model="dataForm.contractType" placeholder="合同类型: 0.合同委托 1.一般委托"></el-input>
    </el-form-item>
    <el-form-item label="合同内容" prop="contractNote">
      <el-input v-model="dataForm.contractNote" placeholder="合同内容"></el-input>
    </el-form-item>
    <el-form-item label="业务负责人" prop="contractBusiness">
      <el-input v-model="dataForm.contractBusiness" placeholder="业务负责人"></el-input>
    </el-form-item>
    <el-form-item label="合同状态: 1.正常2.回收站" prop="contractStage">
      <el-input v-model="dataForm.contractStage" placeholder="合同状态: 1.正常2.回收站"></el-input>
    </el-form-item>
    <el-form-item label="合同金额" prop="contractMoney">
      <el-input v-model="dataForm.contractMoney" placeholder="合同金额"></el-input>
    </el-form-item>
    <el-form-item label="项目类型" prop="projectType">
      <el-input v-model="dataForm.projectType" placeholder="项目类型"></el-input>
    </el-form-item>
    <el-form-item label="文件" prop="filename">
      <el-input v-model="dataForm.filename" placeholder="文件"></el-input>
    </el-form-item>
    <el-form-item label="联系人电话" prop="userPhone">
      <el-input v-model="dataForm.userPhone" placeholder="联系人电话"></el-input>
    </el-form-item>
    <el-form-item label="联系人名称" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="联系人名称"></el-input>
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
          contractNo: '',
          contractAddTime: '',
          contractCreateTime: '',
          contractAuthorize: '',
          contractName: '',
          contractType: '',
          contractNote: '',
          contractBusiness: '',
          contractStage: '',
          contractMoney: '',
          projectType: '',
          filename: '',
          userPhone: '',
          userName: ''
        },
        dataRule: {
          contractNo: [
            { required: true, message: '合同编号不能为空', trigger: 'blur' }
          ],
          contractAddTime: [
            { required: true, message: '合同添加时间不能为空', trigger: 'blur' }
          ],
          contractCreateTime: [
            { required: true, message: '合同创建时间不能为空', trigger: 'blur' }
          ],
          contractAuthorize: [
            { required: true, message: '合同委托单位不能为空', trigger: 'blur' }
          ],
          contractName: [
            { required: true, message: '合同名称不能为空', trigger: 'blur' }
          ],
          contractType: [
            { required: true, message: '合同类型: 0.合同委托 1.一般委托不能为空', trigger: 'blur' }
          ],
          contractNote: [
            { required: true, message: '合同内容不能为空', trigger: 'blur' }
          ],
          contractBusiness: [
            { required: true, message: '业务负责人不能为空', trigger: 'blur' }
          ],
          contractStage: [
            { required: true, message: '合同状态: 1.正常2.回收站不能为空', trigger: 'blur' }
          ],
          contractMoney: [
            { required: true, message: '合同金额不能为空', trigger: 'blur' }
          ],
          projectType: [
            { required: true, message: '项目类型不能为空', trigger: 'blur' }
          ],
          filename: [
            { required: true, message: '文件不能为空', trigger: 'blur' }
          ],
          userPhone: [
            { required: true, message: '联系人电话不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '联系人名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/set/projectcontract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.contractNo = data.projectcontract.contractNo
                this.dataForm.contractAddTime = data.projectcontract.contractAddTime
                this.dataForm.contractCreateTime = data.projectcontract.contractCreateTime
                this.dataForm.contractAuthorize = data.projectcontract.contractAuthorize
                this.dataForm.contractName = data.projectcontract.contractName
                this.dataForm.contractType = data.projectcontract.contractType
                this.dataForm.contractNote = data.projectcontract.contractNote
                this.dataForm.contractBusiness = data.projectcontract.contractBusiness
                this.dataForm.contractStage = data.projectcontract.contractStage
                this.dataForm.contractMoney = data.projectcontract.contractMoney
                this.dataForm.projectType = data.projectcontract.projectType
                this.dataForm.filename = data.projectcontract.filename
                this.dataForm.userPhone = data.projectcontract.userPhone
                this.dataForm.userName = data.projectcontract.userName
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/projectcontract/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'contractNo': this.dataForm.contractNo,
                'contractAddTime': this.dataForm.contractAddTime,
                'contractCreateTime': this.dataForm.contractCreateTime,
                'contractAuthorize': this.dataForm.contractAuthorize,
                'contractName': this.dataForm.contractName,
                'contractType': this.dataForm.contractType,
                'contractNote': this.dataForm.contractNote,
                'contractBusiness': this.dataForm.contractBusiness,
                'contractStage': this.dataForm.contractStage,
                'contractMoney': this.dataForm.contractMoney,
                'projectType': this.dataForm.projectType,
                'filename': this.dataForm.filename,
                'userPhone': this.dataForm.userPhone,
                'userName': this.dataForm.userName
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
      }
    }
  }
</script>
