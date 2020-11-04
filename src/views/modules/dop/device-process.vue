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
              <el-button @click="applyLendHandle" :disabled="active !== 1" type="primary" size="small" icon="el-icon-edit">申请</el-button>
              <div class="lend_row">
                <el-row class="lend_line">
                  <div class="span_property">申请人：</div><div :span="16" class="span_value">{{processList.applyLend.applyMan}}</div>
                </el-row>
                <el-row class="lend_line">
                  <div class="span_property">申请时间：</div><div :span="16" class="span_value">{{processList.applyLend.applyTime}}</div>
                </el-row>
                <el-row class="lend_line">
                  <div class="span_property">预计归还时间：</div><div :span="16" class="span_value">{{processList.applyLend.returnTime}}</div>
                </el-row>
                <el-row class="lend_line">
                  <div class="span_property">备注：</div><div :span="16" class="span_value">{{processList.applyLend.remark}}</div>
                </el-row>
              </div>
            </template>
          </el-step>
          <el-step title="审批人同意">
            <template slot="description">
              <el-button @click="applyLendHandle" :disabled="active !== 2" type="primary" size="small" icon="el-icon-user-solid">批准出借</el-button>
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
              <el-button  @click="applyLendHandle" :disabled="active !== 3" type="primary" size="small" icon="el-icon-edit">归还</el-button>
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
              <el-button @click="applyLendHandle" :disabled="active !== 4" type="primary" size="small" icon="el-icon-user-solid">确认归还</el-button>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle" type="primary" plain>返回</el-button>
    </span>
    <!-- 申请仪器的弹窗-->
    <history-add-or-update ref="historyAddOrUpdate" v-if="historyVisible" @refreshDataList="init"></history-add-or-update>
  </el-dialog>
</template>

<script>
  import historyAddOrUpdate from './history-add-or-update'
  import {stringIsNull} from '@/utils'
  import moment from 'moment'

  export default {
    data () {
      return {
        visible: false,
        historyVisible: false,
        active: 0,
        // 借还流程
        processList: {
          applyLend: {},
          authLend: {},
          applyReturn: {},
          authReturn: {}
        },
        // 租借流程列表
        dataForm: {
          id: 0,
          deviceName: '',
          factoryNum: '',
          rentStatus: 0
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
          this.processList = {
            processId: '',
            // 申请借物
            applyLend: {
              applyManId: '',
              applyMan: '',   // 申请人
              applyTime: '',   // 申请时间
              returnTime: ''
            },
            // 同意出借
            authLend: {
              authManId: '',
              authMan: '',    // 审批人
              authTime: '',   // 批准时间
              remark: ''
            },
            // 归还借物
            applyReturn: {
              applyManId: '',
              applyMan: '',
              returnTime: ''
            },
            // 确认归还
            authReturn: {
              authManId: '',
              authMan: '',
              authTime: ''
            }
          }
          this.getDeviceFromApi(item.id).then(dopDev => {
            this.dataForm.id = dopDev.id
            this.dataForm.deviceName = dopDev.deviceName
            this.dataForm.factoryNum = dopDev.factoryNum
            // 仪器闲置中
            this.getDeviceLendList(item.id).then(list => {
              if (list.length === 0 || (dopDev.devStation === 0 && list.length >= 4)) {
                this.active = 1
                this.dataForm.rentStatus = 0
              } else {
                for (let lItem of list) {
                  this.active = lItem.rentStatus + 1
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
              }
            })
          })
        })
      },
      // 出借物借还流程
      applyLendHandle () {
        this.historyVisible = true
        this.$nextTick(() => {
          console.log(this.dataForm)
          this.$refs.historyAddOrUpdate.init(this.dataForm, this.processList)
        })
      },
      getDeviceFromApi (id) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/dop/device/info/${id}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.dopDevice)
            } else {
              this.$message.error(data.msg)
            }
          })
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
      // 关闭窗口
      closeHandle () {
        this.visible = false
        this.$emit('refreshDataList')
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
