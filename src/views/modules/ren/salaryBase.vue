<template>
  <div class="mod-config">
    <el-card>
      <el-form :inline="true" :model="dataForm">
        <el-form-item label="工资表时间：">
          <el-date-picker v-model="dataForm.payDate"   type="month"  placeholder="请选择工资表月份" class="pay_item"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-table border>

      </el-table>
    </el-card>
  </div>
</template>

<script>
  import  moment from 'moment'

  export default {
    data () {
      return {
        dataForm: {
          payDate: ''
        },
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        let datenow = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        this.dataForm.payDate = new Date(datenow.getFullYear(), datenow.getMonth(), 1)
      },
      getDataList () {

      }
    }
  }
</script>

<style scoped>

</style>
