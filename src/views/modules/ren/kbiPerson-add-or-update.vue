<template>
  <el-dialog width="40%"
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div style="display: flex">
      <table border="1" cellspacing="0" style="margin-left: 30px;">
        <tr>
          <th colspan="2" class="th_title">考核人员</th>
        </tr>
        <tr class="field"><th>姓名</th><th><el-checkbox v-model="allCheck" @change="allCheckHandle"></el-checkbox>是否参评</th></tr>
        <tr v-for="item in kbiCheckList" :key="item.userId" style="text-align: center">
          <td>{{item.username}}</td><td><el-checkbox v-model="item.isAttend"></el-checkbox></td>
        </tr>
      </table>


      <table border="1" cellspacing="0" style="margin-left: 100px;">
        <tr>
          <th colspan="2" class="th_title">被考核人员</th>
        </tr>
        <tr class="field"><th>姓名</th><th><el-checkbox v-model="allChecked" @change="allCheckedHandle"></el-checkbox>是否参评</th></tr>
        <tr v-for="item in kbiPersonList" :key="item.userId" style="text-align: center">
          <td>{{item.username}}</td><td><el-checkbox v-model="item.isAttend"></el-checkbox></td>
        </tr>
      </table>
    </div>


    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
        month: '',
        allChecked: false,
        allCheck: false,
        dataListSelections: [],
        kbiPersonList: [],  // 被考核人员列表
        kbiCheckList: []   // 考核人员列表
      }
    },
    methods: {
      init (item) {
        this.visible = true
        // 考核和被考核人员 默认是 非全选
        this.allChecked = false
        this.allCheck = false
        this.$nextTick( () => {
          this.year = item.checkYear
          this.month = item.checkMonth
          this.title = '设置 ： ' + item.checkYear + '年' + (item.checkMonth) + '月   的参评人员'
          this.getKbiPersonList().then(list => {
            for (let dat of list) {
              if (dat.isAttend === 1) {
                dat.isAttend = true
              } else {
                dat.isAttend = false
              }
            }
            this.kbiPersonList = list
          })
          this.getKbiCheckList().then(list => {
            for (let dat of list) {
              if (dat.isAttend === 1) {
                dat.isAttend = true
              } else {
                dat.isAttend = false
              }
            }
            this.kbiCheckList = list
          })
        })
      },
      // 被考核人员
      getKbiPersonList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbiperson/list`),
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
      // 考核人员
      getKbiCheckList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/list`),
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
        this.postPersonListToApi().then(success => {
          this.postCheckListToApi().then(success => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList')
          })
        })
      },
      // 提交考核人员
      postCheckListToApi () {
        return new Promise((resolve, reject) => {
          let kbiCheckList = []
          for (let item of this.kbiCheckList) {
            if (item.isAttend) {
              let personItem = {
                userId: item.userId,
                year: this.year,
                month: this.month
              }
              kbiCheckList.push(personItem)
            }
          }
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/save`),
            method: 'post',
            data: this.$http.adornData({
              'year': this.year,
              'month': this.month,
              'kbiCheckList': kbiCheckList
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 提交被考核人员
      postPersonListToApi () {
        return new Promise((resolve, reject) => {
          let kbiPersonList = []
          for (let item of this.kbiPersonList) {
            if (item.isAttend) {
              let personItem = {
                userId: item.userId,
                year: this.year,
                month: this.month
              }
              kbiPersonList.push(personItem)
            }
          }
          this.$http({
            url: this.$http.adornUrl(`/ren/kbiperson/save`),
            method: 'post',
            data: this.$http.adornData({
              'year': this.year,
              'month': this.month,
              'kbiPersonList': kbiPersonList,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 被考核人员多选
      allCheckedHandle () {
        for (let item of this.kbiPersonList) {
          if (this.allChecked) {
            item.isAttend = true
          } else {
            item.isAttend = false
          }
        }
      },
      // 考核人员多选
      allCheckHandle () {
        for (let item of this.kbiCheckList) {
          if (this.allCheck) {
            item.isAttend = true
          } else {
            item.isAttend = false
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "src/assets/scss/variables.scss";

  .th_title {
    color: $navbar--background-color;
  }

</style>
