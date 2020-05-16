<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between">
        <el-form-item>
          <span class="time_title">考核时间:</span>
          <el-date-picker v-model="dataForm.curYear" type="year" placeholder="选择年" style="width: 100px;"></el-date-picker>
          <el-select v-model="dataForm.updown" placeholder="时间类型" style="width: 110px;" @change="getDataList">
            <el-option v-for="item in yearItemList" :label="item.yearItem" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="time_title">考核状态:</span>
          <el-tag type="info">未提交</el-tag>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>

    </el-card>

    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" @sort-change="changeSort" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="自增ID"></el-table-column>
      <el-table-column prop="userId" header-align="center" align="center" label="考核人Id"></el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label="考核人姓名"></el-table-column>
      <el-table-column prop="checkUserId" header-align="center" align="center" label="被考核人ID"></el-table-column>
      <el-table-column prop="checkUserName" header-align="center" align="center" label="被考核人姓名"></el-table-column>
      <el-table-column prop="kbiId" header-align="center" align="center" label="考核项ID"></el-table-column>
      <el-table-column prop="kbiScore" header-align="center" align="center" label="考核评分"></el-table-column>
      <el-table-column prop="kbiName" header-align="center" align="center" label="考核项"></el-table-column>
      <el-table-column prop="year" header-align="center" align="center" label="年度"></el-table-column>
      <el-table-column prop="updown" header-align="center" align="center" label="上下半年(0-上半年，1-下半年 )"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
  // import AddOrUpdate from './perfaccess-add-or-update'
  import {getYearItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          curYear: new Date(2020 , 1 ,1),   // 当前年份
          updown: 0 // 上下半年
        },
        yearItemList: getYearItem(),
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      // AddOrUpdate
    },
    activated () {
      this.init()
      // this.getDataList()
    },
    methods: {
      // 时间初始化
      init () {
        this.dataForm.curYear = new Date( new Date().getFullYear() , new Date().getMonth() - 3, 1)
        this.dataForm.updown = this.dataForm.curYear.getMonth() <= 6 ? 0 : 1
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ren/perfaccess/list'),
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
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
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
            url: this.$http.adornUrl('/ren/perfaccess/delete'),
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
  .time_title{
    font-size: 12pt;
  }
</style>
