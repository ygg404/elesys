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
            </template>
          </el-step>
          <el-step title="审批人同意">
            <template slot="description">
              <el-button @click="" :disabled="active !== 2" type="primary" size="small">批准出借</el-button>
            </template>
          </el-step>
          <el-step title="归还仪器" description="这是一段很长很长很长的描述性文字"></el-step>
          <el-step title="确定归还" description="这是一段很长很长很长的描述性文字"></el-step>
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
        processList: [], // 租借流程列表
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
</style>
