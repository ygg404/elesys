<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="图层名称:" prop="projectName">
        <el-input v-model="dataForm.label" placeholder="图层名称"></el-input>
      </el-form-item>
      <el-form-item label="创建用户名:" prop="createUserName">
        <span>{{this.dataForm.createUserName}}</span>
      </el-form-item>
      <el-form-item label="创建时间:" prop="createTime">
        <span> {{this.dataForm.createTime}}</span>
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
          label: '',
          createUserId: '',
          createUserName: '',
          createTime: '',
          type: 0,
          parentId: 0
        },
        dataRule: {
          labelName: [
            { required: true, message: '图层名称不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '父类图层不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.dataForm.id = item.id || 0
        this.dataForm.parentId = item.parentId || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/dop/bmap/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.label = data.dopBmap.label
                this.dataForm.parentId = data.dopBmap.parentId
                this.dataForm.createUserId = data.dopBmap.createUserId
                this.dataForm.createUserName = data.dopBmap.createUserName
                this.dataForm.createTime = data.dopBmap.createTime
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
              url: this.$http.adornUrl(`/dop/bmap/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'dopBmapEntity': this.dataForm
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
