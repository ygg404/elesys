<template>
  <el-dialog
    :title="!dataForm.id ? '新增合同' : '修改合同'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px" style="text-align: left;">
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="dataForm.contractName" placeholder="合同名称"></el-input>
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model="dataForm.contractNo" placeholder="合同编号" disabled="true"></el-input>
       </el-form-item>
       <el-form-item label="项目类型" prop="projectType">
         <el-input v-model="dataForm.projectType" placeholder="项目类型"></el-input>
       </el-form-item>
      <el-form-item label="合同金额" prop="contractMoney" >
        <el-input v-model.number="dataForm.contractMoney" placeholder="合同金额" type="number"></el-input>
      </el-form-item>
        <el-form-item label="合同类型:" prop="contractType">
          <el-radio-group v-model="dataForm.contractType">
            <el-radio :label="0">合同委托</el-radio>
            <el-radio :label="1">一般委托</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="委托单位" prop="contractAuthorize">
          <el-input v-model="dataForm.contractAuthorize" placeholder="合同委托单位"></el-input>
        </el-form-item>
        <el-form-item label="委托要求" prop="contractNote">
          <el-input v-model="dataForm.contractNote" placeholder="合同内容"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="userPhone">
          <el-input v-model="dataForm.userPhone" placeholder="联系人电话" ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="联系人名称"></el-input>
        </el-form-item>
      <el-form-item label="业务负责人" prop="contractBusiness">
        <el-input v-model="dataForm.contractBusiness" placeholder="业务负责人"></el-input>
      </el-form-item>
        <el-form-item label="合同签订时间" prop="contractAddTime">
          <el-date-picker v-model="dataForm.contractAddTime" type="date" value-format="yyyy-MM-dd" placeholder="合同添加时间" style="width: 150px;" @change="getDataList"></el-date-picker>
        </el-form-item>
      <el-form-item label="文件名称" prop="fileName">
        <el-upload :action="upContractUrl"
                   :data="{'contractNo': dataForm.contractNo}"
                   :limit="1"
                   name="file"
                   accept=".pdf"
                   :headers="tokenHeaders"
                   :before-upload="handleBeforeUpload"
                   :on-success="handleSuccess"
                   :on-error="handleError"
                   :file-list="dataForm.fileName">
          <el-button size="small" plain>选择文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10M</div>
        </el-upload>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {isMobile} from '../../../utils/validate'
  import {isPhone} from '../../../utils/validate'

  export default {
    data () {
      let checkPhone = (rule, value, callback) => {
        if (!value) {
          callback();
        } else {
          if (isMobile(value) || isPhone(value) ) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
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
            { required: true, message: '合同签订时间不能为空', trigger: 'blur' }
          ],
          contractCreateTime: [
            { required: true, message: '合同创建时间不能为空', trigger: 'blur' }
          ],
          contractAuthorize: [
            { required: true, message: '委托单位不能为空', trigger: 'blur' }
          ],
          contractName: [
            { required: true, message: '合同名称不能为空', trigger: 'blur' }
          ],
          contractType: [
            { required: true, message: '合同类型 不能为空', trigger: 'blur' }
          ],
          contractNote: [
            { required: true, message: '合同内容不能为空', trigger: 'blur' }
          ],
          contractBusiness: [
            { required: true, message: '业务负责人不能为空', trigger: 'blur' }
          ],
          contractMoney: [
            { required: true, message: '合同金额不能为空', trigger: 'blur' }
          ],
          projectType: [
            { required: true, message: '项目类型不能为空', trigger: 'blur' }
          ],
          userPhone: [
            { required: false, message: '联系人电话不正确', trigger: 'blur', validator: checkPhone }
          ],
          userName: [
            { required: false, message: '联系人名称不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/project/contract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.contractNo = data.projectContract.contractNo
                this.dataForm.contractAddTime = data.projectContract.contractAddTime
                this.dataForm.contractCreateTime = data.projectContract.contractCreateTime
                this.dataForm.contractAuthorize = data.projectContract.contractAuthorize
                this.dataForm.contractName = data.projectContract.contractName
                this.dataForm.contractType = data.projectContract.contractType
                this.dataForm.contractNote = data.projectContract.contractNote
                this.dataForm.contractBusiness = data.projectContract.contractBusiness
                this.dataForm.contractStage = data.projectContract.contractStage
                this.dataForm.contractMoney = data.projectContract.contractMoney
                this.dataForm.projectType = data.projectContract.projectType
                this.dataForm.filename = data.projectContract.filename
                this.dataForm.userPhone = data.projectContract.userPhone
                this.dataForm.userName = data.projectContract.userName
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
