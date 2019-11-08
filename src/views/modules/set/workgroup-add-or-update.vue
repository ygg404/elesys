<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="作业组名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="作业组名称"></el-input>
      </el-form-item>
      <el-form-item label="队长名称" prop="headId">
        <el-select v-model="dataForm.headId" placeholder="队长名称" clearable="true">
          <el-option
            v-for="item in CaptainList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="副队长名称" prop="deputyId">
        <el-select v-model="dataForm.deputyId" placeholder="副队长名称" clearable="true">
          <el-option
            v-for="item in CaptainList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId">
          </el-option>
        </el-select>
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
            {required: true, message: '作业组名称不能为空', trigger: 'blur'}
          ],
          orderNum: [
            {required: true, message: '排序号不能为空', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '创建时间不能为空', trigger: 'blur'}
          ],
          headMan: [
            {required: true, message: '队长名称不能为空', trigger: 'blur'}
          ],
          deputyLeader: [
            {required: true, message: '副队长名称不能为空', trigger: 'blur'}
          ],

          pId: [
            {required: true, message: '部门父id不能为空', trigger: 'blur'}
          ]
        },
        CaptainList: []
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
                this.dataForm.name = data.workGroup.name
                this.dataForm.orderNum = data.workGroup.orderNum
                this.dataForm.createTime = data.workGroup.createTime
                this.dataForm.headMan = data.workGroup.headMan
                this.dataForm.deputyLeader = data.workGroup.deputyLeader
                this.dataForm.headId = data.workGroup.headId
                this.dataForm.deputyId = data.workGroup.deputyId
                if (this.dataForm.headId === 0) {
                  this.dataForm.headId = ''
                  this.dataForm.headMan = null
                }
                if (this.dataForm.deputyId === 0) {
                  this.dataForm.deputyId = ''
                  this.dataForm.deputyLeader = null
                }
              }
            })
          }
          this.getCaptainList()
        })
      },
      getCaptainList () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/getCaptain'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.CaptainList = data.list
          } else {
            this.dataList = []
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        if (this.dataForm.headId != null && this.dataForm.headId !== '') {
          this.dataForm.headMan = this.CaptainList.find(item => item.userId === this.dataForm.headId)['username']
        } else {
          this.dataForm.headMan = ''
          this.dataForm.headId = 0
        }

        if (this.dataForm.deputyId != null && this.dataForm.deputyId !== '') {
          this.dataForm.deputyLeader = this.CaptainList.find(item => item.userId === this.dataForm.deputyId)['username']
        }
        else {
          this.dataForm.deputyLeader = ''
          this.dataForm.deputyId = 0
        }

        this.$refs['dataForm'].validate((valid) => {
          console.log('this.dataForm.headMan: ' + this.dataForm.headMan)
          console.log('this.dataForm.deputyLeader: ' + this.dataForm.deputyLeader)
          console.log('this.dataForm.headId: ' + this.dataForm.headId)
          console.log('this.dataForm.deputyId: ' + this.dataForm.deputyId)

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
                  duration: 1500

                })
              } else {
                this.$message.error(data.msg)
              }
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        })
      }
    }
  }
</script>
