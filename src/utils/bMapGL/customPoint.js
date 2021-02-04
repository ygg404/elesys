// 点类
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

    this.marker = new BMapGL.Marker(new BMapGL.Point(bPoint.lng, bPoint.lat))
    this.bPoint = bPoint
    this.marker.id = bPoint.id
    let opts = {
      position: new BMapGL.Point(bPoint.lng, bPoint.lat),    // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(0, 0)    // 设置文本偏移量
    }
    let label = new BMapGL.Label(bPoint.label, opts)  // 创建文本标注对象
    label.setStyle({
      color: 'red',
      fontSize: '12px',
      height: '20px',
      lineHeight: '20px',
      fontFamily: '微软雅黑'
    })
    this.handleMap.addOverlay(this.marker)
    this.handleMap.addOverlay(label)

    // this.createpointContextMenu()
    // this.createPointInfowindow()
    // this.pointEvent()
  }
  pointObj.prototype.createPointInfowindow = function () {
    var vuemap = this.handleMap
    var objbpoint = this.bPoint
    var opts = {
      position: new BMapGL.Point(objbpoint.labelLng, objbpoint.labelLat),    // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(0, 0)    // 设置文本偏移量
    }
    var html = '<div class=\'infoBoxContent \'><p>标题: ' + objbpoint.label +
      '</p><div><p>备注信息: ' + objbpoint.remark +
      '</p><p>创建人: ' + objbpoint.createUserName +
      '</p><p>创建时间: ' + objbpoint.createTime +
      '</p></div></div>'
    this.infoWindow = new BMapGL.InfoWindow(html, opts)
    vuemap.addOverlay(this.infoWindow)
  }
  pointObj.prototype.pointEvent = function () {
    var that = this
    this.marker.addEventListener('mouseover', function (e) {
      var point = new BMapGL.Point(e.point.lng, e.point.lat)
      console.log(e)
      // that.handleMap.openInfoWindow(that.infoWindow, point)
    })
    //   this.marker.addEventListener('mouseout', function(){
    //     that.vueHandleMap.hideInfoWindow();
    // })
  }
  // 创建右键菜单
  pointObj.prototype.createpointContextMenu = function () {
    var vueobj = this.handleObj
    //   var label = this.getlabel()
    this.menu = new BMapGL.ContextMenu()
    var txtMenuItem = [
      {
        text: '删除',
        callback: () => {
          vueobj.delDimHandle(this.bPoint)
        }
      },
      {
        text: '信息编辑',
        callback: () => {
          vueobj.addOrUpdateHandle(this.bPoint)
        }
      },
      {
        text: '移动位置',
        callback: () => {
          if (this.editFlag === false) {
            this.editFlag = true
            this.marker.enableDragging()
          }
        }
      },
      {
        text: '关闭移动',
        callback: () => {
          if (this.editFlag === true) {
            var marker = this.marker.point
            var eachPoint = this.bPoint
            eachPoint.lng = marker.lng
            eachPoint.lat = marker.lat
            eachPoint.labelLat = marker.lng
            eachPoint.labelLng = marker.lat
            this.handleObj.updateAfterGraEdit(eachPoint)
            this.marker.disableDragging()
            this.editFlag = false
          } else {

          }
        }
      }
    ]
    for (var i = 0; i < txtMenuItem.length; i++) {
      this.menu.addItem(new BMapGL.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100))
    }
    this.marker.addContextMenu(this.menu)
  }
  // return{
  //   createPointObj:_createPointObj,
  //   getvueHandleObj:_getvueHandleObj,
  //   getvueHandleMap:_getvueHandleMap,
  // //   getmarker:_getMarker
  // createpointContextMenu:_createpointContextMenu
  // }
}

export default pointObj
