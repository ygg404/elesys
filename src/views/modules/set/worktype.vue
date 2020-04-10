<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="项目类型：">
        <el-select v-model="dataForm.projectTypeId" clearable placeholder="请选择项目类型" style="width: 100%;" @change="getDataListBykey()" >
          <el-option v-for="item in projectTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：" >
        <el-input v-model="dataForm.key" placeholder="关键字搜索" @change="getDataListBykey" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListBykey()">查询</el-button>
        <el-button v-if="isAuth('set:worktype:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('set:worktype:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
        <el-button type="success" icon="el-icon-printer" @click="exportWtypeExcel()">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
              @sort-change="changeSort" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="序列号" width="85"></el-table-column>
<!--      <el-table-column prop="id" header-align="center" align="center" label="ID" width="80"></el-table-column>-->
      <el-table-column prop="typeName" header-align="center" align="center" label="类型名称"></el-table-column>
      <el-table-column prop="unit" header-align="center" align="center" label="单位" width="110"></el-table-column>
      <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单价" width="110"></el-table-column>
      <el-table-column label="项目类型" prop="projectTypeName" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.projectTypeName != ''" v-for="(item,index) in scope.row.projectTypeName.split(',')"
                  :key="index" style="margin-left: 5px;">{{item}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="240" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="" icon="el-icon-top" @click="setSortHandle(scope.row)">顺序</el-button>
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
  import moment from 'moment'
  import Vue from 'vue'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'order_num',
          order: 'desc',
          projectTypeId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 1,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        projectTypeList: []

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
              let typeDat = [{ id: 0, name: '无'}]
              this.projectTypeList = typeDat.concat(data.list)
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
            'order': this.dataForm.order,
            'projectTypeId': this.dataForm.projectTypeId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list

            // 遍历数据列表
            for (let ItemData of this.dataList) {
              ItemData.projectTypeName = ''
              // 遍历单条数据关联的项目类型ID
              for (let PIDItem of ItemData.projectTypeIdList) {
                for (let PIDInProjectTypeListItem of this.projectTypeList) {
                  if (PIDItem === PIDInProjectTypeListItem.id) {
                    ItemData.projectTypeName += PIDInProjectTypeListItem.name + ','
                  }
                }

              }
              ItemData.projectTypeName = ItemData.projectTypeName.substring(0, ItemData.projectTypeName.length - 1)
            }
            this.totalPage = data.page.totalCount
          } else {
            this.$message.error(data.msg)
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
      },
      //  设置顺序
      setSortHandle (item) {
        this.$http({
          url: this.$http.adornUrl('/set/worktype/setSort'),
          method: 'post',
          data: this.$http.adornData({
            'id': item.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '改变顺序成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 导出工作类型excel
      exportWtypeExcel () {
        this.dataListLoading = true
        let that = this
        let downurl = window.SITE_CONFIG['baseUrl'] + '/set/worktype/exportExcel'
        let xhr = new XMLHttpRequest()
        // GET请求,请求路径url,async(是否异步)
        xhr.open('GET', downurl, true)
        // 设置请求头参数的方式,如果没有可忽略此行代码
        xhr.setRequestHeader('token', Vue.cookie.get('token'))
        // 设置响应类型为 blob
        xhr.responseType = 'blob'
        // 关键部分
        xhr.onload = function (e) {
          that.dataListLoading = false
          // 如果请求执行成功
          if (this.status === 200) {
            let blob = this.response
            console.log((e))
            let filename = '作业类型表.xls'
            let a = document.createElement('a')
            // 创键临时url对象
            var url = URL.createObjectURL(blob)
            a.href = url
            a.download = filename
            a.click()
            // 释放之前创建的URL对象
            window.URL.revokeObjectURL(url)

          }
        }
        // 发送请求
        xhr.send()
      }
    }
  }
</script>

<style scoped>


</style>
