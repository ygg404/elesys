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
    <el-form-item label="学历" prop="educationBackground">
      <el-input v-model="dataForm.educationBackground" placeholder="学历"></el-input>
    </el-form-item>
    <el-form-item label="毕业院校" prop="educationSchool">
      <el-input v-model="dataForm.educationSchool" placeholder="毕业院校"></el-input>
    </el-form-item>
    <el-form-item label="专业" prop="major">
      <el-input v-model="dataForm.major" placeholder="专业"></el-input>
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
          educationBackground: '',
          educationSchool: '',
          major: ''
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
          educationBackground: [
            { required: true, message: '学历不能为空', trigger: 'blur' }
          ],
          educationSchool: [
            { required: true, message: '毕业院校不能为空', trigger: 'blur' }
          ],
          major: [
            { required: true, message: '专业不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/ren/recordeducation/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.renrecordeducation.userId
                this.dataForm.startDate = data.renrecordeducation.startDate
                this.dataForm.endDate = data.renrecordeducation.endDate
                this.dataForm.educationBackground = data.renrecordeducation.educationBackground
                this.dataForm.educationSchool = data.renrecordeducation.educationSchool
                this.dataForm.major = data.renrecordeducation.major
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
              url: this.$http.adornUrl(`/ren/recordeducation/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userId': this.dataForm.userId,
                'startDate': this.dataForm.startDate,
                'endDate': this.dataForm.endDate,
                'educationBackground': this.dataForm.educationBackground,
                'educationSchool': this.dataForm.educationSchool,
                'major': this.dataForm.major
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
