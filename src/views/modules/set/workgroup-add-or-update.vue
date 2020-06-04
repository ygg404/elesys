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
      <el-form-item label="上级部门" prop="parentName">
        <el-popover transition="fade-in-linear"
                    ref="menuListPopover"
                    placement="bottom-start"
                    trigger="click">
          <el-tree
            :data="groupTreeList"
            :props="groupTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="treeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="true">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="队长名称" prop="headId">
        <el-select v-model="dataForm.headId" placeholder="队长名称" clearable filterable>
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="副队长名称" prop="deputyId">
        <el-select v-model="dataForm.deputyId" placeholder="副队长名称" clearable filterable>
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="deleteGroupHandle" type="danger">删除</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {stringIsNull, treeDataTranslate} from '../../../utils'

  export default {
    data () {
      return {
        visible: false,
        userList: [],
        groupTreeList: [],  // 工作组树形表
        groupList: [], // 工作组列表
        groupTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          name: '',
          orderNum: '',
          headMan: '',
          deputyLeader: '',
          headId: '',
          deputyId: '',
          pId: '',
          parentName: ''
        },
        dataRule: {
          name: [
            {required: true, message: '作业组名称不能为空', trigger: 'blur'}
          ],
          orderNum: [
            {required: true, message: '排序号不能为空', trigger: 'blur'}
          ],
          headMan: [
            {required: true, message: '队长名称不能为空', trigger: 'blur'}
          ],
          deputyLeader: [
            {required: true, message: '副队长名称不能为空', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '上级部门不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.getAllUserList()
        this.$nextTick(() => {
          this.getWorkgroupList().then(groupList => {
            this.groupList = groupList
            let parentNode = [{
              name: '无',
              id: -1,
              parentId: -1
            }]
            groupList = parentNode.concat(groupList)
            this.groupTreeList = treeDataTranslate(groupList, 'id', 'pid')
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/set/workgroup/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.pId = data.workGroup.pid === 0 ? -1 : data.workGroup.pid
                  this.dataForm.parentName = groupList.find( group => group.id === this.dataForm.pId)['name']
                  this.dataForm.name = data.workGroup.name
                  this.dataForm.orderNum = data.workGroup.orderNum
                  this.dataForm.headMan = data.workGroup.headMan
                  this.dataForm.deputyLeader = data.workGroup.deputyLeader
                  this.dataForm.headId = data.workGroup.headId
                  this.dataForm.deputyId = data.workGroup.deputyId
                  this.dataForm.headId = data.workGroup.headId
                  this.dataForm.headMan = data.workGroup.headMan
                  this.dataForm.deputyId = data.workGroup.deputyId
                  this.dataForm.deputyLeader = data.workGroup.deputyLeader
                }
              })
            } else {
              this.dataForm.parentName = ''
            }
          })
        })
      },
      // 获取部门列表
      getWorkgroupList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/workgroup/list`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取用户信息列表
      getAllUserList () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/getAllUserList'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userList = data.list
          } else {
            this.dataList = []
          }
        })
      },
      // 菜单树选中
      treeCurrentChangeHandle (data, node) {
        this.dataForm.pId = data.id
        this.dataForm.parentName = data.name
        this.getOrderNumHandle()
      },
      // 上级部门选中获取排序号
      getOrderNumHandle () {
        let parentId = this.dataForm.pId === -1 ? 0 : this.dataForm.pId
        let maxOrder = 0
        for (let group of this.groupList) {
          if (group.pid === parentId) {
            maxOrder = group.orderNum
          }
        }
        this.dataForm.orderNum = maxOrder + 1
      },
      // 表单提交
      dataFormSubmit () {
        let headManItem = this.userList.find(item => item.userId === this.dataForm.headId)
        let deputyLeaderItem = this.userList.find(item => item.userId === this.dataForm.deputyId)
        this.dataForm.headMan = stringIsNull(headManItem) ? '' : headManItem['username']
        this.dataForm.deputyLeader = stringIsNull(deputyLeaderItem) ? '' : deputyLeaderItem['username']
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/workgroup/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'orderNum': this.dataForm.orderNum,
                'headMan': this.dataForm.headMan,
                'deputyLeader': this.dataForm.deputyLeader,
                'headId': this.dataForm.headId,
                'deputyId': this.dataForm.deputyId,
                'pid': this.dataForm.pId
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
      // 删除部门
      deleteGroupHandle () {
        let tip = '是否删除工作组 [' + this.dataForm.name + '] 及其下级部门所有的信息?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/workgroup/delete'),
            method: 'post',
            data: this.$http.adornData([this.dataForm.id], false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
