<template>
  <div>
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input id="searchId" v-model="dataForm.key" placeholder="地址关键字搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchPlaceHandle()" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="loading" element-loading-text="加载中...">
      <div class="detail_card" :class="menuVisible? 'open_setting':'close_setting'">
        <el-button class="btn" type="primary" size="mini" @click="menuVisible = !menuVisible">
          <i class="btn_rotate el-icon-s-tools"></i>
        </el-button>
        <el-collapse v-model="activeNames" @change="handleChange" style="opacity: 0.7" v-if="menuVisible">
          <el-collapse-item name="1">
            <template slot="title">
              <span class="title_span">工具栏</span>
            </template>
            <el-row style="padding: 10px;">
              <el-button type="danger" @click="draw()">标注点</el-button>
            </el-row>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
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
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="map">
        <el-card class="map_project">
          <div slot="header" class="clearfix" style="padding: 0">
            <span class="span_title">项目目录</span>
          </div>
          <div :style="'height:' + (documentClientHeight - 500) + 'px'" class="project_ul">

          </div>
        </el-card>
        <el-card id="mapId" :style="'height:' + (documentClientHeight - 200) + 'px'" ></el-card>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </div>
</template>

<script>
  import AddOrUpdate from './map-add-or-update'
  import {stringIsNull} from '@/utils'

  export default {
    data () {
      return {
        bImg: require('@/assets/img/mapImg/icon.png'),
        dataForm: {
          key: ''
        },
        loading: true,
        zoom: 14,
        BMap: '',
        map: '',
        activeNames: [],
        menuVisible: false,
        drawingManager: '',
        addOrUpdateVisible: false
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      },
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        let that = this
        // 浏览器定位
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (res) {
          console.log(res)
          that.loading = false
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            // 网络定位 初始化百度地图
            var marker = new BMap.Marker(res.point)
            var map = new BMap.Map('mapId', {minZoom: 12, maxZoom: 20,enableMapClick:false})
            map.centerAndZoom(new BMap.Point(res.point.lng,res.point.lat), 17)  // 初始化地图,设置中心点坐标和地图级别
            map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
            map.addOverlay(marker)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
            map.panTo(res.point)
            map.setMapType(BMAP_HYBRID_MAP)
            that.map = map
            // 标记点
            // var myIcon = new BMap.Icon(that.bImg, new BMap.Size(10, 26), {
            //   offset: new BMap.Size(10, 25), // 指定定位位置
            //   imageOffset: new BMap.Size(0, 0) // 设置图片偏移
            // })
            // var newmk = new BMap.Marker(res.point,{icon:myIcon})
            // map.addOverlay(newmk)
            map.addEventListener('dragend', function () {
              var center = map.getCenter()
              var bounds = map.getBounds()
              console.log(bounds)
              console.log("地图中心点变更为：" + center.lng + ", " + center.lat);
            })
            map.addEventListener('rightclick', function (e) {
                console.log('右键点击了')
            })
            map.addEventListener('zoomend', function (e) {
              console.log(e)
              //
            })
            that.getDataList()
          } else {
            that.$message.error('获取地理位置失败！')
          }
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
          that.drawingManager = new BMapLib.DrawingManager(map, {
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
          // 绘制完成后获取相关的信息(面积等)
          that.drawingManager.addEventListener('overlaycomplete', function (e) {
            if (stringIsNull(e.calculate)) {
              that.$message.error('绘制图形有误，请重新绘制!')
              that.map.removeOverlay(e.overlay)
              that.map.removeOverlay(e.label)
              console.log(e.label)
              return
            }
            let item = {
              id: '',
              lay: e.overlay,
              area: e.calculate,
              type: 3,
              labelLng: e.label.point.lng,
              labelLat: e.label.point.lat
            }
            that.addOrUpdateHandle(item)
            that.map.removeOverlay(e.overlay)
            that.map.removeOverlay(e.label)
          })
        }, {enableHighAccuracy: true})
      },
      // 地址搜索
      searchPlaceHandle () {
        let that = this
        this.map.clearOverlays()    // 清除地图上所有覆盖物
        var local = new this.BMap.LocalSearch(this.map, { // 智能搜索
          onSearchComplete: function (e) {
            let searchPoint = local.getResults().getPoi(0).point
            that.map.centerAndZoom(searchPoint, 16)
            that.map.addOverlay(new that.BMap.Marker(searchPoint))    // 添加标注
          }
        })
        local.search(this.dataForm.key)
      },
      // 绘制标注
      draw () {
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
        this.getBampLabelList().then(list => {
          for (let bPoint of list) {
            let polyList = []
            // 创建多边形
            let corlist = bPoint.coordinate.split(';')
            console.log(corlist)
            for (let cor of corlist) {
              if (!stringIsNull(cor)) {
                let point = cor.split(',')
                polyList.push(new BMap.Point(point[0],point[1]))
              }
            }
            var polygon = new BMap.Polygon(polyList, {strokeColor:'red', strokeWeight:3, fillOpacity:0.35,fillColor: '#db8385ef'})
            polygon.id = bPoint.id
            this.map.addOverlay(polygon)   // 增加多边形
            // 创建标题
            var opts = {
              position: new BMap.Point(bPoint.labelLng, bPoint.labelLat),    // 指定文本标注所在的地理位置
              offset: new BMap.Size(0, 0)    // 设置文本偏移量
            }
            var label = new BMap.Label(bPoint.label, opts) // 创建文本标注对象
            label.setStyle({
              color: 'red',
              fontSize: '12px',
              height: '20px',
              lineHeight: '20px',
              fontFamily: '微软雅黑'
            })
            label.id = bPoint.id
            this.map.addOverlay(label)  // 增加标题
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
    }
  }
</script>

<style scoped>
  .detail_card {
    position: absolute;
    right: 21px;
    background: #2BCBBBaf;
    color: white;
    z-index: 1000;
  }
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
    opacity: 0.9;
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

  .map {
    display: flex;
    justify-content: flex-start;
  }
  .map #mapId{
    width: 100%;
    margin-left: 5px;
  }
  .map_project {
    width: 200px;
    display: inline-block;
  }
  .map .span_title {
    font-weight: 700;
    font-size: 14pt;
  }
  .map .project_ul {
    overflow-y: auto;
    -ms-overflow-y: auto;
  }
</style>
