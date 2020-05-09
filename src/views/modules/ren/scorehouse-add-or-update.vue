<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
      <el-form-item label="分数下限" prop="lowScore">
        <el-input v-model="dataForm.lowScore" type="number" placeholder="分数下限"></el-input>
      </el-form-item>
      <el-form-item label="分数上限" prop="highScore">
        <el-input v-model="dataForm.highScore" type="number" placeholder="分数上限"></el-input>
      </el-form-item>
      <el-form-item label="职级名称" prop="jobRank">
        <el-input v-model="dataForm.jobRank" placeholder="职级名称"></el-input>
      </el-form-item>
      <el-form-item label="住房补贴" prop="houseAdd">
        <el-input v-model="dataForm.houseAdd" type="number" placeholder="住房补贴"></el-input>
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
          lowScore: '',
          highScore: '',
          jobRank: '',
          houseAdd: '',
          orderNum: ''
        },
        dataRule: {
          lowScore: [
            { required: true, message: '分数下限不能为空', trigger: 'blur' }
          ],
          highScore: [
            { required: true, message: '分数上限不能为空', trigger: 'blur' }
          ],
          jobRank: [
            { required: true, message: '职级名称不能为空', trigger: 'blur' }
          ],
          houseAdd: [
            { required: true, message: '住房补贴不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/ren/scorehouse/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.lowScore = data.renScoreHouse.lowScore
                this.dataForm.highScore = data.renScoreHouse.highScore
                this.dataForm.jobRank = data.renScoreHouse.jobRank
                this.dataForm.houseAdd = data.renScoreHouse.houseAdd
                this.dataForm.orderNum = data.renScoreHouse.orderNum
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
              url: this.$http.adornUrl(`/ren/scorehouse/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'lowScore': this.dataForm.lowScore,
                'highScore': this.dataForm.highScore,
                'jobRank': this.dataForm.jobRank,
                'houseAdd': this.dataForm.houseAdd,
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
