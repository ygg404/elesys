<template>
  <el-dialog width="40%"
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <table border="1" cellspacing="0">
      <tr class="field"><th>姓名</th><th><el-checkbox v-model="allChecked" @change="allCheckedHandle"></el-checkbox>是否参评</th></tr>
      <tr v-for="item in kbiPersonList" :key="item.userId" style="text-align: center">
        <td>{{item.username}}</td><td><el-checkbox v-model="item.isAttend"></el-checkbox></td>
      </tr>
    </table>

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
        updown: '',
        allChecked: false,
        dataListSelections: [],
        kbiPersonList: []   // 参评人员列表
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.$nextTick( () => {
          this.year = item.checkYear
          this.updown = item.checkUpdown
          this.title = '设置 ： ' + item.checkYear + '年' + (item.checkUpdown === 0 ? '上半年' : '下半年') + '   的参评人员'
          this.getDataList().then(list => {

            // let dataListSelections = []
            for (let dat of list) {
              if (dat.isAttend === 1) {
                dat.isAttend = true
              } else {
                dat.isAttend = false
              }
            }
            this.kbiPersonList = list
            // for (let key in list) {
            //   console.log(key)
            //   if (list[key]['isAttend'] === 1) {
            //     this.$refs.personTable.toggleRowSelection( this.kbiPersonList[key],true)
            //     // dataListSelections.push(person)
            //   }
            // }
            // console.log(this.dataListSelections = dataListSelections)
          })
        })
      },
      getDataList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbiperson/list`),
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
        let kbiPersonList = []
        for (let item of this.kbiPersonList) {
          if (item.isAttend) {
            let personItem = {
              userId: item.userId,
              year: this.year,
              updown: this.updown
            }
            kbiPersonList.push(personItem)
          }
        }
        this.$http({
          url: this.$http.adornUrl(`/ren/kbiperson/save`),
          method: 'post',
          data: this.$http.adornData({
            'year': this.year,
            'updown': this.updown,
            'kbiPersonList': kbiPersonList,
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
      // 多选
      allCheckedHandle () {
        for (let item of this.kbiPersonList) {
          if (this.allChecked) {
            item.isAttend = true
          } else {
            item.isAttend = false
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
