<template>
  <div>
    <div class="ef_line">
      <div>
        <el-button @click="addProjectHandle(null)" icon="el-icon-plus" type="success">新建项目</el-button>
        <el-button @click="importKMLHandle()" icon="el-icon-s-order" type="success">导入KML</el-button>
      </div>
      <div>
        <el-input id="searchId" v-model="dataForm.key" placeholder="地址关键字搜索" prefix-icon="el-icon-map-location" clearable
            style="width: 250px;" @input="menuVisible = false"></el-input>
        <el-button @click="searchPlaceHandle()" icon="el-icon-search" type="primary">搜索</el-button>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="加载中...">
      <div class="detail_card" :class="menuVisible? 'open_setting':'close_setting'">
        <el-button class="btn" type="primary" size="mini" @click="menuVisible = !menuVisible">
          <i class="btn_rotate el-icon-s-tools"></i>
        </el-button>
        <el-collapse v-model="activeNames" @change="handleChange" v-if="menuVisible" class="collapse_item">
          <el-collapse-item name="1">
            <template slot="title">
              <span class="title_span">工具栏</span>
            </template>
            <el-row style="padding: 10px;">
              <el-button type="danger" icon="el-icon-location" @click="drawPoint()">点</el-button>
              <el-button type="danger" icon="el-icon-s-marketing" @click="drawPolyline()">线</el-button>
              <el-button type="danger" icon="el-icon-picture" @click="drawPolygon()">面</el-button>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <span class="title_span">标注基本信息</span>
            </template>
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <span class="title_span">查找标注信息</span>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="map">
        <el-card class="map_project" :body-style="{ padding: '2px' }">
          <div slot="header" class="clearfix">
            <div class="span_title">项目目录</div>
          </div>
          <el-form :inline="true" :model="dataForm" >
            <el-form-item>
              <el-input v-model="dataForm.projectName" placeholder="项目关键字" clearable style="width: 145px;" @clear="pageIndex=1,getDataList()"></el-input>
              <el-button @click="pageIndex = 1,getDataList()" icon="el-icon-search" type="primary" size="small"></el-button>
            </el-form-item>
          </el-form>
          <div :style="'height:' + (documentClientHeight - 440) + 'px'" class="project_ul block">
            <el-tree :data="projectList" show-checkbox node-key="id" :props="defaultProps"  highlight-current current-node-key
                     :expand-on-click-node="true" @node-contextmenu = "rightClickHandle" >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.icon"></i>{{ node.label }}</span>
              </span>
            </el-tree>
            <!--定义菜单及菜单项的操作-->
            <div v-show = "rightVisible" ref="rightMenu" id="rightMenu"  @mouseleave="rightVisible = false">
              <el-card class="box_card" :body-style="{ padding: '3px' }">
                <div class="text_item">
                  <el-link :underline="false" @click="editMenuHandle"><i class="el-icon-edit"></i>  <span>编辑</span></el-link>
                </div>
                <div class="text_item">
                  <el-link :underline="false" @click="deleteMenuHandle"><i class="el-icon-delete"></i>  <span>删除</span></el-link>
                </div>
                <div class="text_item">
                  <el-link :underline="false"><i class="el-icon-printer"></i>  <span>导出KML</span></el-link>
                </div>
              </el-card>
            </div>
          </div>
          <div class="">
            <el-button size="mini" type="primary" :disabled="pageIndex <= 1?true:false" @click="--pageIndex,getDataList()">上一页</el-button>
            <el-select size="mini" v-model="pageIndex" style="width: 58px;" @change="getDataList()">
              <el-option v-for="item in pageList" :key="item" :label="item" :value="item" ></el-option>
            </el-select>
            <el-button size="mini" type="primary" :disabled="pageIndex >= totalPage?true:false" @click="++pageIndex,getDataList()">下一页</el-button>
          </div>
        </el-card>
        <el-card id="mapId" :style="'height:' + (documentClientHeight - 200) + 'px'" ></el-card>
      </div>
      <!-- 标注弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 项目弹窗, 新增 / 修改 -->
      <map-project-add-or-update v-if="mproVisible" ref="mapProjectAddOrUpdate" @refreshDataList="getDataList"></map-project-add-or-update>
    </div>
  </div>
</template>

<script>
  import AddOrUpdate from './map-add-or-update'
  import mapProjectAddOrUpdate from './mapproject-add-or-update'
  import polyGonObj from '@/utils/bMap/customPolygon'
  import polylineObj from '@/utils/bMap/customPolyline'
  import pointObj from '@/utils/bMap/customPoint'
  import {stringIsNull} from '@/utils'

  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        totalCount: 0,
        pageList: [],
        dataForm: {
          key: '',
          projectName: ''
        },
        defaultProps: {
          children: 'bmapList',
          label: 'label'
        },
        projectList: [],
        loading: true,
        zoom: 14,
        BMap: '',
        map: '',
        activeNames: [],
        selectNode: {},  // 被选中的节点
        menuVisible: false,
        rightVisible: false,
        drawingManager: '',
        addOrUpdateVisible: false,
        mproVisible: false  // 添加项目可视图
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      },
    },
    components: {
      AddOrUpdate,
      mapProjectAddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        let that = this
        // 右键菜单取消
        document.addEventListener('click', function (e) {
          that.rightVisible = false
        })
        this.loading = false
        var map = new BMap.Map('mapId', {minZoom: 12, maxZoom: 20, enableMapClick: false})
        let point = new BMap.Point(116.72 , 23.37)   // 设置默认的坐标
        map.centerAndZoom(point, 17)  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
        map.panTo(point)
        map.setMapType(BMAP_HYBRID_MAP)
        this.map = map
        map.addEventListener('dragend', function () {
          var center = map.getCenter()
          var bounds = map.getBounds()
        })
        map.addEventListener('zoomend', function (e) {
          console.log(e)
        })
        this.getDataList()

        // 绘制图标样式
        var styleOptions = {
          strokeColor: '#db2311',   // 边线颜色
          fillColor: '#db8385',     // 填充颜色。当参数为空时，圆形没有填充颜色
          strokeWeight: 2,          // 边线宽度，以像素为单位
          strokeOpacity: 1,         // 边线透明度，取值范围0-1
          fillOpacity: 0.2          // 填充透明度，取值范围0-1
        }
        var labelOptions = {
          borderRadius: '2px',
          background: '#fdff60cf',
          border: '1px solid #E1E1E1',
          color: '#703A04',
          fontSize: '12px',
          letterSpacing: '0',
          padding: '5px'
        }
        // 实例化鼠标绘制工具
        this.drawingManager = new BMapLib.DrawingManager(map, {
          enableCalculate: true,  // 绘制是否进行测距测面
          enableSorption: true,   // 是否开启边界吸附功能
          sorptiondistance: 20,   // 边界吸附距离
          enableGpc: true,        // 是否开启延边裁剪功能
          enableLimit: true,      // 是否开启超限提示
          limitOptions: {
            area: 50000000,     // 面积超限值
            distance: 30000     // 距离超限值
          },
          circleOptions: styleOptions,     // 圆的样式
          polylineOptions: styleOptions,   // 线的样式
          polygonOptions: styleOptions,    // 多边形的样式
          rectangleOptions: styleOptions,  // 矩形的样式
          labelOptions: labelOptions      // label样式
        })
        // 绘制完成后获取相关的信息
        this.drawingManager.addEventListener('overlaycomplete', function (e) {
          let item = {}
          switch (e.drawingMode) {
            // 点
            case 'marker':
              item = {
                id: '',
                area: 0,
                type: 1,
                lay: '',
                labelLng: e.overlay.point.lng,
                labelLat: e.overlay.point.lat
              }
              break
            // 线
            case 'polyline':
              var polylinePath = e.overlay.getPath()
              item = {
                id: '',
                lay: polylinePath,
                area: 0,
                type: 2,
                labelLng: e.label.point.lng,
                labelLat: e.label.point.lat
              }
              break
            // 面
            case 'polygon':
              if (stringIsNull(e.calculate)) {
                that.$message.error('绘制图形有误，请重新绘制!')
                return
              }
              item = {
                id: '',
                lay: e.overlay,
                area: e.calculate,
                type: 3,
                labelLng: e.label.point.lng,
                labelLat: e.label.point.lat
              }
              break
            // 其他图项
            default:
              return
          }
          that.addOrUpdateHandle(item)
          that.map.removeOverlay(e.overlay)
          that.map.removeOverlay(e.label)
        })
        // 地址搜索 建立一个自动完成的对象
        var ac = new BMap.Autocomplete({'input': 'searchId', 'location': map})
        ac.addEventListener('onconfirm', function (e) {
          var _value = e.item.value
          that.dataForm.key = _value.province + _value.city + _value.district + _value.street + _value.business
          that.searchPlaceHandle()
        })
      },
      // 获取项目列表
      getBampProjectList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/dop/bmapproject/page'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'key': this.dataForm.projectName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.page)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取当前位置
      getLocationHandle () {
        let that = this
        // 浏览器定位
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (res) {
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            // 网络定位 初始化百度地图
            var marker = new BMap.Marker(res.point)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
          } else {
            that.$message.error('获取地理位置失败！')
          }
        }, {enableHighAccuracy: true})
      },
      // 地址搜索
      searchPlaceHandle () {
        let that = this
        // this.map.clearOverlays()    // 清除地图上所有覆盖物
        var local = new BMap.LocalSearch(this.map, { // 智能搜索
          onSearchComplete: function (e) {
            let searchPoint = local.getResults().getPoi(0).point
            that.map.centerAndZoom(searchPoint, 16)
            that.map.addOverlay(new BMap.Marker(searchPoint))    // 添加标注
          }
        })
        local.search(this.dataForm.key)
      },
      // 绘制标注点
      drawPoint () {
        // 需要自己手动去关闭
        if (this.drawingManager._isOpen === true) {
          this.drawingManager._isOpen = false
        }
        this.menuVisible = false
        this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)
        this.drawingManager.open()
      },
      // 绘制多段线
      drawPolyline () {
        if (this.drawingManager._isOpen === true) {
          this.drawingManager._isOpen = false
        }
        this.menuVisible = false
        this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE)
        this.drawingManager.open()
      },
      // 绘制面
      drawPolygon () {
        if (this.drawingManager._isOpen === true) {
          this.drawingManager._isOpen = false
        }
        this.menuVisible = false
        this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)
        this.drawingManager.open()
      },
      // 根据经纬度范围获取标注列表
      getBampLabelList () {
        return new Promise((resolve, reject) => {
          let bounds = this.map.getBounds()
          this.$http({
            url: this.$http.adornUrl('/dop/bmap/list'),
            method: 'get',
            params: this.$http.adornParams({
              'minlng': bounds.Ne,
              'maxlng': bounds.Je,
              'minlat': bounds.Zd,
              'maxlat': bounds.Xd
            })
          }).then(({data}) => {
            this.dataListLoading = false
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取标注数据并绘制
      getDataList () {
        this.map.clearOverlays()
        this.getBampProjectList().then(page => {
          this.totalPage = page.totalPage
          this.totalCount = page.totalCount
          this.pageList = Array.from(new Array(page.totalPage), (item, index) => index + 1)
          let polyList = []
          let corlist = []
          for (let bProject of page.list) {
            bProject.label = bProject.projectName
            if (bProject.bmapList.length !== 0) {
              bProject.icon = 'el-icon-folder-opened'
            } else {
              bProject.icon = 'el-icon-folder'
            }

            for (let bPoint of bProject.bmapList) {
              switch (bPoint.type) {
                // 点
                case '1':
                  bPoint.icon = 'el-icon-s-opportunity'
                  var point = new pointObj()
                  point.createPointObj(bPoint, this)
                  break
                // 线
                case '2':
                  bPoint.icon = 'el-icon-s-marketing'
                  polyList = []
                  // 创建多边形
                  corlist = bPoint.coordinate.split(';')
                  for (let cor of corlist) {
                    if (!stringIsNull(cor)) {
                      let point = cor.split(',')
                      polyList.push(new BMap.Point(point[0], point[1]))
                    }
                  }
                  var polyline = new polylineObj()
                  polyline.createpolyLineObj(bPoint, polyList, this)
                  break
                // 面
                case '3':
                  bPoint.icon = 'el-icon-picture'
                  polyList = []
                  // 创建多边形
                  corlist = bPoint.coordinate.split(';')
                  for (let cor of corlist) {
                    if (!stringIsNull(cor)) {
                      let point = cor.split(',')
                      polyList.push(new BMap.Point(point[0],point[1]))
                    }
                  }
                  var polygon = new polyGonObj()
                  polygon.createpolyGonObj(bPoint, polyList, this)
                  break
                default:
                  break
              }
            }
          }
          this.projectList = page.list
        })
      },
      // 右键点击事件
      rightClickHandle (event, object, value, element) {
        this.rightVisible = true
        let menu = document.querySelector('#rightMenu')
        let rect = element.$el.getClientRects()[0]
        menu.style.cssText = 'position: fixed; left: ' + (rect.right - 100) + 'px' + '; top: ' + rect.top + 'px; z-index: 999; cursor:pointer;'
        this.selectNode = value
      },
      // 右键菜单 编辑事件
      editMenuHandle () {
        switch (this.selectNode.data.type) {
          // 点标注
          case 1:

            break
          // 线标注
          case 2:
            break
          // 面标注
          case 3:
            break
          // 项目属性
          default:
            this.addProjectHandle(this.selectNode.data.id)
            break
        }
      },
      // 右键菜单 删除事件
      deleteMenuHandle () {
        switch (this.selectNode.data.type) {
          // 点标注 线标注 面标注
          case '1':
          case '2':
          case '3':
            this.delDimHandle(this.selectNode.data)
            break
          // 项目属性
          default:
            this.delProjectHandle(this.selectNode.data)
            break
        }
      },
      // 图形编辑之后执行的数据库更新操作
      updateAfterGraEdit (eachPoint) {
        this.$http({
          url: this.$http.adornUrl('/dop/bmap/update'),
          method: 'post',
          data: this.$http.adornData({
            'id': eachPoint.id,
            'labelLng': eachPoint.labelLng,
            'labelLat': eachPoint.labelLat,
            'lng': eachPoint.lng,
            'lat': eachPoint.lat,
            'coordinate': eachPoint.coordinate,
            'area': eachPoint.area,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.visible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改 项目
      addProjectHandle (projectId) {
        this.mproVisible = true
        this.$nextTick(() => {
          this.$refs.mapProjectAddOrUpdate.init(projectId)
        })
      },
      // 删除标注点事件
      delDimHandle (item) {
        console.log(item)
        let tip = '此操作将永久删除名称为  [' + item.label + ']   的标注点信息, 是否继续?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/dop/bmap/delete/${item.id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
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
      // 删除项目事件
      delProjectHandle (item) {
        let tip = '此操作将永久删除名称为  [' + item.projectName + ']   的项目信息及其以下标注点信息, 是否继续?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/dop/bmapproject/delete/${item.id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
  .open_setting {
    width: 350px;
    -webkit-transition: width .3s;
    transition: width .3s;
  }
  .close_setting {
    width: 1px;
    -webkit-transition: width .3s;
    transition: width .3s;
  }
  .detail_card {
    position: absolute;
    right: 20px;
    background: #2BCBBBaf;
    color: white;
    z-index: 1000;
  }
  .detail_card .title_span {
    margin-left: 20px;
    color: #0000cc;
    font-size: 12pt;
    font-weight: 700;
    font-family: "BankGothic Lt BT";
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .detail_card .btn {
    position: absolute;
    left: -47px;
    top:50px;
    z-index: 100;
    font-size: 12pt;

  }
  .collapse_item /deep/ {
    .el-collapse-item__wrap {
      background-color:rgba($--color-primary,0.2);
      border-bottom: 0px;
    }
    .el-collapse-item__content {
      font-weight:600;
      color: black;
    }
    .el-collapse-item__header {
      color: black;
      background-color:rgba($--color-primary,0.7);
      border-bottom: 0px;
      &:hover {
        color: black;
        background-color:rgba($--color-primary,0.9);
      }
    }
  }
  .box_card {
    box-shadow: 5px 0px 5px $navbar--background-color;
    .text_item :hover {
      color: red;
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
  @-webkit-keyframes rotate{
    from{-webkit-transform: rotate(0deg)}
    to{-webkit-transform: rotate(360deg)}
  }
  @-moz-keyframes rotate{
    from{-moz-transform: rotate(0deg)}
    to{-moz-transform: rotate(360deg)}
  }
  @-o-keyframes rotate{
    from{-o-transform: rotate(0deg)}
    to{-o-transform: rotate(360deg)}
  }
  @keyframes rotate{
    from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
  }
  .btn_rotate{
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 2s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 2s;
    -webkit-animation: rotate 2s linear infinite;
    -moz-animation: rotate 2s linear infinite;
    -o-animation: rotate 2s linear infinite;
    animation: rotate 2s linear infinite;
  }

  .ef_line{
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .map {
    display: flex;
    justify-content: flex-start;
  }
  .map #mapId{
    width: 100%;
    margin-left: 5px;
  }
  .map_project {
    width: 268px;
    display: inline-block;
  }
  .map .span_title {
    font-weight: 700;
    font-size: 14pt;
  }
  .map .project_ul {
    overflow-y: auto;
    -ms-overflow-y: auto;
    font-size: 11pt;
  }
  .map .project_ul .el-tree-node__content {
    .el-checkbox .el-checkbox__inner{
      width: 18px;
      height: 18px;
    }
  }
  .map .project_ul .el-tree--highlight-current /deep/ .el-tree-node.is-checked > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
    color: $navbar--background-color;
  }
</style>
