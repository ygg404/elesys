<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="用户名:" prop="accessId">{{dataForm.username}}</el-form-item>
      <el-form-item label="考核目标:" prop="accessId">
        <el-cascader style="width:100%;"
          placeholder="请选择考核目标"
          :options="accessList"
          :props="{label: 'accessName',value:'id', multiple: true }"
                     v-model="accessValue" filterable></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        accessList: [],
        accessValue: [],
        dataForm: {
          id: 0,
          userId: '',
          username: '',
          accessId: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '用户Id不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.dataForm.userId = item.userId || 0
        this.dataForm.username = item.username
        this.getAccessList().then(success => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.userId) {
              this.$http({
                url: this.$http.adornUrl(`/ren/accessuser/info/${item.userId}`),
                method: 'get',
                params: this.$http.adornParams({})
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.accessValue = []
                  let auIdlist = []
                  for (let accessUser of data.accessUserList) {
                    auIdlist.push(accessUser.accessId)
                  }
                  for (let access of this.accessList) {
                    for (let child of access.children) {
                      if (auIdlist.indexOf(child.id) !== -1) {
                        this.accessValue.push([ access.id , child.id ])
                      }
                    }
                  }
                  console.log(this.accessValue)
                }
              })
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          let accessIdList = []
          for (let aVal of this.accessValue) {
            accessIdList.push(aVal[1])
          }
          console.log(accessIdList)
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/ren/accessuser/save`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId,
                'accessIdList': accessIdList
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
      },
      // 获取目标列表
      getAccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/access/list`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.accessList = treeDataTranslate(data.list)
              resolve(this.accessList)
            } else {
              this.$message(data.msg)
              reject(data.msg)
            }
          })
        })
      }
    }
  }
</script>
