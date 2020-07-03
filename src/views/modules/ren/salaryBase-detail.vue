<template>
  <el-dialog width="80%" title='个人工资计算明细'
             :close-on-click-modal="false" :visible.sync="visible">

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" >返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
      }
    },
    methods: {
      init () {
        this.visible = true
      }
    }
  }
</script>

<style scoped>

</style>
