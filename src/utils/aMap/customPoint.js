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
    this.marker = new AMap.Marker({
      icon: require('@/assets/img/amap/poi-marker-red.png'),
      position: [bPoint.lng, bPoint.lat],
      offset: new AMap.Pixel(-13, -30)
    })
    this.bPoint = bPoint
    this.marker.id = bPoint.id
    // // 设置鼠点标记显示的文字提示
    // let pointStyle = 'background-color: #ff00001f;' +
    //   'border-width: 0;' +
    //   'padding: 1px;' +
    //   'border: 1px solid red;' +
    //   'box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);' +
    //   'text-align: center;' +
    //   'font-size: 13px;' +
    //   'color: red;' +
    //   'font-weight: 700;'
    // console.log(pointStyle)
    // this.marker.setLabel({
    //   offset: new AMap.Pixel(0, -5),  // 设置文本标注偏移量
    //   content: '<div style="' + pointStyle + '">' + bPoint.label + '</div>', // 设置文本标注内容
    //   direction: 'bottom' // 设置文本标注方位
    // })


    this.marker.setMap(this.handleMap)
    this.createPointLabel()
  }
  // 创建标题
  pointObj.prototype.createPointLabel = function () {
    // 创建纯文本标记
    this.label = new AMap.Text({
      text: this.bPoint.label,
      anchor: 'center', // 设置文本标记锚点
      draggable: true,
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
      offset: new AMap.Pixel(0,10) //设置偏移量
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
    var vueobj = this.handleObj
    //   var label = this.getlabel()
    this.menu = new BMap.ContextMenu()
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
}

export default pointObj
