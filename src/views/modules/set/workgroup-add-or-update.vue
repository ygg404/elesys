<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="作业组名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="作业组名称"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="orderNum">
      <el-input v-model="dataForm.orderNum" placeholder="排序号"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="队长名称" prop="headMan">
      <el-input v-model="dataForm.headMan" placeholder="队长名称"></el-input>
    </el-form-item>
    <el-form-item label="副队长名称" prop="deputyLeader">
      <el-input v-model="dataForm.deputyLeader" placeholder="副队长名称"></el-input>
    </el-form-item>
    <el-form-item label="队长id" prop="headId">
      <el-input v-model="dataForm.headId" placeholder="队长id"></el-input>
    </el-form-item>
    <el-form-item label="副队长id" prop="deputyId">
      <el-input v-model="dataForm.deputyId" placeholder="副队长id"></el-input>
    </el-form-item>
    <el-form-item label="部门父id" prop="pId">
      <el-input v-model="dataForm.pId" placeholder="部门父id"></el-input>
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
          name: '',
          orderNum: '',
          createTime: '',
          headMan: '',
          deputyLeader: '',
          headId: '',
          deputyId: '',
          pId: ''
        },
        dataRule: {
          name: [
            { required: true, message: '作业组名称不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          headMan: [
            { required: true, message: '队长名称不能为空', trigger: 'blur' }
          ],
          deputyLeader: [
            { required: true, message: '副队长名称不能为空', trigger: 'blur' }
          ],
          headId: [
            { required: true, message: '队长id不能为空', trigger: 'blur' }
          ],
          deputyId: [
            { required: true, message: '副队长id不能为空', trigger: 'blur' }
          ],
          pId: [
            { required: true, message: '部门父id不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/set/workgroup/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.workgroup.name
                this.dataForm.orderNum = data.workgroup.orderNum
                this.dataForm.createTime = data.workgroup.createTime
                this.dataForm.headMan = data.workgroup.headMan
                this.dataForm.deputyLeader = data.workgroup.deputyLeader
                this.dataForm.headId = data.workgroup.headId
                this.dataForm.deputyId = data.workgroup.deputyId
                this.dataForm.pId = data.workgroup.pId
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
              url: this.$http.adornUrl(`/set/workgroup/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'orderNum': this.dataForm.orderNum,
                'createTime': this.dataForm.createTime,
                'headMan': this.dataForm.headMan,
                'deputyLeader': this.dataForm.deputyLeader,
                'headId': this.dataForm.headId,
                'deputyId': this.dataForm.deputyId,
                'pId': this.dataForm.pId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
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
