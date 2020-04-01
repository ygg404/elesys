<template>
  <el-dialog
    :title="设置工资"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="姓名：" prop="username">
        <span> {{dataForm.username}} </span>
      </el-form-item>
      <el-form-item label="基本工资：" prop="baseSalary">
        <el-input v-model="dataForm.baseSalary" placeholder="基本工资" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="职务工资：" prop="workSalary">
        <el-input v-model="dataForm.workSalary" placeholder="职务工资" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="职称工资：" prop="titleSalary">
        <el-input v-model="dataForm.titleSalary" placeholder="职称工资" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="住房补贴：" prop="housingSalary">
        <el-input v-model="dataForm.housingSalary" placeholder="住房补贴" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="电脑补贴：" prop="pcSalary">
        <el-input v-model="dataForm.pcSalary" placeholder="电脑补贴" type="number" min="0"></el-input>
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
          userId: 0,
          username: '',
          baseSalary: '',
          workSalary: '',
          titleSalary: '',
          housingSalary: '',
          pcSalary: '',
          mealSalary: '',
          socialSalary: ''
        },
        dataRule: {
          baseSalary: [
            { required: true, message: '基本工资不能为空', trigger: 'blur' }
          ],
          workSalary: [
            { required: true, message: '职务工资不能为空', trigger: 'blur' }
          ],
          titleSalary: [
            { required: true, message: '职称工资不能为空', trigger: 'blur' }
          ],
          housingSalary: [
            { required: true, message: '住房补贴不能为空', trigger: 'blur' }
          ],
          pcSalary: [
            { required: true, message: '电脑补贴不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.dataForm.userId = item.userId
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/ren/salaryset/info/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.username = data.username
                if (data.salarySet != null) {
                  this.dataForm.baseSalary = data.salarySet.baseSalary
                  this.dataForm.workSalary = data.salarySet.workSalary
                  this.dataForm.titleSalary = data.salarySet.titleSalary
                  this.dataForm.housingSalary = data.salarySet.housingSalary
                  this.dataForm.pcSalary = data.salarySet.pcSalary
                  this.dataForm.mealSalary = data.salarySet.mealSalary
                  this.dataForm.socialSalary = data.salarySet.socialSalary
                }
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
              url: this.$http.adornUrl(`/ren/salaryset/save`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId,
                'baseSalary': this.dataForm.baseSalary,
                'workSalary': this.dataForm.workSalary,
                'titleSalary': this.dataForm.titleSalary,
                'housingSalary': this.dataForm.housingSalary,
                'pcSalary': this.dataForm.pcSalary,
                'mealSalary': this.dataForm.mealSalary
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
