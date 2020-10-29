<template>
  <el-dialog :id="dataForm.deviceId"  append-to-body
    title="新增审请单据"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="出厂编号：" prop="factoryNum">
        <span class="font_span">{{dataForm.factoryNum}}</span>
      </el-form-item>
      <el-form-item label="仪器名称：" prop="deviceName">
        <span class="font_span">{{dataForm.deviceName}}</span>
      </el-form-item>
      <el-form-item label="借物人：" prop="borrowerName">
        <el-select v-model="dataForm.borrowerId">
          <el-option v-for="item in userList" :label="item.username" :key="item.userId" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批人：" prop="lenderName">
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
      <el-form-item label="预借天数：" prop="lendDays">
        <el-input v-model="dataForm.lendDays" placeholder="预借天数" type="number"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"  type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
          createTime: ''
        },
        dataRule: {
          deviceId: [
            { required: true, message: '仪器Id不能为空', trigger: 'blur' }
          ],
          borrowerId: [
            { required: true, message: '借物人Id不能为空', trigger: 'blur' }
          ],
          borrowerName: [
            { required: true, message: '借物人不能为空', trigger: 'blur' }
          ],
          lenderName: [
            { required: true, message: '审批人名称不能为空', trigger: 'blur' }
          ],
          rentStatus: [
            { required: true, message: '出借情况（已出借；已归还）不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
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
      init (item) {
        this.dataForm.deviceId = item.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getDeviceMamager()
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.deviceId) {
            this.getAllUserList()
            this.getDeviceFromApi(item.id)
            this.dataForm.rentStatus = 1
            this.dataForm.borrowerId = this.userId
          //   this.$http({
          //     url: this.$http.adornUrl(`/dop/history/info/${this.dataForm.id}`),
          //     method: 'get',
          //     params: this.$http.adornParams()
          //   }).then(({data}) => {
          //     if (data && data.code === 0) {
          //       this.dataForm.deviceId = data.dophistory.deviceId
          //       this.dataForm.borrowerId = data.dophistory.borrowerId
          //       this.dataForm.borrowerName = data.dophistory.borrowerName
          //       this.dataForm.lenderId = data.dophistory.lenderId
          //       this.dataForm.lenderName = data.dophistory.lenderName
          //       this.dataForm.lendDays = data.dophistory.lendDays
          //       this.dataForm.rentStatus = data.dophistory.rentStatus
          //       this.dataForm.remark = data.dophistory.remark
          //       this.dataForm.createTime = data.dophistory.createTime
          //     }
          //   })
          }
        })
      },
      // 获取设备信息
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
                'lenderId': this.dataForm.lenderId,
                'lenderName': this.dataForm.lenderName,
                'lendDays': this.dataForm.lendDays,
                'rentStatus': this.dataForm.rentStatus,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
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
