<template>
  <div class="mod-config">
    <el-collapse class="collapse_item">
      <el-collapse-item  name="1">
        <template slot="title">
          <div class="access_item_title">设置考核目标</div>
        </template>
        <el-card>
          <template slot="header">
            <el-button  type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">添加考核目标</el-button>
          </template>
          <div>
            <el-table :key="Math.random()" :data="dataList" border v-loading="dataListLoading"   style="width: 100%;"
                      row-key="id" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">>
              <el-table-column prop="id" header-align="left" align="left" label="ID" width="100"></el-table-column>
              <el-table-column prop="accessName" header-align="center" align="center" label="目标名称">
                <template slot-scope="scope">
                  <div v-if="scope.row.parentId === 0" style="color: #137cb3;font-weight: 700;">{{scope.row.accessName}}</div>
                  <div v-if="scope.row.parentId !== 0"><div></div><div style="margin-left: 20px;">{{scope.row.accessName}}</div></div>
                </template>
              </el-table-column>
              <el-table-column prop="parentId" header-align="center" align="center" label="目标级别">
                <template slot-scope="scope">
                  <div v-if="scope.row.parentId === 0"><el-tag type="primary" >一级目标</el-tag></div>
                  <div v-if="scope.row.parentId !== 0"><div></div><el-tag type="warning" style="margin-left: 30px;">二级目标</el-tag></div>
                </template>
              </el-table-column>
              <el-table-column prop="accessScore" header-align="center" align="center" label="目标分数">
                <template slot-scope="scope">
                  <div v-if="scope.row.parentId === 0" style="color: #137cb3;font-weight: 700;">{{scope.row.accessScore}}</div>
                  <div v-if="scope.row.parentId !== 0"><div></div><div style="margin-left: 20px;">{{scope.row.accessScore}}</div></div>
                </template>
              </el-table-column>
              <el-table-column  header-align="center" align="center" width="180" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button type="danger" size="mini" @click="deleteHandle(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item  name="2">
        <template slot="title">
          <div class="access_item_title">设置员工加减分考核</div>
        </template>
        <el-card>
          <el-table :key="Math.random()" border="1" width="100%" :data="branchUserList" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                   :span-method="objectSpanMethod">
            <el-table-column prop="branchName" header-align="center" align="center" label="部门名称"></el-table-column>
            <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
            <el-table-column header-align="center" align="center" label="考核目标">
              <template slot-scope="scope">
                <div v-for="item in scope.row.accessIdList"><el-tag>{{getAccessName(item)}}</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="accessScore" header-align="center" align="center" label="考核总分"></el-table-column>
            <el-table-column  header-align="center" align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="editAccessUserHandle(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-collapse-item>
    </el-collapse>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"></add-or-update>

    <accessuser-add-or-update v-if="accessUserVisible" ref="accessuserAddOrUpdate" @refreshDataList="init"></accessuser-add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './access-add-or-update'
  import accessuserAddOrUpdate from './accessuser-add-or-update'
  import { treeDataTranslate } from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc'
        },
        dataList: [],
        branchUserList: [], // 部门用户列表
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        accessUserVisible: false
      }
    },
    components: {
      AddOrUpdate,
      accessuserAddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.getAccessList().then(success => {
          this.getBranchList().then(branchUserList => {
            this.getAccessUserList().then(accessuserlist => {
              for (let branch of branchUserList) {
                let accessIdList = []
                let allscore = 0
                for (let access of accessuserlist) {
                  if (access.userId === branch.userId) {
                    accessIdList.push(access.accessId)
                    allscore += this.getAccessScoreById(access.accessId)
                  }
                }
                branch.accessIdList = accessIdList
                branch.accessScore = allscore
              }
              this.branchUserList = branchUserList
              console.log(this.branchUserList)
            })
          })
        })
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.islast || rowIndex === 0) {
            return {
              rowspan: row.size,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      // 排序字段改变
      changeSort (val) {
        console.log(val)
        switch (val.order) {
          case 'ascending':
            this.dataForm.order = 'asc'
            break
          case 'descending':
            this.dataForm.order = 'desc'
            break
          default:
            this.dataForm.order = 'desc'
        }
        this.dataForm.sidx = val.prop
        this.getDataList()
      },
      // 获取数据列表
      getAccessList () {
        return new Promise((resolve, reject) => {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/ren/access/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = treeDataTranslate(data.list)
              resolve(this.dataList)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
            this.dataListLoading = false
          })
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (item) {
        let title = '确定对[id=' + item.id + '][' + item.accessName + ']进行["删除"]操作?'
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ren/access/delete'),
            method: 'post',
            data: this.$http.adornData({
              'id': item.id,
              'parentId': item.parentId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取所有部门
      getBranchList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/branch/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              let branchlist = this.getBranchChildList(treeDataTranslate(data.list))
              let branchUserList = []
              for (let branch of branchlist) {
                for (let i = 0; i < branch.recordVoList.length; i++) {
                  let record = {
                    branchName: branch.branchName,
                    userId: branch.recordVoList[i].userId,
                    username: branch.recordVoList[i].username,
                    size: branch.recordVoList.length,
                    islast: i === 0 ? true : false
                  }
                  branchUserList.push(record)
                }
              }
              this.branchList = branchlist
              console.log(branchUserList)
              resolve(branchUserList)
            } else {
              this.dataList = []
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取所有子部门
      getBranchChildList (branchlist) {
        let childList = []
        for (let branch of branchlist) {
          if (branch.children !== undefined) {
            childList = childList.concat(this.getBranchChildList(branch.children))
          } else {
            childList.push(branch)
          }
        }
        return childList
      },
      // 编辑员工的加减分考核
      editAccessUserHandle (item) {
        this.accessUserVisible = true
        this.$nextTick(() => {
          this.$refs.accessuserAddOrUpdate.init(item)
        })
      },
      // 获取目标与用户列表
      getAccessUserList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/accessuser/list`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(treeDataTranslate(data.list))
            } else {
              this.$message(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取目标分数
      getAccessScoreById (accessId) {
        for (let access of this.dataList) {
          for (let child of access.children) {
            if (accessId === child.id) {
              return access.accessScore
            }
          }
        }
      },
      // 获取目标名称
      getAccessName (accessId) {
        let accessName = ''
        for (let access of this.dataList) {
          for (let child of access.children){
            if (accessId === child.id){
              accessName = access.accessName + '/' + child.accessName
              break
            }
          }
        }
        return accessName
      }
    }
  }
</script>


<style>

  .access_item_title{
    width: 99%;
    padding: 5px;
    font-size: 14pt;
    font-weight: 700;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    cursor: pointer;
  }
  .access_item_title:hover {
    color: #0BB2D4;
  }



</style>
