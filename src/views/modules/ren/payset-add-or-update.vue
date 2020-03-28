<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="基本工资" prop="baseSalary">
        <el-input v-model="dataForm.baseSalary" placeholder="基本工资"></el-input>
      </el-form-item>
      <el-form-item label="职务工资" prop="workSalary">
        <el-input v-model="dataForm.workSalary" placeholder="职务工资" type="number"></el-input>
      </el-form-item>
      <el-form-item label="职称工资" prop="titleSalary">
        <el-input v-model="dataForm.titleSalary" placeholder="职称工资" type="number"></el-input>
      </el-form-item>
      <el-form-item label="住房补贴" prop="housingSalary">
        <el-input v-model="dataForm.housingSalary" placeholder="住房补贴" type="number"></el-input>
      </el-form-item>
      <el-form-item label="电脑补贴" prop="pcSalary">
        <el-input v-model="dataForm.pcSalary" placeholder="电脑补贴" type="number"></el-input>
      </el-form-item>
      <el-form-item label="餐补贴" prop="mealSalary">
        <el-input v-model="dataForm.mealSalary" placeholder="餐补贴" type="number"></el-input>
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
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
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
          ],
          mealSalary: [
            { required: true, message: '餐补贴不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.userId = id || 0
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
                this.dataForm.username = data.rensalaryset.username
                this.dataForm.baseSalary = data.rensalaryset.baseSalary
                this.dataForm.workSalary = data.rensalaryset.workSalary
                this.dataForm.titleSalary = data.rensalaryset.titleSalary
                this.dataForm.housingSalary = data.rensalaryset.housingSalary
                this.dataForm.pcSalary = data.rensalaryset.pcSalary
                this.dataForm.mealSalary = data.rensalaryset.mealSalary
                this.dataForm.socialSalary = data.rensalaryset.socialSalary
                this.dataForm.createDate = data.rensalaryset.createDate
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
              url: this.$http.adornUrl(`/ren/rensalaryset/${!this.dataForm.userId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId || undefined,
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
