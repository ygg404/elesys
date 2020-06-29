<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="职务">
        <span style="color: #3b97d7">{{dataForm.dutyName}}</span>
      </el-form-item>
    <el-form-item label="基准分" prop="standardScore">
      <el-input v-model="dataForm.standardScore" placeholder="基准分" type="number"></el-input>
    </el-form-item>
    <el-form-item label="未考核时基准分" prop="assessnoScore">
      <el-input v-model="dataForm.assessnoScore" placeholder="未考核时基准分" type="number"></el-input>
    </el-form-item>
    <el-form-item label="试用期基准分" prop="trialScore">
      <el-input v-model="dataForm.trialScore" placeholder="试用期基准分" type="number"></el-input>
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
          assessnoScore: '',
          trialScore: ''
        },
        dataRule: {
          standardScore: [
            { required: true, message: '基准分不能为空', trigger: 'blur' }
          ],
          assessnoScore: [
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
              url: this.$http.adornUrl(`/set/scorekbiduty/info/${this.dataForm.dutyId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dutyName = data.scoreKbiDuty.dutyName
                this.dataForm.standardScore = data.scoreKbiDuty.standardScore
                this.dataForm.assessnoScore = data.scoreKbiDuty.assessnoScore
                this.dataForm.trialScore = data.scoreKbiDuty.trialScore
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
              url: this.$http.adornUrl(`/set/scorekbiduty/save`),
              method: 'post',
              data: this.$http.adornData({
                'dutyId': this.dataForm.dutyId || undefined,
                'standardScore': this.dataForm.standardScore,
                'assessnoScore': this.dataForm.assessnoScore,
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
