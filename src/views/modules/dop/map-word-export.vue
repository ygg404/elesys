<template>
  <el-dialog
    title="标注信息Word导出"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div v-loading="loading" class="code_content" element-loading-text="导出中请稍等...">
      <el-tree :data="treeList" show-checkbox node-key="id" :props="defaultProps"  highlight-current current-node-key
               :expand-on-click-node="true" default-expand-all="true">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.icon"></i>{{ node.label }}</span>
              </span>
      </el-tree>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary" plain>取消</el-button>
      <el-button type="primary" @click="exportWordHandle()">导出</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'

  export default {
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        loading: false,
        visible: false,
        treeList: []
      }
    },
    methods: {
      init (id) {
        console.log(id)
        this.visible = true
        this.$nextTick(() => {
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/dop/bmap/list`),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              for (let bPoint of data.list) {
                switch (bPoint.type) {
                  // 点
                  case 1:
                    bPoint.icon = 'el-icon-s-opportunity'
                    break
                  // 线
                  case 2:
                    bPoint.icon = 'el-icon-s-marketing'
                    break
                  // 面
                  case 3:
                    bPoint.icon = 'el-icon-picture'
                    break
                  default:
                    bPoint.icon = 'el-icon-folder'
                    break
                }
              }
              this.treeList = treeDataTranslate(data.list)
            })
          }
        })
      },
      // 导出Word接口
      exportWordHandle () {
        let bmapId = this.selectNode.id
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/dop/bmap/exportWord'),
          method: 'get',
          params: this.$http.adornParams({
            bmapId: bmapId
          }),
          withCredentials: false, // 允许携带cookie
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          responseType: 'blob'
        }).then(({data}) => {
          console.log(data)
          let projectName = this.selectNode.label
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(data) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = projectName + '.zip' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          this.dataListLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
