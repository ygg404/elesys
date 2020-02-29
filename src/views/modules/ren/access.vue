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
            <el-table :data="dataList" border v-loading="dataListLoading"   style="width: 100%;"
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
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './access-add-or-update'
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
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
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
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ren/access/list'),
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
            this.dataList = treeDataTranslate(data.list)
            console.log(this.dataList)
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
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
        let title = '确定对[id=' + item.id + ']['+ item.accessName + ']进行["删除"]操作?'
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
      }
    }
  }
</script>


<style scoped>

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
