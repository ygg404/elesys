<template>
  <div>
    <div class="span_header">考核人员提交情况:<span>{{person}}</span>/<sapn style="color: #3b97d7">{{count}}</sapn></div>
    <div class="user_card">
      <el-table :data="uRoleList" border>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="是否提交">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAssess" type="primary">已提交</el-tag>
            <el-tag v-else type="info">未提交</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        uRoleList: [],
        dataForm: {
          curTime: ''
        },
        person: 0,
        count: 0
      }
    },
    methods: {
      init (dataForm) {
        this.dataForm = dataForm

        this.getUaccessList().then(list => {
          this.uRoleList = list
          this.person = this.getAssessPerson(list)
        })
        this.getAttendCount().then(count => {
          this.count = count
        })
      },
      // 获取已经评分的用户列表
      getUaccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/getUcheckList`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curTime.getFullYear(),
              month: this.dataForm.curTime.getMonth() + 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              let list = []
              for (let dat of data.list) {
                if (dat.isAttend === 1) {
                  list.push(dat)
                }
              }
              resolve(list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 显示参加评选人数
      getAssessPerson (list) {
        let person = 0
        for (let assess of list) {
          if (assess.isAssess) person += 1
        }
        return person
      },
      // 需要参加评选的人数
      getAttendCount () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/getCount`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curTime.getFullYear(),
              month: this.dataForm.curTime.getMonth() + 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.count)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  .user_card {
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 5px 5px 3px #1fd3e9;
    border: 1px solid #1fd3e9;
  }
  .span_header {
    font-weight: 700;
    padding: 5px;
    font-size: 11pt;
  }
  .span_header span{
    color: green;
  }
</style>
