<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="职称">
        <span style="color: #3b97d7">{{dataForm.titleName}}</span>
      </el-form-item>
      <el-form-item label="效能分基准分" prop="standardScore">
        <el-input v-model="dataForm.standardScore" placeholder="效能分" type="number"></el-input>
      </el-form-item>
      <el-form-item label="未考核效能分" prop="assessnoScore">
        <el-input v-model="dataForm.assessnoScore" placeholder="未考核效能分" type="number"></el-input>
      </el-form-item>
      <el-form-item label="试用期效能分" prop="trialScore">
        <el-input v-model="dataForm.trialScore" placeholder="试用期效能分" type="number"></el-input>
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
          titleId: 0,
          standardScore: '',
          assessnoScore: '',
          trialScore: '',
          titleName: ''
        },
        dataRule: {
          standardScore: [
            { required: true, message: '效能分不能为空', trigger: 'blur' }
          ],
          assessnoScore: [
            { required: true, message: '未考核效能分不能为空', trigger: 'blur' }
          ],
          trialScore: [
            { required: true, message: '试用期效能分不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.titleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.titleId) {
            this.$http({
              url: this.$http.adornUrl(`/set/scorekbititle/info/${this.dataForm.titleId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.titleName = data.scoreKbiTitle.titleName
                this.dataForm.standardScore = data.scoreKbiTitle.standardScore
                this.dataForm.assessnoScore = data.scoreKbiTitle.assessnoScore
                this.dataForm.trialScore = data.scoreKbiTitle.trialScore
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
              url: this.$http.adornUrl(`/set/scorekbititle/save`),
              method: 'post',
              data: this.$http.adornData({
                'titleId': this.dataForm.titleId || undefined,
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
