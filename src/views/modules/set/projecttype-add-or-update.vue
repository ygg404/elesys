<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="类型名称"></el-input>
      </el-form-item>
      <el-form-item label="点位中误差" prop="errorPoint">
        <el-input v-model="dataForm.errorPoint" placeholder="点位中误差" type="number"></el-input>
      </el-form-item>
      <el-form-item label="间距中误差" prop="errorSpace">
        <el-input v-model="dataForm.errorSpace" placeholder="间距中误差" type="number"></el-input>
      </el-form-item>
      <el-form-item label="高程中误差" prop="errorHeigh">
        <el-input v-model="dataForm.errorHeigh" placeholder="高程中误差" type="number"></el-input>
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
          name: '',
          nameCode: '',
          errorPoint: '',
          errorSpace: '',
          errorHeigh: ''
        },
        dataRule: {
          name: [
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ],
          nameCode: [
            {required: true, message: '内容代码不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/set/projecttype/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.projectType.name
                this.dataForm.errorPoint = data.projectType.errorPoint
                this.dataForm.errorSpace = data.projectType.errorSpace
                this.dataForm.errorHeigh = data.projectType.errorHeigh
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
              url: this.$http.adornUrl(`/set/projecttype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'nameCode': this.dataForm.nameCode,
                'errorPoint': this.dataForm.errorPoint,
                'errorSpace': this.dataForm.errorSpace,
                'errorHeigh': this.dataForm.errorHeigh
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message.error(data.msg)
              }
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        })
      }
    }
  }
</script>
