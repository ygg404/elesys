<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
      <el-form-item label="类别" prop="cateid">
        <el-radio-group v-model="dataForm.cateid">
          <el-radio :label="1">职称等级</el-radio>
          <el-radio :label="2">职称专业系数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职称名称" prop="jobTitle">
        <el-input v-model="dataForm.jobTitle" placeholder="职称名称"></el-input>
      </el-form-item>
      <el-form-item label="分数" prop="score">
        <el-input v-model="dataForm.score" type="number" placeholder="分数"></el-input>
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
          jobTitle: '',
          score: '',
          orderNum: '',
          cateid: ''
        },
        dataRule: {
          cateid: [
            { required: true, message: '类别不能为空', trigger: 'blur' }
          ],
          jobTitle: [
            { required: true, message: '职称名称不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/set/scoretitle/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.cateid = data.renScoreTitle.cateid
                this.dataForm.jobTitle = data.renScoreTitle.jobTitle
                this.dataForm.score = data.renScoreTitle.score
                this.dataForm.orderNum = data.renScoreTitle.orderNum
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
              url: this.$http.adornUrl(`/set/scoretitle/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'jobTitle': this.dataForm.jobTitle,
                'score': this.dataForm.score,
                'cateid': this.dataForm.cateid,
                'orderNum': this.dataForm.orderNum
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
