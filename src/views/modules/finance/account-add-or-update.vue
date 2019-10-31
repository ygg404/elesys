<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="合同编号" prop="contractNo">
      <el-input v-model="dataForm.contractNo" placeholder="合同编号"></el-input>
    </el-form-item>
    <el-form-item label="收支内容" prop="accountNote">
      <el-input v-model="dataForm.accountNote" placeholder="收支内容"></el-input>
    </el-form-item>
    <el-form-item label="收支金额" prop="accountNum">
      <el-input v-model="dataForm.accountNum" placeholder="收支金额"></el-input>
    </el-form-item>
    <el-form-item label="支出类型" prop="accountType">
      <el-input v-model="dataForm.accountType" placeholder="支出类型"></el-input>
    </el-form-item>
    <el-form-item label="支出类型名称" prop="accountTypeName">
      <el-input v-model="dataForm.accountTypeName" placeholder="支出类型名称"></el-input>
    </el-form-item>
    <el-form-item label="账号收支添加时间" prop="accountAddDateTime">
      <el-input v-model="dataForm.accountAddDateTime" placeholder="账号收支添加时间"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createDateTime">
      <el-input v-model="dataForm.createDateTime" placeholder="创建时间"></el-input>
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
          accountNote: '',
          accountNum: '',
          accountType: '',
          accountTypeName: '',
          accountAddDateTime: '',
          createDateTime: ''
        },
        dataRule: {
          contractNo: [
            { required: true, message: '合同编号不能为空', trigger: 'blur' }
          ],
          accountNote: [
            { required: true, message: '收支内容不能为空', trigger: 'blur' }
          ],
          accountNum: [
            { required: true, message: '收支金额不能为空', trigger: 'blur' }
          ],
          accountType: [
            { required: true, message: '支出类型不能为空', trigger: 'blur' }
          ],
          accountTypeName: [
            { required: true, message: '支出类型名称不能为空', trigger: 'blur' }
          ],
          accountAddDateTime: [
            { required: true, message: '账号收支添加时间不能为空', trigger: 'blur' }
          ],
          createDateTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/finance/account/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.contractNo = data.projectaccount.contractNo
                this.dataForm.accountNote = data.projectaccount.accountNote
                this.dataForm.accountNum = data.projectaccount.accountNum
                this.dataForm.accountType = data.projectaccount.accountType
                this.dataForm.accountTypeName = data.projectaccount.accountTypeName
                this.dataForm.accountAddDateTime = data.projectaccount.accountAddDateTime
                this.dataForm.createDateTime = data.projectaccount.createDateTime
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
              url: this.$http.adornUrl(`/finance/account/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'contractNo': this.dataForm.contractNo,
                'accountNote': this.dataForm.accountNote,
                'accountNum': this.dataForm.accountNum,
                'accountType': this.dataForm.accountType,
                'accountTypeName': this.dataForm.accountTypeName,
                'accountAddDateTime': this.dataForm.accountAddDateTime,
                'createDateTime': this.dataForm.createDateTime
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
