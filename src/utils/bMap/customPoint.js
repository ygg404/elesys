//点类
var pointObj = (function () {
  //句柄
  var vueHandleObj
  // 地图对象
  var vueHandleMap
  //点
  var marker
  //移动标志
  var editFlag
  var infoWindow
  //存放和数据库交互的数据
  var bPoint = {
    area: null,
    coordinate: null,
    createTime: null,
    createUserId: null,
    createUserName: null,
    id: null,
    label: null,
    labelLat: null,
    labelLng: null,
    lat: null,
    lng: null,
    modifyTime: null,
    remark: null,
    type: null
  }
  pointObj.prototype.getvueHandleObj = function () {
    return this.vueHandleObj
  }
  pointObj.prototype.getvueHandleMap = function () {
    return this.vueHandleMap
  }
  pointObj.prototype.changeeditFlag = function () {
    this.editFlag = !this.editFlag
  }
  pointObj.prototype.geteditFlag = function () {
    return this.editFlag
  }
  pointObj.prototype.getMakerId = function () {
    return this.marker.id
  }
  pointObj.prototype.getMarker = function () {
    return this.marker
  }
  pointObj.prototype.getbPoint = function () {
    return this.bPoint
  }
  pointObj.prototype.getinfoWindow = function () {
    return this.infoWindow
  }
  pointObj.prototype.createPointInfowindow = function () {
    var vuemap = this.getvueHandleMap()
    var objbpoint = this.getbPoint()
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
      that.vueHandleMap.openInfoWindow(that.infoWindow, point)
    })
    //   this.marker.addEventListener('mouseout', function(){
    //     that.vueHandleMap.hideInfoWindow();
    // })
  }
  // 构造
  pointObj.prototype.createPointObj = function (bPoint, vueObj) {
    this.vueHandleObj = vueObj
    this.vueHandleMap = vueObj.map
    this.editFlag = false
    this.marker = new BMap.Marker(new BMap.Point(bPoint.lng, bPoint.lat))
    this.bPoint = new Object(bPoint)
    this.marker.id = bPoint.id
    this.createpointContextMenu()
    this.createPointInfowindow()
    this.pointEvent()
    let opts = {
      position: new BMap.Point(bPoint.lng, bPoint.lat),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(0, 0)    // 设置文本偏移量
    }
    let label = new BMap.Label(bPoint.label, opts)  // 创建文本标注对象
    label.setStyle({
      color: 'red',
      fontSize: '12px',
      height: '20px',
      lineHeight: '20px',
      fontFamily: '微软雅黑'
    })
    this.vueHandleMap.addOverlay(this.marker)
    this.vueHandleMap.addOverlay(label)
  }

  //创建右键菜单
  pointObj.prototype.createpointContextMenu = function () {
    var vueobj = this.getvueHandleObj()
    //   var label = this.getlabel()
    this.menu = new BMap.ContextMenu()
    var txtMenuItem = [
      {
        text: '删除',
        callback: () => {
          vueobj.deleteOverlay(this.getMakerId())
        }
      },
      {
        text: '信息编辑',
        callback: () => {
          vueobj.editOverlay(this.getMarker())
        }
      },
      {
        text: '移动位置',
        callback: () => {
          if (this.geteditFlag() == false) {
            this.changeeditFlag()
            this.marker.enableDragging()
          }
        }
      },
      {
        text: '关闭移动',
        callback: () => {
          if (this.geteditFlag() == true) {
            var marker = this.getMarker().point
            var eachPoint = this.getbPoint()
            eachPoint.lng = marker.lng
            eachPoint.lat = marker.lat
            eachPoint.labelLat = marker.lng
            eachPoint.labelLng = marker.lat
            this.vueHandleObj.updateAfterGraEdit(eachPoint)
            this.marker.disableDragging()
            this.changeeditFlag()
          } else {

          }
        }
      }
    ]
    for (var i = 0; i < txtMenuItem.length; i++) {
      this.menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100))
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
})

export default pointObj
