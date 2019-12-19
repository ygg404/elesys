<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" @change="getDataListBykey" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListBykey()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="userId" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="useraccount" header-align="center" align="center" label="用户账号"  width="150"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="用户名"  width="180"></el-table-column>
      <el-table-column label="角色组" header-align="center" align="center" prop="rname">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.rname != ''" v-for="(item,index) in (scope.row.rname || '').split(',')" :key="index"
                  style="margin-left: 5px;">{{item}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="workGroupName" header-align="center" align="center" label="工作组" width="170"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="primary" size="mini"
                     @click="addOrUpdateHandle(scope.row.userId)">修改
          </el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" size="mini" @click="deleteHandle(scope.row.userId)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[25, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        SysRoleDataList: [],
        // 工作组数据列表
        WorkGroupDataList: []
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getWorkGroupDataListFromApi().then(success => {
        this.getSysRoleList().then(success => {
          this.getDataList()
        })
      })
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            // 遍历数据列表
            for (let ItemData of this.dataList) {
              ItemData.rname = ''
              // 遍历单条数据关联的角色组类型ID
              for (let RIDItem of ItemData.roleIdList) {
                for (let RListItem of this.SysRoleDataList) {

                  if (RIDItem === RListItem.roleId) {
                    ItemData.rname += RListItem.roleName + ','
                  }
                }

              }
              ItemData.rname = ItemData.rname.substring(0, ItemData.rname.length - 1)
              console.log(ItemData.rname)

            }
            this.totalPage = data.page.totalCount

          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 通过关键字搜索
      getDataListBykey () {
        this.pageIndex = 1
        this.getDataList()
      },
      // 通过工作组ID找到对应的工作组名称(参数 工作组ID 工作组列表)
      getCorrespondingWorkGroupName (WGid, WorkGroupList) {
        let res = ''
        for (let item of WorkGroupList) {
          if (WGid === item.id) {
            res = item.name
          }
        }
        return res
      },

      // 从后台获得工作组数据列表内容  填充至选项
      getWorkGroupDataListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/workgroup/selectworkgroup'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.WorkGroupDataList = data.list
              resolve(data.list)
            } else {
              // this.dataList = []
            }
          })
        })
      },

      // 同步获取 角色组列表数据
      getSysRoleList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.SysRoleDataList = data.list
              resolve(data.list)
            } else {
              this.dataList = []
            }
          })
        })
      },

      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getSysRoleList().then(success => {
          this.getDataList()
        })
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getSysRoleList().then(success => {
          this.getDataList()
        })
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
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
        }).catch(() => {
        })
      }
    }
  }
</script>
