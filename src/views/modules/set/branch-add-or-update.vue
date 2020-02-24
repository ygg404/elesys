<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="部门名称" prop="branchName">
        <el-input v-model="dataForm.branchName" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="branchTreeList"
            :props="branchListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="treeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="true">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.branchParentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="orderNum">
        <el-input type="number" v-model="dataForm.orderNum" placeholder="序号"
            min="0" max="10"  ></el-input>
      </el-form-item>
      <el-form-item label="部门成员">
        <div class="check_branch">
          <el-input prefix-icon="el-icon-search" placeholder="搜索成员关键字"
                    v-model="keySearch" style="padding: 5px"></el-input>
          <div class="check_content">
            <el-checkbox
              v-for="(item, index) in userAllList"
              :key="item.userId"
              :label="item.username"
              v-if="item.username.indexOf(keySearch.trim()) != -1"
              v-model="item.checked"
              @change="chooseUserHandle()"
              class="checkbox_class"
            ></el-checkbox>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-table border :data="userValueList">
          <el-table-column prop="username" header-align="center" align="center" label="姓名"></el-table-column>
          <el-table-column prop="mdeputyId" header-align="center" align="center" label="是否为主负责人">
            <template  slot-scope="scope">
              <el-checkbox :key="Math.random()" :checked="scope.row.userId === dataForm.mdeputyId"
                           @change="mdeputyChangeHandle(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="sdeputyId" header-align="center" align="center" label="是否为副负责人">
            <template  slot-scope="scope">
              <el-checkbox :key="Math.random()" :checked="scope.row.userId === dataForm.sdeputyId"
                           @change="sdeputyChangeHandle(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
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
        keySearch: '', // 搜索关键字
        branchList: [], // 部门列表
        branchTreeList: [], // 部门树形表
        userAllList: [], // 用户列表
        userValue: [],   // 选中的用户
        userValueList: [],
        dataForm: {
          id: 0,
          parentId: '',
          branchName: '',
          branchParentName: '',
          mdeputyId: '',
          sdeputyId: '',
          orderNum: ''
        },
        dataRule: {
          parentId: [
            { required: true, message: '上级部门不能为空', trigger: 'blur' }
          ],
          branchName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ]
        },
        branchListTreeProps: {
          label: 'branchName',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        // 获取用户列表
        this.getUserList().then(data => {
          this.userAllList = data
          // 获取部门列表
          this.getBranchList().then(success => {
            this.branchList = success
            this.branchTreeList = treeDataTranslate(success , 'id')
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              if (this.dataForm.id) {
                this.$http({
                  url: this.$http.adornUrl(`/set/branch/info/${this.dataForm.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.dataForm.parentId = data.branchVo.parentId
                    this.dataForm.branchName = data.branchVo.branchName
                    this.dataForm.mdeputyId = data.branchVo.mdeputyId
                    this.dataForm.mdeputyName = data.branchVo.mdeputyName
                    this.dataForm.sdeputyId = data.branchVo.sdeputyId
                    this.dataForm.mdeputyName = data.branchVo.mdeputyName
                    this.dataForm.orderNum = data.branchVo.orderNum
                    this.userValue = []
                    // 初始化所属成员和主副负责人
                    this.userValueList = []
                    for (let user of data.branchVo.userList) {
                      this.userValue.push(user.userId)
                      for (let userDat of this.userAllList) {
                        if (user.userId === userDat.userId) {
                          this.userValueList.push(userDat)
                          userDat.checked = true
                          break
                        }
                      }
                    }
                    // 获取上级部门名称
                    for (let branch of this.branchList) {
                      if ( branch.id === this.dataForm.parentId) {
                        this.dataForm.branchParentName = branch.branchName
                        break
                      }
                    }
                  }
                })
              } else {
                this.dataForm.orderNum = 1
                this.dataForm.parentId = ''
                this.dataForm.branchName = ''
                this.dataForm.branchParentName = ''
                this.dataForm.mdeputyId = ''
                this.dataForm.sdeputyId = ''
                this.userValueList = []
              }
            })
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/branch/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'parentId': this.dataForm.parentId,
                'branchName': this.dataForm.branchName,
                'mdeputyId': this.dataForm.mdeputyId,
                'sdeputyId': this.dataForm.sdeputyId,
                'orderNum': this.dataForm.orderNum,
                'userList': this.userValueList
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
      // 获取部门列表
      getBranchList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/branch/list`),
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
      getUserList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/getAllUserList'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              for (let userDat of data.list) {
                userDat.checked = false
              }
              resolve(data.list)
            } else {
              this.userAllList = []
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取部门与用户关系
      getBranchUserHandle () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/branchuser/getAllUserList'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {

            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 菜单树选中
      treeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.branchParentName = data.branchName
      },
      // 选中用户改变
      chooseUserHandle () {
        let userValueList = []
        this.userAllList.forEach((item, index) => {
          if ( item.checked ) {
            userValueList.push(item)
          }
        })
        this.userValueList = userValueList
      },
      // 主负责人选择改变
      mdeputyChangeHandle (item) {
        if ( this.dataForm.mdeputyId === item.userId ){
          this.dataForm.mdeputyId = ''
          return
        }
        this.dataForm.mdeputyId = item.userId
        // 主副负责人 不唯一
        if ( this.dataForm.mdeputyId === this.dataForm.sdeputyId) this.dataForm.sdeputyId = ''
      },
      // 副负责人选择改变
      sdeputyChangeHandle (item) {
        if ( this.dataForm.sdeputyId === item.userId ){
          this.dataForm.sdeputyId = ''
          return
        }
        this.dataForm.sdeputyId = item.userId
        // 主副负责人 不唯一
        if ( this.dataForm.mdeputyId === this.dataForm.sdeputyId) this.dataForm.mdeputyId = ''
      }
    }
  }
</script>


<style scoped>
  .check_branch{
    margin-top: 10px;
    border: 1px solid #167cdd;
    height: 250px;
    border-radius: 5px;
    text-align: center;
    width: 200px;
  }
  .check_branch .check_content{
    border: 1px solid #bec2dd;
    padding: 5px;
    height: 194px;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    width: 95%;
    margin-left: 2%;
  }
  .check_branch .check_content .checkbox_class{
    width: 95%;
    margin-left: 10px;
  }
</style>
