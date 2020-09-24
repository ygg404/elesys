<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="仪器名称" prop="deviceName">
        <el-input v-model="dataForm.deviceName" placeholder="仪器名称"></el-input>
      </el-form-item>
      <el-form-item label="出厂编号" prop="factoryNum">
        <el-input v-model="dataForm.factoryNum" placeholder="出厂编号"></el-input>
      </el-form-item>
      <el-form-item label="生产厂家" prop="factoryName">
        <el-input v-model="dataForm.factoryName" placeholder="生产厂家"></el-input>
      </el-form-item>
      <el-form-item label="型号规格" prop="specNum">
        <el-input v-model="dataForm.specNum" placeholder="型号规格"></el-input>
      </el-form-item>
      <el-form-item label="标称精度" prop="accuracy">
        <el-input v-model="dataForm.accuracy" placeholder="标称精度"></el-input>
      </el-form-item>
      <el-form-item label="购置金额" prop="price">
        <el-input v-model="dataForm.price" placeholder="购置金额" type="number"></el-input>
      </el-form-item>
      <el-form-item label="购置时间" prop="buyTime">
        <el-date-picker v-model="dataForm.buyTime" type="month" value-format="yyyy-MM" placeholder="购置时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="检定时间" prop="lastCheckTime">
        <el-date-picker v-model="dataForm.lastCheckTime" type="month" value-format="yyyy-MM" placeholder="上次检修时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="有效期(年)" prop="indate">
        <el-input v-model="dataForm.indate" placeholder="有效期(年)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="设备状况" prop="devStation">
        <el-select v-model="dataForm.devStation" placeholder="设备状况" style="width: 110px;" >
          <el-option v-for="item in lendItemList" :label="item.lendItem" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="仪器证书" prop="fileName">
        <el-upload :action="upDopFileUrl"
                   :limit="1"
                   name="file"
                   ref="upload"
                   accept=".pdf,image/*"
                   :headers="tokenHeaders"
                   :before-upload="handleBeforeUpload"
                   :on-success="handleSuccess"
                   :on-error="handleError">
          <el-button size="small" plain>选择文件</el-button>
          <div slot="tip" style="color: dodgerblue" v-if="!stringIsNull(dataForm.fileName)">
            已上传文件:<el-tag closable size="normal" @close="deleteFileHandle">{{dataForm.fileName}}</el-tag>
          </div>
          <div slot="tip" class="el-upload__tip">只能上传pdf,图片文件，且不超过10M</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Vue from 'vue'
  import {stringIsNull} from '@/utils'
  import {getLendItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        visible: false,
        upDopFileUrl: window.SITE_CONFIG['baseUrl'] + '/dop/device/upDopFile/',  // 设备文件上传地址
        tokenHeaders: { token: Vue.cookie.get('token') },  // token请求
        lendItemList: getLendItem(),
        dataForm: {
          id: 0,
          deviceName: '',
          factoryNum: '',
          factoryName: '',
          specNum: '',
          accuracy: '',
          price: '',
          buyTime: '',
          devStation: '',
          lendStation: '',
          indate: '',
          lastCheckTime: '',
          fileName: '',
          remark: '',
          createTime: ''
        },
        dataRule: {
          deviceName: [
            {required: true, message: '仪器名称不能为空', trigger: 'blur'}
          ],
          factoryNum: [
            { required: true, message: '出厂编号不能为空', trigger: 'blur' }
          ],
          factoryName: [
            { required: true, message: '生产厂家不能为空', trigger: 'blur' }
          ],
          specNum: [
            { required: true, message: '型号规格不能为空', trigger: 'blur' }
          ],
          buyTime: [
            { required: true, message: '购置时间不能为空', trigger: 'blur' }
          ],
          devStation: [
            { required: true, message: '设置状况不能为空', trigger: 'blur' }
          ],
          indate: [
            {required: true, message: '有效期不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/dop/device/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deviceName = data.dopDevice.deviceName
                this.dataForm.factoryNum = data.dopDevice.factoryNum
                this.dataForm.factoryName = data.dopDevice.factoryName
                this.dataForm.specNum = data.dopDevice.specNum
                this.dataForm.accuracy = data.dopDevice.accuracy
                this.dataForm.price = data.dopDevice.price
                this.dataForm.buyTime = data.dopDevice.buyTime
                this.dataForm.devStation = data.dopDevice.devStation
                this.dataForm.lendStation = data.dopDevice.lendStation
                this.dataForm.lastCheckTime = data.dopDevice.lastCheckTime
                this.dataForm.fileName = data.dopDevice.fileName
                this.dataForm.indate = data.dopDevice.indate
                this.dataForm.remark = data.dopDevice.remark
                this.dataForm.createTime = data.dopDevice.createTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/dop/device/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deviceName': this.dataForm.deviceName,
                'factoryNum': this.dataForm.factoryNum,
                'factoryName': this.dataForm.factoryName,
                'specNum': this.dataForm.specNum,
                'accuracy': this.dataForm.accuracy,
                'price': this.dataForm.price,
                'buyTime': this.dataForm.buyTime,
                'devStation': this.dataForm.devStation,
                'lendStation': this.dataForm.lendStation,
                'lastCheckTime': this.dataForm.lastCheckTime,
                'indate': this.dataForm.indate,
                'fileName': this.dataForm.fileName,
                'remark': this.dataForm.remark,
                'createTime': this.dataForm.createTime
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
      },
      // 上传文件之前的钩子
      handleBeforeUpload (file) {
        let size = file.size / 1024 / 1024 / 10
        if (size > 10) {
          this.$message({
            message: '文件必须小于10M',
            type: 'warning',
            duration: 1500
          })
        }
      },
      // 文件上传成功时的钩子
      handleSuccess (res, file, fileList) {
        console.log(res.fileName)
        this.dataForm.fileName = res.fileName
        this.$message({
          message: '文件上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$refs.upload.clearFiles()
          }
        })
      },
      // 文件上传失败时的钩子
      handleError (err, file, fileList) {
        this.$message.error('文件上传失败')
      },
      // 取消上传文件
      deleteFileHandle () {
        this.dataForm.fileName = ''
      }
    }
  }
</script>
