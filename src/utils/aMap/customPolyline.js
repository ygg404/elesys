// 线类
import {stringIsNull} from '../index'

var polyLineObj = function () {
  // 句柄
  var handleObj
  // 地图对象
  var handleMap
  // 线
  var polyline
  // 信息窗口
  // var infoBox;
  // 标题
  var title
  // 标签
  var label
  // 右键菜单
  var menu
  // 图形编辑标识
  var editFlag
  // 存放和数据库交互的数据
  var bPoint

  // 初始化
  polyLineObj.prototype.init = function (bPoint, vueObj) {
    this.handleObj = vueObj
    this.handleMap = vueObj.map
    this.bPoint = bPoint
    this.editFlag = false
    // 创建线段
    let polyList = []
    let corlist = bPoint.coordinate.split(';')
    for (let cor of corlist) {
      if (!stringIsNull(cor)) {
        let point = cor.split(',')
        polyList.push([point[0], point[1]])
      }
    }
    // 线段样式
    var linestyle = {strokeColor: 'red', strokeWeight: 4, strokeOpacity: 0.7, fillColor: '#db8385'}
    this.polyline = new AMap.Polyline({
      path: polyList,
      isOutline: true,
      outlineColor: '#ffeeff',
      borderWeight: 2,
      strokeColor: '#FF0000',
      strokeOpacity: 1,
      strokeWeight: 4,
      // 折线样式还支持 'dashed'
      strokeStyle: 'solid',
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 0
    })
    this.polyline.setMap(this.handleMap)
    this.createpolyLineLabel()
    this.createpolyLineContextMenu()
    // this.polyLineEvent()
  }

  // 创建自定义标签 bPoint参数 数据库传过来
  polyLineObj.prototype.createpolyLineLabel = function () {
    // 创建纯文本标记
    this.label = new AMap.Text({
      text: this.bPoint.label,
      anchor: 'center', // 设置文本标记锚点
      draggable: false,
      cursor: 'pointer',
      style: {
        'padding': '3px',
        'border-radius': '.25rem',
        'background-color': 'ff00003f',
        'border-width': 0,
        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
        'text-align': 'center',
        'font-size': '14px',
        'font-weight': '700',
        'color': 'red'
      },
      position: [this.bPoint.lng, this.bPoint.lat]
    })
    this.label.setMap(this.handleMap)
  }

  polyLineObj.prototype.polyGonEvent = function () {
    this.polygon.addEventListener('mouseover', function () {

    })
    this.polygon.addEventListener('rightclick', function (e) {
      label.setPosition(e.point)
    })
  }
  // 创建右键菜单
  polyLineObj.prototype.createpolyLineContextMenu = function () {
    let that = this
    let vueObj = this.handleObj
    var polyEditor = new AMap.PolyEditor(vueObj.map, this.polyline)
    // 绑定鼠标右击事件——弹出右键菜单
    this.label.on('rightclick', function (e) {
      console.log(e)
      // 创建右键菜单
      vueObj.contextMenu = new AMap.ContextMenu()
      vueObj.contextMenu.addItem('删除', function () {
        vueObj.delDimHandle(that.bPoint)
      }, 0)
      vueObj.contextMenu.addItem('信息编辑', function () {
        vueObj.addOrUpdateHandle(that.bPoint)
      }, 1)
      vueObj.contextMenu.addItem('图形编辑', function () {
        polyEditor.open()
      }, 2)
      vueObj.contextMenu.addItem('关闭编辑', function () {
        polyEditor.close()
        that.bPoint.lineLength = that.calculationLine()
        vueObj.updateAfterGraEdit(that.bPoint)
      }, 3)
      vueObj.contextMenu.open(vueObj.map, e.lnglat)
    })
  }
  // 计算线段的距离
  polyLineObj.prototype.calculationLine = function () {
    let polyLineList = []
    let coordinate = ''
    // 中心坐标
    let i = 0
    let lng = 0
    let lat = 0
    for (let point of this.polyline.getPath()) {
      polyLineList.push([point.lng, point.lat])
      coordinate += point.lng + ',' + point.lat + ';'
      i += 1
      lng +=  point.lng
      lat +=  point.lat
    }
    this.bPoint.coordinate = coordinate.substring(0, coordinate.length - 1)
    this.bPoint.lng = (lng / i).toFixed(6)
    this.bPoint.lat = (lat / i).toFixed(6)
    return AMap.GeometryUtil.distanceOfLine(polyLineList).toFixed(1)
  }
  // 特定事件
  polyLineObj.prototype.polyLineEvent = function () {
    var label = this.getlabel()
    var objbpoint = this.getbPoint()
    var that = this
    this.polyLine.addEventListener('mouseover', function (e) {
      that.getlabel().setPosition(new BMap.Point(e.point.lng, e.point.lat))
      label.show()
    })
    this.polyLine.addEventListener('mouseout', function () {
      label.hide()
    })
  }

}

export default polyLineObj
