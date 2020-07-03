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
  export default {
    data () {
      return {
        visible: false,
        title: '',
        year: '',
        updown: '',
        kbiAuditList: []
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.year = item.checkYear
        this.updown = item.checkUpdown
        this.title = item.checkYear + '年' + (item.checkUpdown === 0 ? '上半年' : '下半年') + '   效能考核审核'
        console.log(item.checkUserList)
        this.getDataList().then(list => {
          let kbiAuditList = []
          // 获取审定后的效能考核表
          for (let checkUser of item.checkUserList) {
            kbiAuditList.push({
              'userId': checkUser.userId,
              'username': checkUser.username,
              'kbiScore': checkUser.kbiScore,  // 效能基准分
              'kbiAllScore': checkUser.kbiAllScore,   // 效能评分
              'kbiAuditScore': (checkUser.kbiAllScore > checkUser.kbiScore) ? checkUser.kbiAllScore: checkUser.kbiScore
            })
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
              updown: this.updown
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
            'updown': this.updown,
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
      }
    }
  }
</script>

<style scoped>

</style>
