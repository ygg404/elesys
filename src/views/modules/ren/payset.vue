<template>
  <div class="mod-config">
    <el-card>
      <template slot="header">
        <div class="pay_item_title">
          <span>默认工资设置</span>
        </div>
      </template>
      <el-table :data="dataList" border   style="width: 100%;">
        <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
        <el-table-column prop="baseSalary" header-align="center" align="center" label="基本工资"></el-table-column>
        <el-table-column prop="workSalary" header-align="center" align="center" label="职务工资"></el-table-column>
        <el-table-column prop="titleSalary" header-align="center" align="center" label="职称工资"></el-table-column>
        <el-table-column prop="housingSalary" header-align="center" align="center" label="住房补贴"></el-table-column>
        <el-table-column prop="pcSalary" header-align="center" align="center" label="电脑补贴"></el-table-column>
        <el-table-column prop="createDate" header-align="center" align="center" label="修改时间"  width="170"></el-table-column>
<!--        <el-table-column prop="socialSalary" header-align="center" align="center" label="社保"></el-table-column>-->
<!--        <el-table-column prop="cutPay" header-align="center" align="center" label="扣款"></el-table-column>-->
        <el-table-column  header-align="center" align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="editPaysetHandle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 弹窗, 新增 / 修改  工资设置-->
    <payset-add-or-update v-if="paysetVisible" ref="paysetAddOrUpdate" @refreshDataList="getSalarySetlist()"></payset-add-or-update>
  </div>
</template>

<script>
  import paysetAddOrUpdate from './payset-add-or-update'

  export default {
    data () {
      return {
        dataList: [],
        paysetVisible: false
      }
    },
    components: {
      paysetAddOrUpdate
    },
    activated () {
      this.getSalarySetlist()
    },
    methods: {
      getSalarySetlist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/salaryset/list`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      editPaysetHandle (item) {
        this.paysetVisible = true
        this.$nextTick(() => {
          this.$refs.paysetAddOrUpdate.init(item)
        })
      }
    }
  }
</script>

<style scoped>
  .pay_item_title{
    width: 99%;
    font-size: 14pt;
    font-weight: 700;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    display: flex;
    justify-content: space-between;
  }
</style>
