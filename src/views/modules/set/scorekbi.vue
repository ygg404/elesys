<template>
  <div class="mod-config">
    <table class="dataTabble" border="1" cellspacing="0">
      <thead>
      <tr class="header">
        <th colspan="5">效能分计算方法表</th>
      </tr>
      </thead>
      <tr class="field">
        <td>职务</td><td>效能基准分</td><td>操作</td>
      </tr>
      <tr v-for="(item,id) in dataList" :key="item.dutyId" class="content">
        <td>{{item.dutyName}}</td>
        <td>{{item.standardScore}}</td>
        <td width="100">
          <div class="tabopa">
            <el-button @click="addOrUpdateHandle(item.dutyId)" size="small" type="primary">修改</el-button>
          </div>
        </td>
      </tr>

    </table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import AddOrUpdate from './scorekbi-add-or-update'

  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      draggable,
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/set/scorekbi/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
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
