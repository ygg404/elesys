<template>
  <el-dialog :id="dataForm.deviceId + dataForm.rentStatus"  append-to-body
    :title="dataForm.rentStatus % 2 == 1 ? '仪器审请单据' : '出借审定单据'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="(dataForm.rentStatus == 1 || dataForm.rentStatus == 3) ? bDataRule : aDataRule" ref="dataForm" label-width="120px">
      <el-form-item label="出厂编号：" prop="factoryNum">
        <span class="font_span">{{dataForm.factoryNum}}</span>
      </el-form-item>
      <el-form-item label="仪器名称：" prop="deviceName">
        <span class="font_span">{{dataForm.deviceName}}</span>
      </el-form-item>
      <el-form-item label="借物人：" prop="borrowerName">
        <el-select v-model="dataForm.borrowerId" :disabled="dataForm.rentStatus > 1">
          <el-option v-for="item in userList" :label="item.username" :key="item.userId" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批人：" prop="lenderName" v-if="dataForm.rentStatus % 2 == 0">
        <el-select v-model="dataForm.lenderId">
          <el-option v-for="item in dManagerList" :label="item.username" :key="item.userId" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>
      <!--1-申请出借,2-批准出借,3-归还仪器, 4-确定归还-->
      <el-form-item label="出借情况：" prop="rentStatus">
        <span class="font_span" v-if="dataForm.rentStatus == 1">申请出借</span>
        <span class="font_span" v-if="dataForm.rentStatus == 2">批准出借</span>
        <span class="font_span" v-if="dataForm.rentStatus == 3">归还仪器</span>
        <span class="font_span" v-if="dataForm.rentStatus == 4">确定归还</span>
      </el-form-item>
      <el-form-item label="预借天数：" prop="lendDays" v-if="dataForm.rentStatus === 1">
        <el-input v-model="dataForm.lendDays" placeholder="预借天数" type="number"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"  type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary" plain>返回</el-button>
      <el-button @click="disagreeHandle" type="danger" v-if="dataForm.rentStatus == 2">撤销</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import {stringIsNull} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        dManagerList: [],
        userList: [],
        dataForm: {
          id: 0,
          deviceId: '',
          deviceName: '',
          borrowerId: '',
          borrowerName: '',
          lenderId: '',
          lenderName: '',
          lendDays: '',
          rentStatus: '',
          remark: '',
          processId: ''
        },
        // 借物人表单检验
        bDataRule: {
          deviceId: [
            { required: true, message: '仪器Id不能为空', trigger: 'blur' }
          ],
          borrowerId: [
            { required: true, message: '借物人Id不能为空', trigger: 'blur' }
          ],
          borrowerName: [
            { required: true, message: '借物人不能为空', trigger: 'blur' }
          ],
          rentStatus: [
            { required: true, message: '出借情况不能为空', trigger: 'blur' }
          ]
        },
        // 审批人表单检验
        aDataRule: {
          deviceId: [
            { required: true, message: '仪器Id不能为空', trigger: 'blur' }
          ],
          lenderId: [
            { required: true, message: '审批人Id不能为空', trigger: 'blur' }
          ],
          lenderName: [
            { required: true, message: '审批人名称不能为空', trigger: 'blur' }
          ],
          rentStatus: [
            { required: true, message: '出借情况不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      }
    },
    methods: {
      init (item , processList) {
        this.dataForm.deviceId = item.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getDeviceMamager()
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.deviceId) {
            this.getAllUserList()
            this.getDeviceFromApi(item.id).then(dopDev => {
              this.dataForm.id = dopDev.id
              this.dataForm.deviceName = dopDev.deviceName
              this.dataForm.factoryNum = dopDev.factoryNum
            })
            this.dataForm.rentStatus = item.rentStatus + 1
            // 根据流程阶段
            switch (this.dataForm.rentStatus) {
              case 1:
                this.dataForm.borrowerId = this.userId
                break
              case 2:
                this.dataForm.processId = processList.processId
                this.dataForm.borrowerId = processList.applyLend.applyManId
                this.dataForm.borrowerName = processList.applyLend.applyMan
                break
              case 3:
                this.dataForm.processId = processList.processId
                this.dataForm.borrowerId = processList.applyLend.applyManId
                this.dataForm.borrowerName = processList.applyLend.applyMan
                break
              case 4:
                this.dataForm.processId = processList.processId
                break
              default:
                break
            }
          }
        })
      },
      // 获取设备信息
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
      // 获取所有用户列表
      getAllUserList () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/getAllUserList`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.userList = data.list
        })
      },
      // 获取仪器管理员
      getDeviceMamager () {
        let roleId = 2
        this.$http({
          url: this.$http.adornUrl(`/sys/user/getUserList/${roleId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.dManagerList = data.list
          if (data.list.length > 0 ) {
            this.dataForm.lenderId = data.list[0].userId
          }
        })
      },
      // 撤销申请人的申请出借要求
      disagreeHandle () {
        let tip = '是否撤销【' + this.dataForm.borrowerName + '】对仪器【' + this.dataForm.deviceName + '(' + this.dataForm.factoryNum + ')】的租借'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.rentStatus = 0
          this.dataFormSubmit()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.borrowerName = this.userList.find(item => item.userId === this.dataForm.borrowerId)['username']
        this.dataForm.lenderName = this.dManagerList.find(item => item.userId === this.dataForm.lenderId)['username']
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/dop/history/save`),
              method: 'post',
              data: this.$http.adornData({
                'deviceId': this.dataForm.deviceId,
                'borrowerId': this.dataForm.borrowerId,
                'borrowerName': this.dataForm.borrowerName,
                'lenderId': this.dataForm.rentStatus % 2 === 1 ? '' : this.dataForm.lenderId,
                'lenderName': this.dataForm.rentStatus % 2 === 1 ? '' : this.dataForm.lenderName,
                'lendDays': this.dataForm.lendDays,
                'rentStatus': this.dataForm.rentStatus,
                'processId': this.dataForm.processId,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                let item = {
                  id : this.dataForm.deviceId
                }
                // 提交后刷新借记流程
                this.visible = false
                this.$emit('refreshDataList' ,item)
              } else {
                this.$message.error(data.msg)
              }
            })
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
