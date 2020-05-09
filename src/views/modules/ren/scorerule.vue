<template>
  <div class="mod-config">
    <el-tabs v-model="activeName" type="border-card" >
      <el-tab-pane label="学历分对照表" name="first">
        <scoreed></scoreed>
      </el-tab-pane>

      <el-tab-pane label="职称基准分表" name="second">
        <scorejob></scorejob>
      </el-tab-pane>

      <el-tab-pane label="职级及房补表" name="third">
        <scorehouse></scorehouse>
      </el-tab-pane>

      <el-tab-pane label="职务评分表" name="fourth">
        <scoreduty></scoreduty>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import scoreduty from './scoreduty'
  import scorehouse from './scorehouse'
  import scoreed from './scoreed'
  import scorejob from './scorejob'

  export default {
    data () {
      return {
        activeName: 'first',
        dutyList: [],
        houseList: [],
        jobList: []
      }
    },
    components: {
      scorejob,
      scorehouse,
      scoreed,
      scoreduty
    },
    methods: {
    }
  }
</script>

<style scoped>
</style>
