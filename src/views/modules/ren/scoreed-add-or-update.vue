<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="类别" prop="cateid">
        <el-radio-group v-model="dataForm.cateid">
          <el-radio :label="1">学制系数</el-radio>
          <el-radio :label="2">专业系数</el-radio>
          <el-radio :label="3">学历系数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="对应项" prop="scoreName">
        <el-input v-model="dataForm.scoreName" placeholder="对应项名称"></el-input>
      </el-form-item>
      <el-form-item label="分数" prop="score">
        <el-input v-model="dataForm.score" placeholder="分数" type="number"></el-input>
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
          scoreName: '',
          cateid: '',
          score: '',
          orderNum: ''
        },
        dataRule: {
          scoreName: [
            { required: true, message: '对应项名称不能为空', trigger: 'blur' }
          ],
          cateid: [
            { required: true, message: '类别（1-学制；2-专业；3-学历）不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '顺序号不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/ren/scoreed/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.scoreName = data.renScoreEd.scoreName
                this.dataForm.cateid = data.renScoreEd.cateid
                this.dataForm.score = data.renScoreEd.score
                this.dataForm.orderNum = data.renScoreEd.orderNum
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
              url: this.$http.adornUrl(`/ren/scoreed/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'scoreName': this.dataForm.scoreName,
                'cateid': this.dataForm.cateid,
                'score': this.dataForm.score,
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
