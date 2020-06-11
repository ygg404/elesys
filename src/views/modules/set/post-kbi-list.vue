<template>
  <div>
    <el-dialog customClass="customWidth" title='编辑考核项' :close-on-click-modal="false" :visible.sync="visible">
      <el-form>
        <el-form-item>
          <el-button size="large" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle">新增考核项</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="kbiList" border>
        <el-table-column label="考核项ID" prop="id" align="center" width="95"></el-table-column>
        <el-table-column label="考核项" prop="kbiName" ></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
      <el-button plain @click="gobackHandle">返回</el-button>
    </span>
    </el-dialog>
    <!-- 编辑考核项 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getKbiList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './post-kbi-add-or-update'

  export default {
    data () {
      return {
        visible: false,
        addOrUpdateVisible: false,
        kbiList: []
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.getKbiList()
        })
      },
      getKbiList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/sys/kbi/list`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.kbiList = data.list
              resolve(data.list)
            }
          })
        })
      },
      // 删除考核项
      deleteHandle (item) {
        this.$confirm(`确定对考核项[${item.kbiName}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/kbi/delete'),
            method: 'post',
            data: this.$http.adornData([item.id], false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500
              });
              this.getKbiList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 编辑考核项
      addOrUpdateHandle (item) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(item.id)
        })
      },
      // 返回
      gobackHandle () {
        this.visible = false
        this.$emit('refreshDataList')
      }
    }
  }
</script>

<style scoped>
  .customWidth{
    width: 800px;
  }
</style>
