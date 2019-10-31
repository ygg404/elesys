<template>
  <el-dialog
    :title="!dataForm.id ? '新增快捷短语' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
     <el-form-item label="短语类型" prop="shortcutTypeId">
      <el-select v-model="dataForm.shortcutTypeId" placeholder="请选择短语类型" clearable="true">
        <el-option
          v-for="item in shortTypeList"
          :key="item.id"
          :label="item.typeName"
          :value="item.id">
        </el-option>
      </el-select>
     </el-form-item>
      <el-form-item label="短语内容" prop="shortcutNote">
        <el-input v-model="dataForm.shortcutNote" placeholder="短语内容"></el-input>
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
          shortcutName: '',
          shortcutNote: '',
          shortcutTypeId: ''
        },
        value: '',
        dataRule: {
          shortcutName: [
            { required: true, message: '短语类型不能为空', trigger: 'blur' }
          ],
          shortcutNote: [
            { required: true, message: '短语内容不能为空', trigger: 'blur' }
          ],
          shortcutTypeId: [
            { required: true, message: '短语类型Id不能为空', trigger: 'blur' }
          ]
        },
        shortTypeList: []
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
              url: this.$http.adornUrl(`/set/wpshortcut/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.shortcutName = data.wpShortcut.shortcutName
                this.dataForm.shortcutNote = data.wpShortcut.shortcutNote
                this.dataForm.shortcutTypeId = data.wpShortcut.shortcutTypeId
              }
            })
          }
          this.getShortTypeList()
        })
      },
      // 获取短语类型列表
      getShortTypeList () {
        this.$http({
          url: this.$http.adornUrl('/set/shorttype/list'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.shortTypeList = data.list
          } else {
            this.dataList = []
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.shortcutName = this.shortTypeList.find(item => item.id === this.dataForm.shortcutTypeId)['typeName']
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/wpshortcut/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'shortcutName': this.dataForm.shortcutName,
                'shortcutNote': this.dataForm.shortcutNote,
                'shortcutTypeId': this.dataForm.shortcutTypeId
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
