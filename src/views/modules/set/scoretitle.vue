<template>
  <div class="mod-config">
    <el-form :inline="true" >
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" size="large" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <div style="display: flex;">
    <table class="dataTabble" border="1" cellspacing="0">
      <thead>
      <tr class="header">
        <th colspan="5">职称基准分对照表</th>
      </tr>
      </thead>
      <tr class="field">
        <td>职称</td><td>分数</td><td>操作</td>
      </tr>
      <draggable v-model="jobList" element="tbody" :move="getdata" @update="datadragEnd">
        <tr v-for="(item,id) in jobList" :key="item.id" class="content" v-if="item.cateid == 1">
          <td>{{item.jobTitle}}</td>
          <td>{{item.score}}</td>
          <td width="150">
            <div class="tabopa">
              <el-button @click="addOrUpdateHandle(item.id)" size="small" type="primary">修改</el-button>
              <el-button @click="deleteHandle(item)" size="small" type="danger">删除</el-button>
            </div>
          </td>
        </tr>
      </draggable>
    </table>

    <table class="dataTabble" border="1" cellspacing="0" style="width:400px;margin-left: 4px;">
      <thead>
      <tr class="header">
        <th colspan="5">职称专业系数分对照表</th>
      </tr>
      </thead>
      <tr class="field">
        <td>职称专业系数</td><td>分数</td><td>操作</td>
      </tr>
      <draggable v-model="jobList" element="tbody" :move="getdata" @update="datadragEnd">
        <tr v-for="(item,id) in jobList" :key="item.id" class="content" v-if="item.cateid == 2">
          <td>{{item.jobTitle}}</td>
          <td>{{item.score}}</td>
          <td width="150">
            <div class="tabopa">
              <el-button @click="addOrUpdateHandle(item.id)" size="small" type="primary">修改</el-button>
              <el-button @click="deleteHandle(item)" size="small" type="danger">删除</el-button>
            </div>
          </td>
        </tr>
      </draggable>
    </table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import AddOrUpdate from './scoretitle-add-or-update'

  export default {
    data () {
      return {
        jobList: [],
        titleList: [],
        titleProList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      draggable
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/set/scoretitle/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.jobList = data.list
          } else {
            this.jobList = []
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
      // 删除
      deleteHandle (item) {
        this.$confirm(`确定对[职称：${item.jobTitle}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/scoretitle/delete'),
            method: 'post',
            data: this.$http.adornData([item.id], false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 拖动中与拖动结束
      getdata (evt) {
        this.dragItem = evt.draggedContext.element
      },
      datadragEnd (evt) {
        console.log(evt)
        let preItem = this.dragItem
        let nextItem = this.dragItem
        let index = -1
        for (let dat of this.jobList) {
          if (dat.cateid === this.dragItem.cateid) {
            index += 1
            // 顺序上升
            if (evt.newIndex < evt.oldIndex && evt.newIndex + 1 === index) {
              nextItem = dat
            }
            // 顺序下降
            if (evt.newIndex > evt.oldIndex && evt.newIndex - 1 === index) {
              nextItem = dat
            }
          }
        }
        console.log('拖动前的索引 :' + preItem.orderNum)
        console.log('拖动后的索引 :' + nextItem.orderNum)
        this.$http({
          url: this.$http.adornUrl('/set/scoretitle/changeSort'),
          method: 'get',
          params: this.$http.adornParams({
            preOrderNum: preItem.orderNum,
            nextOrderNum: nextItem.orderNum,
            cateid: preItem.cateid
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '改变顺序成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
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
    width: 550px;
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
    cursor: Move;
    line-height: 150%;
  }
  .dataTabble .content .tabopa{
    padding: 3px;
  }
</style>
