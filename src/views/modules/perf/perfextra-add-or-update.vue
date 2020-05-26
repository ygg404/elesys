<template>
  <el-dialog
    :title="'个人加减分编辑（  被考核人：' + checkUserItem.userName + '）'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="加减分项" prop="extraItem">
      <el-input v-model="dataForm.extraItem" placeholder="加减分项"></el-input>
    </el-form-item>
    <el-form-item label="计分标准" prop="standard">
      <el-input v-model="dataForm.standard" placeholder="计分标准"></el-input>
    </el-form-item>
    <el-form-item label="说明" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="说明"></el-input>
    </el-form-item>
    <el-form-item label="加/减类型(0-加分类型；1-减分类型)" prop="extraType">
      <el-input v-model="dataForm.extraType" placeholder="加/减类型(0-加分类型；1-减分类型)"></el-input>
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
        extraList: [],
        checkUserItem: {},
        dataForm: {
          id: 0,
          extraItem: '',
          standard: '',
          remark: '',
          extraType: ''
        },
        dataRule: {
          extraItem: [
            { required: true, message: '加减分项不能为空', trigger: 'blur' }
          ],
          standard: [
            { required: true, message: '计分标准不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '说明不能为空', trigger: 'blur' }
          ],
          extraType: [
            { required: true, message: '加/减类型(0-加分类型；1-减分类型)不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.checkUserItem = item
        this.visible = true
        this.getExtralist().then(extraList => {
          this.extraList = extraList
          this.getExtraScoreList(item)
        })
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        //   if (this.dataForm.id) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/perf/perfextra/info/${this.dataForm.id}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({data}) => {
        //       if (data && data.code === 0) {
        //         this.dataForm.extraItem = data.perfextra.extraItem
        //         this.dataForm.standard = data.perfextra.standard
        //         this.dataForm.remark = data.perfextra.remark
        //         this.dataForm.extraType = data.perfextra.extraType
        //       }
        //     })
        //   }
        // })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/perf/perfextra/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'extraItem': this.dataForm.extraItem,
                'standard': this.dataForm.standard,
                'remark': this.dataForm.remark,
                'extraType': this.dataForm.extraType
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
      // 获取加减分项列表
      getExtralist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extra/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 获取该年度用户的加减分的数据列表
      getExtraScoreList (item) {
        console.log(item)
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extrascoring/list'),
            method: 'get',
            params: this.$http.adornParams({
              year: item.year,
              updown: item.updown,
              checkedUserId: item.userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      }
    }
  }
</script>
