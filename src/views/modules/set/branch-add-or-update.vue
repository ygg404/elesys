<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">

      <el-form :model="dataForm" :rules="dataRule" v-loading="loading" element-loading-text="正在加载中..."
               ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
        <el-form-item label="部门名称" prop="branchName">
          <el-input v-model="dataForm.branchName" placeholder="部门名称"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-popover transition="fade-in-linear"
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
        <el-form-item label="部门成员">
          <div class="branch_line" >
            <div class="check_branch" >
              <el-select v-model="userValueId" multiple filterable placeholder="请选择" :id="Math.random()"
                         style="width: 100%" @change="chooseUserHandle()">
                <el-option
                  v-for="item in userAllList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.userId">
                </el-option>
              </el-select>

<!--              <el-input prefix-icon="el-icon-search" placeholder="搜索成员关键字"-->
<!--                        v-model="keySearch" style="padding: 5px"></el-input>-->
<!--              <div class="check_content">-->
<!--                <el-checkbox-->
<!--                  v-for="(item, index) in userAllList"-->
<!--                  :key="item.userId"-->
<!--                  :label="item.username"-->
<!--                  v-if="item.username.indexOf(keySearch.trim()) != -1"-->
<!--                  v-model="item.checked"-->
<!--                  @change="chooseUserHandle()"-->
<!--                  class="checkbox_class"-->
<!--                ></el-checkbox>-->
              </div>
            </div>
            <div class="table_set">
              <el-table border :data="userValueList" :id="Math.random()">
                <el-table-column prop="username" header-align="center" align="center" label="姓名"></el-table-column>
                <el-table-column prop="mdeputyId" header-align="center" align="center" label="是否为主负责人" >
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
            </div>


        </el-form-item>
      </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="danger" @click="deleteBranchHandle()">删除</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        loading: false,
        visible: false,
        keySearch: '', // 搜索关键字
        branchList: [], // 部门列表
        branchTreeList: [], // 部门树形表
        userAllList: [], // 用户列表
        userValueId: [],   // 选中的用户
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
          ]
          // orderNum: [
          //   { required: true, message: '序号不能为空', trigger: 'blur' }
          // ]
        },
        branchListTreeProps: {
          label: 'branchName',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.loading = true

          // 获取用户列表
          this.getUserList().then(userAllList => {
            // 获取部门列表
            this.getBranchList().then(branchList => {
              for (let userDat of userAllList) {
                userDat.checked = false
              }
              let parentNode = [{
                branchName: '无',
                id: -1,
                parentId: -1
              }]
              branchList = parentNode.concat(branchList)
              this.loading = false
              if (this.dataForm.id) {
                this.getBranchInfo(this.dataForm.id).then(info => {
                  this.dataForm.parentId = info.parentId === 0 ? -1 : info.parentId
                  this.dataForm.branchName = info.branchName
                  this.dataForm.mdeputyId = info.mdeputyId
                  this.dataForm.mdeputyName = info.mdeputyName
                  this.dataForm.sdeputyId = info.sdeputyId
                  this.dataForm.mdeputyName = info.mdeputyName
                  this.dataForm.orderNum = info.orderNum

                  // 初始化所属成员和主副负责人
                  let userValueList = []
                  let userValueId = []
                  // 获取该部门的所有成员并勾选
                  for (let user of info.userList) {
                    let userItem = userAllList.find(item => item.userId === user.userId)
                    if (!stringIsNull(userItem)) {
                      userValueId.push(userItem.userId)
                      // userValueList.push({
                      //   userId: userItem.userId,
                      //   username: userItem.username,
                      //   useraccount: userItem.useraccount
                      // })
                    }
                  }
                  console.log(userValueId)
                  // 获取上级部门名称
                  if (info.parentId === 0) this.dataForm.branchParentName = '无'
                  for (let branch of branchList) {
                    if (branch.id === this.dataForm.parentId) {
                      this.dataForm.branchParentName = branch.branchName
                    }
                  }
                  this.userAllList = userAllList
                  // this.userValueList = userValueList
                  this.userValueId = userValueId
                  this.branchList = branchList
                  this.branchTreeList = treeDataTranslate(branchList , 'id')
                })
              } else {
                this.keySearch = ''
                this.dataForm.orderNum = 1
                this.dataForm.parentId = -1
                this.dataForm.branchName = ''
                this.dataForm.branchParentName = '无'
                this.dataForm.mdeputyId = ''
                this.dataForm.sdeputyId = ''
                this.userValueList = []
                this.userValueId = []
                this.branchList = branchList
                this.userAllList = userAllList
                this.branchTreeList = treeDataTranslate(branchList , 'id')
                this.getOrderNumHandle()
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
                'parentId': this.dataForm.parentId === -1 ? 0 : this.dataForm.parentId,
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
      // 获取部门信息
      getBranchInfo (id) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/branch/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.branchVo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
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
              resolve(data.list)
            } else {
              this.userAllList = []
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
        this.getOrderNumHandle()
      },
      // 上级部门选中获取排序号
      getOrderNumHandle () {
        let parentId = this.dataForm.parentId === -1 ? 0 : this.dataForm.parentId
        let maxOrder = 0
        for (let branch of this.branchList) {
          if (branch.parentId === parentId) {
            maxOrder = branch.orderNum
          }
        }
        this.dataForm.orderNum = maxOrder + 1
      },
      // 选中用户改变
      chooseUserHandle () {
        console.log(this.userValueId)
        let userValueList = []
        // 判断主副负责人 是否在所选中的列表中
        let mdeputyFlag = false
        let sdeputyFlag = false
        this.userAllList.forEach((item, index) => {
          for (let userId of this.userValueId) {
            if (item.userId === userId) {
              userValueList.push(item)
              if (item.userId === this.dataForm.mdeputyId) mdeputyFlag = true
              if (item.userId === this.dataForm.sdeputyId) sdeputyFlag = true
            }
          }
        })
        if(!mdeputyFlag) this.dataForm.mdeputyId = ''
        if(!sdeputyFlag) this.dataForm.sdeputyId = ''
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
      },
      // 删除部门
      deleteBranchHandle () {
        let tip = '是否删除部门 [' + this.dataForm.branchName + '] 及其下级部门所有的信息?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/branch/delete'),
            method: 'post',
            data: this.$http.adornData([this.dataForm.id], false)
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
        })
      }
    }
  }
</script>


<style>
  .branch_line{
    display: flex;
    justify-content: flex-start;
  }

  .check_branch{
    margin-top: 10px;
    /*border: 1px solid #167cdd;*/
    /*height: 250px;*/
    border-radius: 5px;
    text-align: center;
    width: 100%;
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
  .branch_line .table_set{
    margin-left: 14px;
    margin-top: 10px;
  }

  .el-tree-node.is-current > .el-tree-node__content {

    color: dodgerblue !important;

  }
</style>
