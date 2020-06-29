<template>
  <div class="mod-config">
    <div style="display:flex">
      <table class="dataTabble" border="1" cellspacing="0">
        <thead>
        <tr class="header">
          <th colspan="5">职务效能分计算方法表</th>
        </tr>
        </thead>
        <tr class="field">
          <td>职务</td><td>效能基准分</td><td>未考核的效能基准分</td><td>试用期的效能基准分</td><td>操作</td>
        </tr>
        <tr v-for="(item,id) in dutyList" :key="item.dutyId" class="content">
          <td>{{item.dutyName}}</td>
          <td>{{item.standardScore}}</td>
          <td>{{item.assessnoScore}}</td>
          <td>{{item.trialScore}}</td>
          <td width="100">
            <div class="tabopa">
              <el-button @click="addOrUpdateDutyHandle(item.dutyId)" size="small" type="primary">修改</el-button>
            </div>
          </td>
        </tr>
      </table>
      <table class="dataTabble" border="1" cellspacing="0">
        <thead>
        <tr class="header">
          <th colspan="5">职称效能分计算方法表</th>
        </tr>
        </thead>
        <tr class="field">
          <td>职称</td><td>效能基准分</td><td>未考核的效能基准分</td><td>试用期的效能基准分</td><td>操作</td>
        </tr>
        <tr v-for="(item,id) in titleList" :key="item.titleId" class="content">
          <td>{{item.titleName}}</td>
          <td>{{item.standardScore}}</td>
          <td>{{item.assessnoScore}}</td>
          <td>{{item.trialScore}}</td>
          <td width="100">
            <div class="tabopa">
              <el-button @click="addOrUpdateTitleHandle(item.titleId)" size="small" type="primary">修改</el-button>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!--职务效能分  弹窗, 新增 / 修改 -->
    <scorekbiduty-add-or-update v-if="dutyaddOrUpdateVisible" ref="scorekbidutyAddOrUpdate" @refreshDataList="getDataList"></scorekbiduty-add-or-update>
    <!--职称效能分  弹窗, 新增 / 修改 -->
    <scorekbititle-add-or-update v-if="titleaddOrUpdateVisible" ref="scorekbititleAddOrUpdate" @refreshDataList="getDataList"></scorekbititle-add-or-update>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import scorekbidutyAddOrUpdate from './scorekbiduty-add-or-update'
  import scorekbititleAddOrUpdate from './scorekbititle-add-or-update'

  export default {
    data () {
      return {
        dutyList: [],
        titleList: [],
        dataListLoading: false,
        dutyaddOrUpdateVisible: false,
        titleaddOrUpdateVisible: false
      }
    },
    components: {
      draggable,
      scorekbidutyAddOrUpdate,
      scorekbititleAddOrUpdate
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/set/scorekbiduty/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dutyList = data.list
          } else {
            this.dutyList = []
          }
          this.dataListLoading = false
        })
        this.$http({
          url: this.$http.adornUrl('/set/scorekbititle/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.titleList = data.list
          } else {
            this.titleList = []
          }
          this.dataListLoading = false
        })
      },
      // 职务 新增 / 修改
      addOrUpdateDutyHandle (id) {
        this.dutyaddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.scorekbidutyAddOrUpdate.init(id)
        })
      },
      // 职称 新增 / 修改
      addOrUpdateTitleHandle (id) {
        this.titleaddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.scorekbititleAddOrUpdate.init(id)
        })
      }
    }
  }
</script>

<style scoped>
  .addScore {
    padding: 10px;
  }
  .dataTabble{
    width: 450px;
  }

  .dataTabble .header{
    color: white;
    background: #169fe6;
    width: 100%;
    font-weight: 700;
    font-size: 16pt;
    line-height: 200%;

  }
  .dataTabble .field{
    font-size: 12pt;
    text-align: center;
    padding: 5px;
    line-height: 150%;
    font-weight: 700;
  }
  .dataTabble .content{
    font-size: 10pt;
    text-align: center;
    line-height: 150%;
  }
  .dataTabble .content .tabopa{
    padding: 3px;
  }
</style>
