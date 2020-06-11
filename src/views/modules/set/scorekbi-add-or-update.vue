<template>
  <el-dialog
    title="编辑"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
      <el-form-item label="职务" prop="dutyName">
        <span>{{dataForm.dutyName}}</span>
      </el-form-item>
      <el-form-item label="基准分" prop="standardScore">
        <el-input v-model="dataForm.standardScore" type="number" placeholder="效能基准分"></el-input>
      </el-form-item>
      <el-form-item label="未考核时基准分" prop="noassessScore">
        <el-input v-model="dataForm.noassessScore" type="number" placeholder="未考核基准分"></el-input>
      </el-form-item>
      <el-form-item label="试用期基准分" prop="trialScore">
        <el-input v-model="dataForm.trialScore" type="number" placeholder="试用期基准分"></el-input>
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
          dutyId: 0,
          dutyName: '',
          standardScore: '',
          noassessScore: '',
          trialScore: ''
        },
        dataRule: {
          standardScore: [
            { required: true, message: '效能基准分不能为空', trigger: 'blur' }
          ],
          noassessScore: [
            { required: true, message: '未考核时基准分不能为空', trigger: 'blur' }
          ],
          trialScore: [
            { required: true, message: '试用期基准分不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.dutyId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.dutyId) {
            this.$http({
              url: this.$http.adornUrl(`/set/scorekbi/info/${this.dataForm.dutyId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dutyName = data.setScoreKbi.dutyName
                this.dataForm.standardScore = data.setScoreKbi.standardScore
                this.dataForm.noassessScore = data.setScoreKbi.noassessScore
                this.dataForm.trialScore = data.setScoreKbi.trialScore
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
              url: this.$http.adornUrl(`/set/scorekbi/save`),
              method: 'post',
              data: this.$http.adornData({
                'dutyId': this.dataForm.dutyId || undefined,
                'standardScore': this.dataForm.standardScore,
                'noassessScore': this.dataForm.noassessScore,
                'trialScore': this.dataForm.trialScore
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
