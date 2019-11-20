<template>
  <el-dialog
    title="新增进度"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px;">
      <el-form-item label="项目编号" prop="projectNo">
        <el-input v-model="dataForm.projectNo" placeholder="项目编号" disabled></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectNo">
        <el-input v-model="dataForm.projectName" placeholder="项目名称" disabled></el-input>
      </el-form-item>
      <el-form-item label="进度百分比" prop="scheduleRate">
        <el-input v-model="dataForm.scheduleRate" placeholder="进度百分比"></el-input>
      </el-form-item>
      <el-form-item label="进度内容" prop="scheduleNote">
        <el-input type="textarea" maxlength="1000" size="large" show-word-limit rows="4" v-model="dataForm.scheduleNote" placeholder="进度内容" ></el-input>
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
          projectNo: '',
          scheduleNote: '',
          scheduleRate: '',
          createTime: ''
        },
        dataRule: {
          projectNo: [
            { required: true, message: '项目编号不能为空', trigger: 'blur' }
          ],
          scheduleNote: [
            { required: true, message: '进度内容不能为空', trigger: 'blur' }
          ],
          scheduleRate: [
            { required: true, message: '进度百分比不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.$nextTick(() => {
          this.dataForm.projectNo = item.projectNo
          this.dataForm.scheduleNote = item.scheduleNote
          this.dataForm.scheduleRate = item.scheduleRate
          this.dataForm.createTime = item.createTime
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/schedule/save`),
              method: 'post',
              data: this.$http.adornData({
                'projectNo': this.dataForm.projectNo,
                'scheduleNote': this.dataForm.scheduleNote,
                'scheduleRate': this.dataForm.scheduleRate
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
