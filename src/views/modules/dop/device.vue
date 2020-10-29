<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="pageIndex=1,getDataList()">查询</el-button>
        <el-button v-if="isAuth('dop:device:save')" type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新增仪器</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="序号ID" width="91"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="deviceName" header-align="center" align="center" label="仪器名称"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="factoryNum" header-align="center" align="center" label="出厂编号"></el-table-column>
      <el-table-column prop="factoryName" header-align="center" align="center" label="生产厂家"></el-table-column>
      <el-table-column prop="specNum" header-align="center" align="center" label="型号规格"></el-table-column>
      <el-table-column prop="accuracy" header-align="center" align="center" label="标称精度"></el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="购置金额"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="buyTime" header-align="center" align="center" label="购置时间"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="indate" header-align="center" align="center" label="有效期">
        <template slot-scope="scope">
          <span v-if="!stringIsNull(scope.row.indate)">{{scope.row.indate}}年</span>
        </template>
      </el-table-column>
      <el-table-column prop="devStation" header-align="center" align="center" label="设备状况" width="100">
        <template slot-scope="scope" >
          <el-tag v-if="scope.row.devStation === 0" size="small" type="success">闲置中</el-tag>
          <el-tag v-else-if="scope.row.devStation === 1" size="small" type="warning">出借中</el-tag>
          <el-tag v-else-if="scope.row.devStation === 2" size="small" type="danger">维修中</el-tag>
          <el-tag v-else-if="scope.row.devStation === 3" size="small" type="info">已丢失</el-tag>
          <el-tag v-else-if="scope.row.devStation === 4" size="small" type="info">已报废</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column header-align="center" align="center" label="二维码"  width="90">
        <template slot-scope="scope">
          <span class="check_span" @click="qrCodeShowHandle(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" header-align="center" align="center" label="仪器证书" width="100">
        <template slot-scope="scope">
          <span v-if="!stringIsNull(scope.row.fileName)" class="check_span" @click="fileLoadToHandle(scope.row.fileName)">查看</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="借还记录" width="100">
        <template slot-scope="scope">
          <span class="check_span" @click="dopHistoryHandle(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="220" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="lendProcessHandle(scope.row)" type="primary">借记</el-button>
          <el-button v-if="scope.row.devStation === 0" type="warning" size="mini" @click="lendToHandle(scope.row)">出借</el-button>
          <el-button v-if="scope.row.devStation === 1" type="success" size="mini" @click="lendToHandle(scope.row)">归还</el-button>
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
    <!-- 二维码弹窗 -->
    <device-qrcode v-if="qrcodeVisible" ref="deviceQrcode"></device-qrcode>
    <!-- 仪器借记历史弹窗 -->
    <device-history v-if="historyVisible" ref="deviceHistory"></device-history>
    <!-- 借记流程弹窗 -->
    <device-process v-if="processVisible" ref="deviceProcess"></device-process>
    <!-- 借换记录弹窗 -->
    <history-add-or-update v-if="historyAddOrUpdateVisible" ref="historyAddOrUpdate"></history-add-or-update>

  </div>
</template>

<script>
  import stringIsNull from '@/utils'
  import deviceQrcode from './device-qrcode'
  import deviceHistory from './device-history'
  import deviceProcess from './device-process'
  import AddOrUpdate from './device-add-or-update'
  import historyAddOrUpdate from './history-add-or-update'

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
        addOrUpdateVisible: false,
        qrcodeVisible: false,
        processVisible: false,
        historyVisible: false,
        historyAddOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      deviceQrcode,
      deviceHistory,
      deviceProcess,
      historyAddOrUpdate
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
          url: this.$http.adornUrl('/dop/device/page'),
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
            url: this.$http.adornUrl('/dop/device/delete'),
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
      // 仪器借还记录
      dopHistoryHandle (item) {
        this.historyVisible = true
        this.$nextTick(() => {
          this.$refs.deviceHistory.init(item)
        })
      },
      // 仪器出借
      lendToHandle (item) {
        this.historyAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.historyAddOrUpdate.init(item)
        })
      },
      // 仪器借记流程
      lendProcessHandle (item) {
        this.processVisible = true
        this.$nextTick(() => {
          this.$refs.deviceProcess.init(item)
        })
      },
      // 查看仪器文件
      fileLoadToHandle (fileName) {
        window.open("https://www.gdjxch.cn//uploadFile/report/20200811-01(d9aTnOsG)//word/media/image1.png")
      },
      // 二维码显示
      qrCodeShowHandle (item) {
        this.qrcodeVisible = true
        this.$nextTick(() => {
          this.$refs.deviceQrcode.init(item)
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "src/assets/scss/_variables.scss";
  .check_span {
    color: $navbar--background-color;
    text-decoration:underline;
    cursor: pointer;
  }
  .popover_card {
    background-color:#f0f0f0;
    color: #00a0e9;
    border:1px solid #5daf34;
  }

</style>
