// 点类
import {stringIsNull} from '../index'

var pointObj = function () {
  // 句柄
  let handleObj
  // 地图对象
  let handleMap
  // 点
  let marker
  // 移动标志
  let editFlag
  // 信息窗
  let infoWindow
  // 存放和数据库交互的数据
  let bPoint
  // 初始化
  pointObj.prototype.init = function (bPoint, vueObj) {
    this.handleObj = vueObj
    this.handleMap = vueObj.map
    this.editFlag = false
    this.marker = new AMap.Marker({
      icon: require('@/assets/img/amap/poi-marker-red.png'),
      position: [bPoint.lng, bPoint.lat],
      offset: new AMap.Pixel(-13, -30),
      raiseOnDrag: true
    })
    this.bPoint = bPoint
    this.marker.id = bPoint.id

    this.marker.setMap(this.handleMap)
    this.createPointLabel()
    this.createpointContextMenu()
  }
  // 创建标题
  pointObj.prototype.createPointLabel = function () {
    // 创建纯文本标记
    this.label = new AMap.Text({
      text: this.bPoint.label,
      anchor: 'center', // 设置文本标记锚点
      cursor: 'pointer',
      style: {
        'padding': '3px',
        'border-radius': '.25rem',
        'background-color': 'ff00003f',
        'border-width': 0,
        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
        'text-align': 'center',
        'font-size': '16px',
        'font-weight': '700',
        'color': 'red'
      },
      position: [this.bPoint.lng, this.bPoint.lat],
      offset: new AMap.Pixel(0, 12) // 设置偏移量
    })
    this.label.setMap(this.handleMap)
  }
  pointObj.prototype.createPointInfowindow = function () {
    var vuemap = this.handleMap
    var objbpoint = this.bPoint
    var opts = {
      position: new BMap.Point(objbpoint.labelLng, objbpoint.labelLat),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(0, 0)    // 设置文本偏移量
    }
    var html = '<div class=\'infoBoxContent \'><p>标题: ' + objbpoint.label +
      '</p><div><p>备注信息: ' + objbpoint.remark +
      '</p><p>创建人: ' + objbpoint.createUserName +
      '</p><p>创建时间: ' + objbpoint.createTime +
      '</p></div></div>'
    this.infoWindow = new BMap.InfoWindow(html, opts)
    vuemap.addOverlay(this.infoWindow)
  }
  pointObj.prototype.pointEvent = function () {
    var that = this
    this.marker.addEventListener('mouseover', function (e) {
      var point = new BMap.Point(e.point.lng, e.point.lat)
      console.log(e)
      // that.handleMap.openInfoWindow(that.infoWindow, point)
    })
    //   this.marker.addEventListener('mouseout', function(){
    //     that.vueHandleMap.hideInfoWindow();
    // })
  }
  // 创建右键菜单
  pointObj.prototype.createpointContextMenu = function () {
    let that = this
    let vueObj = this.handleObj
    // 绑定鼠标右击事件——弹出右键菜单
    this.marker.on('rightclick', function (e) {
      if (!stringIsNull(vueObj.contextMenu)) {
        vueObj.contextMenu.close()
      }
      // 创建右键菜单
      vueObj.contextMenu = new AMap.ContextMenu()
      vueObj.contextMenu.addItem('删除', function () {
        vueObj.delDimHandle(that.bPoint)
      }, 0)
      vueObj.contextMenu.addItem('信息编辑', function () {
        vueObj.addOrUpdateHandle(that.bPoint)
      }, 1)
      vueObj.contextMenu.addItem('移动位置', function () {
        that.marker.setDraggable(true)
        that.marker.on('dragend' , function (e) {
          that.bPoint.lng = e.lnglat.lng
          that.bPoint.lat = e.lnglat.lat
        })
        that.label.hide()
        // vueobj.addOrUpdateHandle(this.bPoint)
      }, 2)
      vueObj.contextMenu.addItem('关闭移动', function () {
        that.marker.setDraggable(false)
        vueObj.updateAfterGraEdit(that.bPoint)
      }, 3)
      vueObj.contextMenu.open(that.handleMap, e.lnglat)
    })
  }
}

export default pointObj
