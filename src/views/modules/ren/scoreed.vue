<template>
  <div >
    <div class="addScore">
      <el-button type="primary" size="large" icon="el-icon-plus" @click="addOrUpdateHandle()">新增学历分项</el-button>
    </div>
    <div style="display: flex;">
      <table class="dataTabble" border="1">
        <thead>
        <tr class="header">
          <th colspan="3">学制系数</th>
        </tr>
        </thead>
        <tr class="field"><td>对应项</td><td>分数</td><td>操作</td>
        </tr>
        <draggable v-model="edList" element="tbody" :move="getdata" @update="datadragEnd">
          <tr v-for="(item,id) in edList" :key="item.id" class="content" v-if="item.cateid == 1">
            <td>{{item.scoreName}}</td>
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
      <table class="dataTabble" border="1">
        <thead>
        <tr class="header">
          <th colspan="3">专业系数</th>
        </tr>
        </thead>
        <tr class="field"><td>对应项</td><td>分数</td><td>操作</td>
        </tr>
        <draggable v-model="edList" element="tbody" :move="getdata" @update="datadragEnd">
          <tr v-for="(item,id) in edList" :key="id" class="content" v-if="item.cateid == 2">
            <td>{{item.scoreName}}</td>
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
      <table class="dataTabble" border="1">
        <thead>
        <tr class="header">
          <th colspan="3">学历系数</th>
        </tr>
        </thead>
        <tr class="field"><td>对应项</td><td>分数</td><td>操作</td>
        </tr>
        <draggable v-model="edList" element="tbody" :move="getdata" @update="datadragEnd">
          <tr v-for="(item,id) in edList" :key="item.id" class="content" v-if="item.cateid == 3">
            <td>{{item.scoreName}}</td>
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
  import AddOrUpdate from './scoreed-add-or-update'
  export default {
    data () {
      return {
        edList: [],   // 学历分对照表
        scoreedVisible: false,
        dragItem: {},  // 拖拽的行
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
          url: this.$http.adornUrl('/ren/scoreed/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.edList = data.list
          } else {
            this.edList = []
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
        var ids = item.id ? [item.id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对选项 [${item.scoreName}] 进行[${ids ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ren/scoreed/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
        let preItem = this.dragItem
        let nextItem = this.dragItem
        let index = -1
        for (let dat of this.edList) {
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
          url: this.$http.adornUrl('/ren/scoreed/changeSort'),
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
    width: 320px;
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
