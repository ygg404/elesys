<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-table border :data="kbiAuditList">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="kbiScore" label="效能基准分"></el-table-column>
      <el-table-column prop="kbiAllScore" label="效能评分"></el-table-column>
      <el-table-column prop="kbiAuditScore" label="审定后的效能评分">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.kbiAuditScore"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">审核确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {stringIsNull} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        title: '',
        year: '',
        month: '',
        kbiAuditList: []
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.year = item.checkYear
        this.month = item.checkMonth
        this.title = item.checkYear + '年' + (item.checkMonth) + '月   效能考核审核'
        this.getDataList().then(list => {
          let kbiAuditList = []
          console.log(item)
          // 获取审定后的效能考核表
          for (let checkUser of item.checkUserList) {
            kbiAuditList.push({
              'userId': checkUser.checkUserId,
              'username': checkUser.checkUserName,
              'kbiScore': checkUser.standardScore,  // 效能基准分
              'kbiAllScore': this.getFinalKbiScore(checkUser),   // 效能评分
              'kbiAuditScore': parseInt((this.getFinalKbiScore(checkUser) > checkUser.standardScore) ? this.getFinalKbiScore(checkUser): checkUser.standardScore)
            })
          }
          for (let dat of list) {
            for (let audit of kbiAuditList) {
              if (!stringIsNull(audit.kbiAuditScore) && dat.userId === audit.userId) {
                audit.kbiAuditScore = dat.kbiAuditScore
              }
            }
          }
          this.kbiAuditList = kbiAuditList
        })
      },
      getDataList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbiaudit/list`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.year,
              month: this.month
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      dataFormSubmit () {
        this.$http({
          url: this.$http.adornUrl(`/ren/kbiaudit/save`),
          method: 'post',
          data: this.$http.adornData({
            'year': this.year,
            'month': this.month,
            'kbiAuditList': this.kbiAuditList,
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
      },
      getFinalKbiScore (item) {
        if (stringIsNull(item.standardScore)) {
          return ''
        } else {
          return Math.round(parseInt((1 + (parseFloat(item.kbiAllScore) + parseFloat(item.finalExtra) - 75) * 0.6 / 75) * 100) * item.standardScore / 100)
        }
      },
    }
  }
</script>

<style scoped>

</style>
