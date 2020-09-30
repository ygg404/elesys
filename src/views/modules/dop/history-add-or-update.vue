<template>
  <el-dialog :id="dataForm.deviceId"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="仪器Id" prop="deviceId">
        <el-input v-model="dataForm.deviceId" placeholder="仪器Id"></el-input>
      </el-form-item>
      <el-form-item label="仪器名称" prop="deviceName">
        <el-input v-model="dataForm.deviceName" placeholder="仪器名称"></el-input>
      </el-form-item>
      <el-form-item label="借物人Id" prop="borrowerId">
        <el-input v-model="dataForm.borrowerId" placeholder="借物人Id"></el-input>
      </el-form-item>
      <el-form-item label="借物人名称" prop="borrowerName">
        <el-input v-model="dataForm.borrowerName" placeholder="借物人名称"></el-input>
      </el-form-item>
      <el-form-item label="出借人Id" prop="lenderId">
        <el-input v-model="dataForm.lenderId" placeholder="出借人Id"></el-input>
      </el-form-item>
      <el-form-item label="出借人名称" prop="lenderName">
        <el-input v-model="dataForm.lenderName" placeholder="出借人名称"></el-input>
      </el-form-item>
      <el-form-item label="预借天数" prop="lendDays">
        <el-input v-model="dataForm.lendDays" placeholder="预借天数" type="number"></el-input>
      </el-form-item>
      <el-form-item label="出借情况（1-已出借；2-已归还）" prop="rentStatus">
        <el-input v-model="dataForm.rentStatus" placeholder="出借情况（1-已出借；2-已归还）"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
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
          deviceId: '',
          deviceName: '',
          borrowerId: '',
          borrowerName: '',
          lenderId: '',
          lenderName: '',
          lendDays: '',
          rentStatus: '',
          remark: '',
          createTime: ''
        },
        dataRule: {
          deviceId: [
            { required: true, message: '仪器Id不能为空', trigger: 'blur' }
          ],
          borrowerId: [
            { required: true, message: '借物人Id不能为空', trigger: 'blur' }
          ],
          borrowerName: [
            { required: true, message: '借物人名称不能为空', trigger: 'blur' }
          ],
          lenderId: [
            { required: true, message: '出借人Id不能为空', trigger: 'blur' }
          ],
          lenderName: [
            { required: true, message: '出借人名称不能为空', trigger: 'blur' }
          ],
          rentStatus: [
            { required: true, message: '出借情况（已出借；已归还）不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.dataForm.deviceId = item.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.deviceId) {
          //   this.$http({
          //     url: this.$http.adornUrl(`/dop/history/info/${this.dataForm.id}`),
          //     method: 'get',
          //     params: this.$http.adornParams()
          //   }).then(({data}) => {
          //     if (data && data.code === 0) {
          //       this.dataForm.deviceId = data.dophistory.deviceId
          //       this.dataForm.borrowerId = data.dophistory.borrowerId
          //       this.dataForm.borrowerName = data.dophistory.borrowerName
          //       this.dataForm.lenderId = data.dophistory.lenderId
          //       this.dataForm.lenderName = data.dophistory.lenderName
          //       this.dataForm.lendDays = data.dophistory.lendDays
          //       this.dataForm.rentStatus = data.dophistory.rentStatus
          //       this.dataForm.remark = data.dophistory.remark
          //       this.dataForm.createTime = data.dophistory.createTime
          //     }
          //   })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/dophistory/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deviceId': this.dataForm.deviceId,
                'borrowerId': this.dataForm.borrowerId,
                'borrowerName': this.dataForm.borrowerName,
                'lenderId': this.dataForm.lenderId,
                'lenderName': this.dataForm.lenderName,
                'lendDays': this.dataForm.lendDays,
                'rentStatus': this.dataForm.rentStatus,
                'remark': this.dataForm.remark,
                'createTime': this.dataForm.createTime
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
