<template>
  <div class="mod-config">
    <el-tabs v-model="activeName" type="border-card" >
      <el-tab-pane label="学历分对照表" name="first">
        <scoreed></scoreed>
      </el-tab-pane>
      <el-tab-pane label="职级及房补表" name="second">
        <scorehouse></scorehouse>
      </el-tab-pane>
      <el-tab-pane label="职称基准分表" name="third">
        <scoretitle></scoretitle>
      </el-tab-pane>
      <el-tab-pane label="职务评分表" name="fourth">
        <scoreduty></scoreduty>
      </el-tab-pane>
      <el-tab-pane label="效能分计算方法表" name="fifth">
        <scorekbi></scorekbi>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import scoreduty from './scoreduty'
  import scorehouse from './scorehouse'
  import scoreed from './scoreed'
  import scoretitle from './scoretitle'
  import scorekbi from './scorekbi'

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
      scoretitle,
      scorehouse,
      scoreed,
      scoreduty,
      scorekbi
    },
    methods: {
    }
  }
</script>

<style scoped>
</style>
