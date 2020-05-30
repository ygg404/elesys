<template>
    <div class="user_card">
      <div class="span_header">参评人数:<span>{{person}}</span></div>
      <el-table :data="uRoleList" border>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="是否提交">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAssess" type="primary">已提交</el-tag>
            <el-tag v-else type="info">未提交</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        uRoleList: [],
        dataForm: {
          curYear: '',
          updown: 0
        },
        person: 0
      }
    },
    methods: {
      init (dataForm) {
        this.dataForm = dataForm
        this.getUaccessList().then(list => {
          this.uRoleList = list
          this.person = this.getAssessPerson(list)
        })
      },
      // 获取已经评分的用户列表
      getUaccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/uAssessList`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curYear.getFullYear(),
              updown: this.dataForm.updown
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
      // 显示参加评选人数
      getAssessPerson (list) {
        let person = 0
        for (let assess of list) {
          if (assess.isAssess) person += 1
        }
        return person
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
