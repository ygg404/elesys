<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="目标级别" prop="rank">
        <el-radio-group  v-model="dataForm.rank" style="margin-left: 10px;">
          <el-radio :label="1" >一级</el-radio>
          <el-radio :label="2" >二级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="一级目标" v-if="dataForm.rank === 2" prop="parentId">
        <el-select v-model="dataForm.parentId" placeholder="请选择一级目标">
          <el-option
            v-for="item in firstList"
            :key="item.id"
            :label="item.accessName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标名称" prop="accessName">
        <el-input v-model="dataForm.accessName" placeholder="目标名称"></el-input>
      </el-form-item>
      <el-form-item label="目标分数" prop="accessScore" v-if="dataForm.rank === 2">
        <el-input-number v-model="dataForm.accessScore"  :min="0" :max="20" label="目标分数"></el-input-number>
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
      var validateParent = (rule, value, callback) => {
        if (this.dataForm.rank === 2 && !/\S/.test(value)) {
          callback(new Error('所属一级目标不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        firstList: [],
        dataForm: {
          id: 0,
          parentId: '',
          rank: 1,
          accessName: '',
          accessScore: ''
        },
        dataRule: {
          parentId: [
            { validator: validateParent, trigger: 'blur' }
          ],
          accessName: [
            { required: true, message: '目标名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.getFirstLevel()
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/ren/access/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.access.parentId !== 0) {
                  this.dataForm.rank = 2
                  this.dataForm.parentId = data.access.parentId
                }
                this.dataForm.accessName = data.access.accessName
                this.dataForm.accessScore = data.access.accessScore
              }
            })
          }
        })
      },
      // 获取所有一级目标列表
      getFirstLevel () {
        this.$http({
          url: this.$http.adornUrl('/ren/access/list'),
          method: 'get',
          params: this.$http.adornParams({
            'parentId': 0
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.firstList = data.list
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/ren/access/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'parentId': this.dataForm.rank === 1 ? 0 : this.dataForm.parentId,
                'accessName': this.dataForm.accessName,
                'accessScore': this.dataForm.accessScore
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
