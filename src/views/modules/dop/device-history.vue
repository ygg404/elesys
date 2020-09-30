<template>
  <el-dialog
    :title="title" width="80%"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="main_card">
      <el-card class="latest_item">
        <template slot="header">
          <span class="header">最新借还记录</span>
        </template>
        <div style="height: 500px;">
          <el-steps direction="vertical" :active="1">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
          </el-steps>
        </div>
      </el-card>
      <el-card style="width: 100%;">
        <template slot="header">
          <span class="header">借还历史记录</span>
        </template>
        <el-form :inline="true" :model="dataForm">
          <el-form-item>
            <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading"  @sort-change="changeSort" style="width: 100%;">
          <el-table-column prop="deviceName" header-align="center" align="center" label="仪器名"></el-table-column>
          <el-table-column prop="borrowerName" header-align="center" align="center" label="借物人"></el-table-column>
          <el-table-column prop="lenderName" header-align="center" align="center" label="出借人"></el-table-column>
          <el-table-column prop="rentStatus" header-align="center" align="center" label="出借情况">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.rentStatus == 2">已归还</el-tag>
              <el-tag v-el>已归还</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
          <el-table-column prop="createTime" header-align="center" align="center" label="时间"></el-table-column>
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
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          deviceId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        visible: false
      }
    },
    methods: {
      init (item) {
        this.dataForm.deviceId = item.id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.deviceId) {
            this.getDataList()
          }
        })
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
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/dop/history/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'deviceId': this.dataForm.deviceId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
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
            url: this.$http.adornUrl('/dop/history/delete'),
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

<style scoped>
  .main_card {
    display: flex;
    justify-content: flex-start;
  }
  .latest_item {
    width: 300px;
    min-height: 500px;
  }
  .header{
    font-size: 14pt;
    font-weight: 700;

  }
</style>
