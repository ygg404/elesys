<template>
  <el-dialog
    title="新增进度"
    :close-on-click-modal="false"
    width="50%"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px;">
      <el-form-item label="项目编号" prop="projectNo">
        <el-input v-model="dataForm.projectNo" placeholder="项目编号" disabled ></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectNo">
        <el-input v-model="dataForm.projectName" placeholder="项目名称" disabled ></el-input>
      </el-form-item>
      <el-form-item label="进度百分比" prop="scheduleRate">
        <el-slider v-model="dataForm.scheduleRate" show-input style="width: 100%;margin-top: 30px;" @change="sliderChangeHandle"></el-slider>
      </el-form-item>
      <el-form-item label="进度内容" prop="scheduleNote">
        <el-input type="textarea" maxlength="1000" size="large" show-word-limit rows="4" v-model="dataForm.scheduleNote" placeholder="进度内容"></el-input>
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
          projectName: '',
          scheduleNote: '',
          scheduleRate: '',
          createTime: ''
        },
        dataRule: {
          projectNo: [
            { required: true, message: '项目编号不能为空', trigger: 'blur' }
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
          console.log(item)
          this.dataForm.projectNo = item.projectNo
          this.dataForm.projectName = item.projectName
          this.dataForm.scheduleNote = ''
          this.dataForm.scheduleRate = item.scheduleRate !== null ? item.scheduleRate : 0
        })
      },
      // 进度改变
      sliderChangeHandle () {
        if (this.dataForm.scheduleRate > 90) {
          this.$message.error('作业进度不得超过90%')
          this.dataForm.scheduleRate = 90
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.scheduleRate > 90) {
              this.$message.error('作业进度不得超过90%')
              this.dataForm.scheduleRate = 90
              return
            }
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
