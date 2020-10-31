<template>
  <el-dialog :id="dataForm.deviceId" width="75%"
             title="仪器设备借记流程"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="120px">
      <el-form-item label="出厂编号：" prop="factoryNum">
        <span class="font_span">{{this.dataForm.factoryNum}}</span>
      </el-form-item>
      <el-form-item label="仪器名称：" prop="deviceName">
        <span  class="font_span">{{this.dataForm.deviceName}}</span>
      </el-form-item>
    </el-form>
    <el-card>
      <template slot="header">
        <span class="header">借还步骤</span>
      </template>
      <div>
        <el-steps :active="active">
          <el-step title="申请出借">
            <template slot="description">
              <el-button @click="applyLendHandle" :disabled="active !== 1" type="primary" size="small">申请</el-button>
              <div class="lend_row">
                <el-row class="lend_line">
                  <div class="span_property">申请人：</div><div :span="16" class="span_value">{{processList.applyLend.applyMan}}</div>
                </el-row>
                <el-row class="lend_line">
                  <div class="span_property">申请时间：</div><div :span="16" class="span_value">{{processList.applyLend.applyTime}}</div>
                </el-row>
              </div>
            </template>
          </el-step>
          <el-step title="审批人同意">
            <template slot="description">
              <el-button @click="" :disabled="active !== 2" type="primary" size="small">批准出借</el-button>
              <div class="lend_row">
                <el-row class="lend_line">
                  <div class="span_property">审批人：</div><div :span="16" class="span_value">{{processList.applyLend.authMan}}</div>
                </el-row>
                <el-row class="lend_line">
                  <div class="span_property">审批时间：</div><div :span="16" class="span_value">{{processList.applyLend.authTime}}</div>
                </el-row>
              </div>
            </template>
          </el-step>
          <el-step title="归还仪器">
            <template slot="description">
              <el-button @click="" :disabled="active !== 3" type="primary" size="small">归还</el-button>
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
              <el-button @click="" :disabled="active !== 4" type="primary" size="small">确认归还</el-button>
              <div class="lend_row">
                <el-row class="lend_line">
                  <div class="span_property">审定人：</div><div :span="16" class="span_value">{{processList.authReturn.authMan}}</div>
                </el-row>
                <el-row class="lend_line">
                  <div class="span_property">审定时间：</div><div :span="16" class="span_value">{{processList.authReturn.authTime}}</div>
                </el-row>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 申请仪器的弹窗-->
    <history-add-or-update ref="historyAddOrUpdate" v-if="historyVisible"></history-add-or-update>
  </el-dialog>
</template>

<script>
  import historyAddOrUpdate from './history-add-or-update'

  export default {
    data () {
      return {
        visible: false,
        historyVisible: false,
        active: 0,
        // 借还流程
        processList: {
          // 申请借物
          applyLend: {
            applyMan: '',   // 申请人
            applyTime: ''   // 申请时间
          },
          // 同意出借
          authLend: {
            authMan: '',    // 审批人
            authTime: ''    // 批准时间
          },
          // 归还借物
          applyReturn: {
            applyMan: '',
            returnTime: ''
          },
          // 确认归还
          authReturn: {
            authMan: '',
            authTime: ''
          }
        }, // 租借流程列表
        dataForm: {
          id: 0,
          deviceName: '',
          factoryNum: ''
        }
      }
    },
    components: {
      historyAddOrUpdate
    },
    methods: {
      init (item) {
        this.visible = true
        this.$nextTick(() => {
          this.getDeviceFromApi(item.id)
          this.getDeviceLendList(item.id)
          this.active = 1
        })
      },
      applyLendHandle () {
        this.historyVisible = true
        this.$nextTick(() => {
          this.$refs.historyAddOrUpdate.init(this.dataForm)
        })
      },
      getDeviceFromApi (id) {
        this.$http({
          url: this.$http.adornUrl(`/dop/device/info/${id}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.id = data.dopDevice.id
            this.dataForm.deviceName = data.dopDevice.deviceName
            this.dataForm.factoryNum = data.dopDevice.factoryNum
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 根据设备ID获取设备最新的租借情况
      getDeviceLendList (id) {
        this.$http({
          url: this.$http.adornUrl(`/dop/device/list/${id}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            for (let lItem of data.list) {
              this.active = lItem.rentStatus + 1
              console.log(lItem)
              switch (lItem.rentStatus) {
                case 1:
                  this.processList.applyLend.applyMan = lItem.borrowerName
                  this.processList.applyLend.applyTime = lItem.createTime
                  break
                case 2:
                  break
                default:
                  break
              }
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
  .header {
    font-size: 14pt;
    font-weight: 700;
  }
  .font_span {
    color: $--color-primary;
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
        color: $--color-primary;
      }
    }
  }
</style>
