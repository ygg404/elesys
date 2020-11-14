<template>
  <el-dialog
    :title="title" width="90%"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="main_card">
      <el-card class="latest_item" :body-style="{ padding: '3px' }">
        <template slot="header">
          <span class="header">最新借还记录</span>
        </template>
        <div style="height: 500px;" class="step_item">
          <el-steps direction="vertical" :active="active">
            <el-step title="申请出借">
              <template slot="description">
                <div class="lend_row">
                  <el-row class="lend_line">
                    <div class="span_property">申请人：</div><div :span="16" class="span_value">{{processList.applyLend.applyMan}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">申请时间：</div><div :span="16" class="span_value">{{processList.applyLend.applyTime}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">预还时间：</div><div :span="16" class="span_value">{{processList.applyLend.returnTime}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">备注：</div><div :span="16" class="span_value">{{processList.applyLend.remark}}</div>
                  </el-row>
                </div>
              </template>
            </el-step>
            <el-step title="审批人同意">
              <template slot="description">
                <div class="lend_row">
                  <el-row class="lend_line">
                    <div class="span_property">审批人：</div><div :span="16" class="span_value">{{processList.authLend.authMan}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">审批时间：</div><div :span="16" class="span_value">{{processList.authLend.authTime}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">备注：</div><div :span="16" class="span_value">{{processList.authLend.remark}}</div>
                  </el-row>
                </div>
              </template>
            </el-step>
            <el-step title="归还仪器">
              <template slot="description">
                <div class="lend_row">
                  <el-row class="lend_line">
                    <div class="span_property">归还人：</div><div :span="16" class="span_value">{{processList.applyReturn.applyMan}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">归还时间：</div><div :span="16" class="span_value">{{processList.applyReturn.returnTime}}</div>
                  </el-row>
                </div>
              </template>
            </el-step>
            <el-step title="确定归还">
              <template slot="description">
                <div class="lend_row">
                  <el-row class="lend_line">
                    <div class="span_property">审批人：</div><div :span="16" class="span_value">{{processList.authReturn.authMan}}</div>
                  </el-row>
                  <el-row class="lend_line">
                    <div class="span_property">审批时间：</div><div :span="16" class="span_value">{{processList.authReturn.authTime}}</div>
                  </el-row>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </el-card>
      <el-card style="width: 100%;">
        <template slot="header">
          <span class="header">借还历史记录</span>
        </template>
        <el-form :inline="true" :model="dataForm">
          <el-form-item>
            <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading"  @sort-change="changeSort" style="width: 100%;">
          <el-table-column prop="factoryNum" header-align="center" align="center" label="出厂编号"></el-table-column>
          <el-table-column prop="deviceName" header-align="center" align="center" label="仪器名"></el-table-column>
          <el-table-column prop="borrowerName" header-align="center" align="center" label="借物人"></el-table-column>
          <el-table-column prop="lenderName" header-align="center" align="center" label="审批人"></el-table-column>
          <!--0-撤销申请,1-申请出借,2-批准出借,3-归还仪器, 4-确定归还-->
          <el-table-column prop="rentStatus" header-align="center" align="center" label="出借情况">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.rentStatus == 0" type="danger">撤销申请</el-tag>
              <el-tag v-if="scope.row.rentStatus == 1">申请出借</el-tag>
              <el-tag v-if="scope.row.rentStatus == 2">批准出借</el-tag>
              <el-tag v-if="scope.row.rentStatus == 3">归还仪器</el-tag>
              <el-tag v-if="scope.row.rentStatus == 4">确定归还</el-tag>
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
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary" plain>返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {stringIsNull} from '@/utils'
  import moment from 'moment'

  export default {
    data () {
      return {
        active: 0,
        title: '',
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          deviceId: '',
          deviceName: ''
        },
        processList: {
          applyLend: {},
          authLend: {},
          applyReturn: {},
          authReturn: {}
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalCount: 0,
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
            this.dataListLoading = true
            this.getPageList().then(page => {
              this.getInfoFromApi().then(dopDevice => {
                this.dataListLoading = false
                for (let dat of page.list) {
                  dat.deviceName = dopDevice.deviceName
                  dat.factoryNum = dopDevice.factoryNum
                }
                this.title = dopDevice.deviceName + '（' + dopDevice.factoryNum + '）'
                this.dataList = page.list
                this.totalCount = page.totalCount
              })
            })
          }
          this.getDeviceLendList(this.dataForm.deviceId).then(list => {
            this.processList = {
              applyLend: {},
              authLend: {},
              applyReturn: {},
              authReturn: {}
            }
            for (let lItem of list) {
              this.active = lItem.rentStatus
              this.dataForm.rentStatus = lItem.rentStatus
              switch (lItem.rentStatus) {
                case 1:
                  this.processList.processId = lItem.processId
                  this.processList.applyLend.applyManId = lItem.borrowerId
                  this.processList.applyLend.applyMan = lItem.borrowerName
                  this.processList.applyLend.applyTime = lItem.createTime
                  this.processList.applyLend.remark = lItem.remark
                  // 计算归还时间
                  this.processList.applyLend.returnTime = stringIsNull(lItem.lendDays) ? '未知' :
                    moment(new Date(lItem.createTime)).subtract('days', -lItem.lendDays).format('YYYY-MM-DD')
                  break
                case 2:
                  this.processList.authLend.authManId = lItem.lenderId
                  this.processList.authLend.authMan = lItem.lenderName
                  this.processList.authLend.authTime = lItem.createTime
                  this.processList.authLend.remark = lItem.remark
                  break
                case 3:
                  this.processList.applyReturn.applyManId = lItem.borrowerId
                  this.processList.applyReturn.applyMan = lItem.borrowerName
                  this.processList.applyReturn.returnTime = lItem.createTime
                  this.processList.applyReturn.remark = lItem.remark
                  break
                case 4:
                  this.processList.authReturn.authManId = lItem.lenderId
                  this.processList.authReturn.authMan = lItem.lenderName
                  this.processList.authReturn.authTime = lItem.createTime
                  this.processList.authReturn.remark = lItem.remark
                  break
                default:
                  break
              }
            }
          })
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
        this.getPageList()
      },
      // 获取数据列表
      getPageList () {
        return new Promise((resolve, reject) => {
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
              resolve(data.page)
            } else {
              this.dataList = []
              this.totalPage = 0
            }
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
      // 根据设备ID获取设备最新的租借情况
      getDeviceLendList (id) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/dop/device/list/${id}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      getInfoFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/dop/device/info/${this.dataForm.deviceId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.dopDevice)
            }
          })
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

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
  .main_card {
    display: flex;
    justify-content: flex-start;
  }
  .latest_item {
    width: 350px;
    min-height: 500px;
    .step_item{
      overflow-y: auto;
      max-height: 500px;
    }
  }
  .header{
    font-size: 14pt;
    font-weight: 700;
  }
  .font_span {
    color: mix(#000, $navbar--background-color, 50%);
  }
  .lend_row {
    margin-top: 15px;
    .lend_line {
      display: flex;
      .span_property {
        font-weight: bold;
        color: black;
        min-width: 70px;
      }
      .span_value {
        color: gray;
      }
    }
  }
</style>
