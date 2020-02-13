<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用户id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="startDate">
      <el-input v-model="dataForm.startDate" placeholder="开始时间"></el-input>
    </el-form-item>
    <el-form-item label="结束时间" prop="endDate">
      <el-input v-model="dataForm.endDate" placeholder="结束时间"></el-input>
    </el-form-item>
    <el-form-item label="公司" prop="company">
      <el-input v-model="dataForm.company" placeholder="公司"></el-input>
    </el-form-item>
    <el-form-item label="职位" prop="jobPosition">
      <el-input v-model="dataForm.jobPosition" placeholder="职位"></el-input>
    </el-form-item>
    <el-form-item label="工作描述" prop="jobDescription">
      <el-input v-model="dataForm.jobDescription" placeholder="工作描述"></el-input>
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
          userId: '',
          startDate: '',
          endDate: '',
          company: '',
          jobPosition: '',
          jobDescription: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ],
          company: [
            { required: true, message: '公司不能为空', trigger: 'blur' }
          ],
          jobPosition: [
            { required: true, message: '职位不能为空', trigger: 'blur' }
          ],
          jobDescription: [
            { required: true, message: '工作描述不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/ren/renrecordwork/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.renrecordwork.userId
                this.dataForm.startDate = data.renrecordwork.startDate
                this.dataForm.endDate = data.renrecordwork.endDate
                this.dataForm.company = data.renrecordwork.company
                this.dataForm.jobPosition = data.renrecordwork.jobPosition
                this.dataForm.jobDescription = data.renrecordwork.jobDescription
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
              url: this.$http.adornUrl(`/ren/renrecordwork/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userId': this.dataForm.userId,
                'startDate': this.dataForm.startDate,
                'endDate': this.dataForm.endDate,
                'company': this.dataForm.company,
                'jobPosition': this.dataForm.jobPosition,
                'jobDescription': this.dataForm.jobDescription
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
