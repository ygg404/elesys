// 面类
import {stringIsNull} from '../index'

var polyGonObj = function () {
  // 句柄
  var handleObj
  // 地图对象
  var handleMap
  // 面
  var polygon
  // 信息窗口
  var infoBox;
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

  // 构造
  polyGonObj.prototype.init = function (bPoint, vueObj) {
    this.handleObj = vueObj
    this.handleMap = vueObj.map
    this.editFlag = false
    this.bPoint = bPoint
    let polyList = []
    // 创建多边形
    let corlist = bPoint.coordinate.split(';')
    for (let cor of corlist) {
      if (!stringIsNull(cor)) {
        let point = cor.split(',')
        polyList.push([point[0], point[1]])
      }
    }
    this.polygon = new AMap.Polygon({
      path: polyList,
      strokeColor: '#ff1f48',
      strokeWeight: 4,
      strokeOpacity: 1,
      fillOpacity: 0.4,
      fillColor: '#fc665f',
      zIndex: 0
    })
    this.polygon.setMap(this.handleMap)
    this.createpolyGonLabel()
    this.createpolyGonContextMenu()

  }

  // 创建自定义标签 bPoint参数 数据库传过来
  polyGonObj.prototype.createpolyGonLabel = function () {
    console.log(this.polygon)
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
        'font-size': '16px',
        'font-weight': '700',
        'color': 'red'
      },
      position: [this.bPoint.lng, this.bPoint.lat]
    })
    this.label.setMap(this.handleMap)
  }

  // 预留
  polyGonObj.prototype.showInfoLabel = function () {

  }

  // 创建右键菜单
  polyGonObj.prototype.createpolyGonContextMenu = function () {
    let that = this
    let vueObj = this.handleObj
    var polyEditor = new AMap.PolyEditor(vueObj.map, this.polygon)
    polyEditor.on('end', function (event) {
      console.log(event)
      // event.target 即为编辑后的多边形对象
    })
    // 绑定鼠标右击事件——弹出右键菜单
    this.polygon.on('rightclick', function (e) {
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
        that.label.hide()
        polyEditor.open()
      }, 2)
      vueObj.contextMenu.addItem('关闭编辑', function () {
        polyEditor.close()
        that.bPoint.area = that.calculationArea()
        vueObj.updateAfterGraEdit(that.bPoint)
      }, 3)
      vueObj.contextMenu.open(vueObj.map, e.lnglat)
    })
  }

  // 特定事件
  polyGonObj.prototype.polyGonEvent = function () {
    var label = this.getlabel()
    var objbpoint = this.getbPoint()
    //   this.polygon.addEventListener('mouseover', function(){
    //    label.show()
    //   })
    this.polygon.addEventListener('mouseover', function () {
      // var info = "标题:"  + objbpoint.label +
      //            "备注信息:"  + objbpoint.remark +
      //            "围成面积:"  + objbpoint.area +
      //            "创建人:"  + objbpoint.createUserName +
      //            "创建时间:"  + objbpoint.createTime
      // //  eval(info)
      //  alert(info)
    })
    this.polygon.addEventListener('rightclick', function (e) {
      console.log(e)
      // label.setPosition(e.point)
    })
  }

  polyGonObj.prototype.calculationArea = function () {
    let polygonList = []
    let coordinate = ''
    // 中心坐标
    let i = 0
    let lng = 0
    let lat = 0
    for (let point of this.polygon.getPath()) {
      polygonList.push([point.lng, point.lat])
      coordinate += point.lng + ',' + point.lat + ';'
      i += 1
      lng +=  point.lng
      lat +=  point.lat
    }
    this.bPoint.coordinate = coordinate.substring(0,coordinate.length - 1)
    this.bPoint.lng = (lng / i).toFixed(6)
    this.bPoint.lat = (lat / i).toFixed(6)
    return AMap.GeometryUtil.ringArea(polygonList).toFixed(1)
  }
}

export default polyGonObj
