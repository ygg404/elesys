<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="关键字搜索" @change="getDataListBykey" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListBykey()">查询</el-button>
        <el-button v-if="isAuth('set:worktype:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('set:worktype:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
              @sort-change="changeSort" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="ID" width="80"></el-table-column>
      <el-table-column prop="typeName" header-align="center" align="center" label="类型名称"></el-table-column>
      <el-table-column prop="unit" header-align="center" align="center" label="单位" width="110"></el-table-column>
      <el-table-column prop="unitOutput" header-align="center" align="center" label="单位产值" width="110"></el-table-column>
      <el-table-column label="项目类型" prop="projectTypeName" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.projectTypeName != ''" v-for="(item,index) in scope.row.projectTypeName.split(',')"
                  :key="index" style="margin-left: 5px;">{{item}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './worktype-add-or-update'
  import {resolve} from 'url'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 1,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        ProjectTypeList: []

      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getProjectList().then(success => {
        this.getDataList()
      })
    },
    methods: {
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
        this.getProjectList().then(success => {
          this.getDataList()
        })

      },
      // 同步获取 项目类型列表数据
      getProjectList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/projecttype/selectprojecttype'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.ProjectTypeList = data.list
              resolve(data.list)
            } else {
              this.dataList = []
            }
          })
        })
      },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/set/worktype/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list

            // 遍历数据列表
            for (let ItemData of this.dataList) {
              ItemData.projectTypeName = ''
              // 遍历单条数据关联的项目类型ID
              for (let PIDItem of ItemData.projectTypeIdList) {
                for (let PIDInProjectTypeListItem of this.ProjectTypeList) {
                  if (PIDItem === PIDInProjectTypeListItem.id) {
                    ItemData.projectTypeName += PIDInProjectTypeListItem.name + ','
                  }
                }

              }
              ItemData.projectTypeName = ItemData.projectTypeName.substring(0, ItemData.projectTypeName.length - 1)
              console.log(ItemData.projectTypeName)
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
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getProjectList().then(success => {
          this.getDataList()
        })
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getProjectList().then(success => {
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/worktype/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
      }

    }
  }
</script>
