<template>
  <el-card class="box_card" :body-style="{ padding: '3px' }">
    <div class="text_item">
      <div :underline="false" @click="readMenuHandle"><i class="el-icon-info"></i>  <span>详情&#12288&#12288</span></div>
    </div>
    <div class="text_item">
      <div :underline="false" @click="editMenuHandle"><i class="el-icon-edit"></i>  <span>编辑&#12288&#12288</span></div>
    </div>
    <div class="text_item">
      <div :underline="false" @click="copyMenuHandle"><i class="el-icon-document-copy"></i>  <span>复制&#12288&#12288</span></div>
    </div>
    <div class="text_item">
      <div :underline="false" @click="cutMenuHandle"><i class="el-icon-scissors"></i>  <span>剪切&#12288&#12288</span></div>
    </div>
    <div class="text_item" :style="'display:' + (selectNode.type === 0 && !stringIsNull(copyItem.data) ? 'block': 'none')">
      <div :underline="false" @click="pasteMenuHandle"><i class="el-icon-copy-document"></i>  <span>粘贴&#12288&#12288</span></div>
    </div>
    <div class="text_item add_item_box" v-if="selectNode.type === 0">
      <el-link :underline="false"><i class="el-icon-plus"></i>  <span>创建对象 》</span></el-link>
      <!--副面板 添加元素-->
      <el-card class="box_card add_item" :body-style="{ padding: '3px' }">
        <div class="text_item">
          <div :underline="false" @click="addProHandle(null,selectNode.id)"><i class="el-icon-tickets"></i><span>创建图层</span></div>
        </div>
        <div class="text_item">
          <div :underline="false" @click="drawPoint()"><i class="el-icon-location"></i><span>创建点对象</span></div>
        </div>
        <div class="text_item">
          <div :underline="false" @click="drawPolyline()"><i class="el-icon-s-marketing"></i>  <span>创建线对象</span></div>
        </div>
        <div class="text_item">
          <div :underline="false" @click="drawPolygon()"><i class="el-icon-picture"></i>  <span>创建面对象</span></div>
        </div>
      </el-card>
    </div>
    <div class="text_item">
      <div :underline="false" @click="deleteMenuHandle"><i class="el-icon-delete"></i>  <span>删除&#12288&#12288</span></div>
    </div>
    <div class="text_item">
      <div :underline="false" @click="exportWordHandle"><i class="el-icon-printer"></i>  <span>导出Word</span></div>
    </div>
    <div class="text_item" v-if="selectNode.type === 0">
      <div :underline="false">
        <input type="file" class="kml_input" accept=".kml" id="kml" @change="importKMLHandle"/>
        <i class="el-icon-document"></i>  <span>导入KML</span>
      </div>
    </div>
    <div class="text_item">
      <div :underline="false" @click="exportKMLHandle"><i class="el-icon-printer"></i>  <span>导出KML</span></div>
    </div>
  </el-card>
</template>

<script>
  import {stringIsNull} from '@/utils'

  export default {
    props: {
      vueObj: {
        type: Object,
        required: true
      },
      selectNode: {
        type: Object,
        required: true
      },
      copyItem: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 绘制标注点
      drawPoint () {
        let that = this
        let listener = AMap.event.addListener(this.vueObj.map, 'click', function (e) {
          let item = {
            id: '',
            lng: e.lnglat.lng,
            lat: e.lnglat.lat,
            type: 1,
            parentId: that.selectNode.id
          }
          that.vueObj.addOrUpdateHandle(item)
          AMap.event.removeListener(listener)
        })
      },
      // 绘制多段线
      drawPolyline () {
        let that = this
        this.vueObj.drawOpen = true
        let mouseTool = new AMap.MouseTool(this.vueObj.map)
        mouseTool.polyline({
          strokeColor: 'red',
          strokeOpacity: 1,
          strokeWeight: 4,
          strokeStyle: 'solid'
        })
        mouseTool.on('draw', function (event) {
          mouseTool.close(true)
          let polyLineList = []
          let coordinate = ''
          // 中心坐标
          let i = 0
          let lng = 0
          let lat = 0
          for (let point of event.obj.getPath()) {
            polyLineList.push([point.lng, point.lat])
            coordinate += point.lng + ',' + point.lat + ';'
            i += 1
            lng +=  point.lng
            lat +=  point.lat
          }
          let item = {
            coordinate: coordinate.substring(0, coordinate.length - 1),
            lng: (lng / i).toFixed(6),
            lat: (lat / i).toFixed(6),
            lineLength: AMap.GeometryUtil.distanceOfLine(polyLineList).toFixed(1),
            type: 2,
            parentId: that.selectNode.id
          }
          console.log(item)
          that.vueObj.addOrUpdateHandle(item)
        })
      },
      // 绘制面
      drawPolygon () {
        let that = this
        let mouseTool = new AMap.MouseTool(this.vueObj.map)
        mouseTool.polygon({
          strokeColor: '#ff1f48',
          strokeWeight: 4,
          strokeOpacity: 1,
          fillOpacity: 0.4,
          fillColor: '#fc665f'
        })
        mouseTool.on('draw', function (event) {
          mouseTool.close(true)
          let polyLineList = []
          let coordinate = ''
          // 中心坐标
          let i = 0
          let lng = 0
          let lat = 0
          for (let point of event.obj.getPath()) {
            polyLineList.push([point.lng, point.lat])
            coordinate += point.lng + ',' + point.lat + ';'
            i += 1
            lng +=  point.lng
            lat +=  point.lat
          }
          let item = {
            coordinate: coordinate.substring(0, coordinate.length - 1),
            lng: (lng / i).toFixed(6),
            lat: (lat / i).toFixed(6),
            area: AMap.GeometryUtil.ringArea(polyLineList).toFixed(1),
            type: 3,
            parentId: that.selectNode.id
          }
          console.log(item)
          that.vueObj.addOrUpdateHandle(item)
        })
      },
      // 查看详情
      readMenuHandle () {
        switch (this.vueObj.selectNode.type) {
          // 点标注 // 线标注 // 面标注 则地图中心跳到 该标注中心
          case 1:
          case 2:
          case 3:
            this.vueObj.map.setZoomAndCenter(17, [this.vueObj.selectNode.lng, this.vueObj.selectNode.lat])
            this.vueObj.menuVisible = true
            this.vueObj.activeNames = ['2']
            break
          // 项目属性
          default:
            this.vueObj.menuVisible = true

            break
        }
      },
      // 右键菜单 编辑事件
      editMenuHandle () {
        switch (this.selectNode.type) {
          // 点标注 // 线标注 // 面标注
          case 1:
          case 2:
          case 3:
            this.vueObj.addOrUpdateHandle(this.selectNode)
            break
          // 项目属性
          default:
            this.vueObj.addProjectHandle(this.selectNode.id)
            break
        }
      },
      // 右键菜单 复制事件
      copyMenuHandle () {
        this.copyItem.data = this.selectNode
        this.copyItem.type = 'copy'
      },
      // 右键菜单 剪切事件
      cutMenuHandle () {
        this.copyItem.data = this.selectNode
        this.copyItem.type = 'cut'
      },
      // 右键菜单 粘贴事件
      pasteMenuHandle () {
        let pasteItem = {
          'id': this.copyItem.data.id,
          'parentId': this.selectNode.id
        }
        let tip = '是否将【' + this.copyItem.data.label + '】|PASTETYPE|【' + this.selectNode.label + '】目录下'
        switch (this.copyItem.type) {
          case 'cut':
            this.$confirm(tip.replace('|PASTETYPE|', '移动至'), '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.vueObj.updateAfterGraEdit(pasteItem)
              this.copyItem.data = ''
            })
            break
          case 'copy':
            this.$confirm(tip.replace('|PASTETYPE|', '复制到'), '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.vueObj.copyAfterGraEdit(pasteItem)
              this.copyItem.data = ''
            })
            break
          default:
            break
        }
      },
      // 右键菜单 添加项目
      addProHandle (id, pId) {
        this.vueObj.addProjectHandle(id, pId)
      },
      // 右键菜单 删除事件
      deleteMenuHandle () {
        this.vueObj.delDimHandle(this.selectNode)
      },
      // 右键菜单 导出Word 文件
      exportWordHandle () {
        let bmapId = this.selectNode.id
        this.vueObj.exportWordHandle(bmapId)
      },
      // 右键菜单 导入Kml 文件
      importKMLHandle (e) {
        if (e.target.files && e.target.files.length === 1) {
          let fd = new FormData()
          fd.append('file', e.target.files[0])
          fd.append('parentId', this.selectNode.id)
          this.$http({
            url: this.$http.adornUrl(`/dop/bmap/upKmlFile`),
            method: 'post',
            headers: {
              'Content-Type': 'multipart/form-data;charset=UTF-8'
            },
            data: fd
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.vueObj.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
          e.target.value = null
        }
      },
      // 右键菜单 导出Kml 文件
      exportKMLHandle () {
        let id = this.selectNode.id
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/dop/bmap/exportKML/${id}`),
          method: 'get',
          params: this.$http.adornParams(),
          withCredentials: false, // 允许携带cookie
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          responseType: 'blob'
        }).then(({data}) => {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(data) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = this.selectNode.label + '-JX.kml' // 下载后文件名
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

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
  .box_card {
    box-shadow: 5px 0px 5px $navbar--background-color;
    .text_item :hover {
      color: red;
      font-weight: 700;
    }
    .text_item {
      width: 100%;
      padding: 4px;
      border-bottom: 1px dashed $navbar--background-color;
      color: $navbar--background-color;
    }
    .text_item i{
      font-size: 14pt;
    }
    .text_item span{
      font-size: 13pt;
    }
  }
  .add_item_box:hover .add_item{
    display: block;
  }
  .add_item {
    font-size: 11pt;
    position:absolute;
    left:115px;
    top:100px;
    min-width:138px;
    display: none;
  }
  .kml_input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
</style>
