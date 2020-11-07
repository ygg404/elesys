//多面线类
import {console} from 'vuedraggable/src/util/helper'

var polyLineObj = (function () {
  //句柄
  var vueHandleObj
  // 地图对象
  var vueHandleMap
  //多面线
  var polyLine
  //信息窗口
  // var infoBox;
  //标题
  var title
  //标签
  var label
  //右键菜单
  var menu
  //图形编辑标识
  var editFlag
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

  var graUpdateFlag = false
  polyLineObj.prototype.getbPoint = function () {
    return this.bPoint
  }

  polyLineObj.prototype.geteditFlag = function () {
    return this.editFlag
  }
  polyLineObj.prototype.changeeditFlag = function () {
    this.editFlag = !this.editFlag
  }
  polyLineObj.prototype.getpolyLine = function () {
    return this.polyLine
  }
  polyLineObj.prototype.getpolyLineId = function () {
    return this.polyLine.id
  }
  polyLineObj.prototype.changeCoordinate = function (coordinate) {
    this.bPoint.coordinate = coordinate
  }
  polyLineObj.prototype.changeArea = function (area) {
    this.bPoint.area = area
  }
  polyLineObj.prototype.getlabel = function () {
    return this.label
  }
  polyLineObj.prototype.getvueHandleObj = function () {
    return this.vueHandleObj
  }
  polyLineObj.prototype.getvueHandleMap = function () {
    return this.vueHandleMap
  }
  polyLineObj.prototype.setTitle = function (title) {
    this.title = title
  }
  polyLineObj.prototype.getTitle = function () {
    return this.title
  }

  // 构造
  polyLineObj.prototype.createpolyLineObj = function (bPoint, polyList, vueObj) {
    this.vueHandleObj = vueObj
    this.vueHandleMap = vueObj.map
    this.editFlag = false
    // 线段样式
    var linestyle = {strokeColor: 'red', strokeWeight: 4, strokeOpacity: 0.7, fillColor: '#db8385'}
    this.polyLine = new BMap.Polyline(polyList, linestyle)
    this.bPoint = bPoint
    this.polyLine.id = bPoint.id
    this.createpolyLineContextMenu()
    this.polyLineEvent()
    this.vueHandleMap.addOverlay(this.getpolyLine())

    // 标题
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
    this.vueHandleMap.addOverlay(label)
  }

  // 创建自定义标签 bPoint参数 数据库传过来
  polyLineObj.prototype.createpolyLineLabel = function () {
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
    this.label = new BMap.Label(html, opts) // 创建文本标注对象
    this.label.setStyle({
      opacity: '0.7',
      background: '#FFFAFA',
      border: '1px solid #FFFAFA',
      color: 'black',
      fontSize: '12px',
      height: '100px',
      lineHeight: '15px',
      fontFamily: '微软雅黑',
      borderRadius: '10px'
    })
    vuemap.addOverlay(this.label)
    this.label.hide()
  }

  polyLineObj.prototype.polyGonEvent = function () {
    var label = this.getlabel()
    var objbpoint = this.getbPoint()
    this.polygon.addEventListener('mouseover', function () {

    })
    this.polygon.addEventListener('rightclick', function (e) {
      label.setPosition(e.point)
    })
  }

  //创建右键菜单
  polyLineObj.prototype.createpolyLineContextMenu = function () {
    var vueobj = this.getvueHandleObj()
    var label = this.getlabel()
    this.menu = new BMap.ContextMenu()
    var txtMenuItem = [
      {
        text: '删除',
        callback: () => {
          vueobj.deleteOverlay(this.getpolyLineId())
        }
      },
      {
        text: '信息编辑',
        callback: () => {
          vueobj.editOverlay(this.getpolyLine())
        }
      },
      {
        text: '开启图形编辑',
        callback: () => {
          if (this.geteditFlag() == false) {
            this.changeeditFlag()
            this.polyLine.enableEditing()
          }
        }
      },
      {
        text: '关闭图形编辑',
        callback: () => {
          if (this.geteditFlag() == true) {
            // 覆盖物围成坐标路径
            var anginpolyList = this.getpolyLine().getPath()
            var anginx = 0
            var anginy = 0
            var anginangincoordinate = ''
            var anginlabelLng = anginpolyList[anginpolyList.length - 1].lng
            var anginlabelLat = anginpolyList[anginpolyList.length - 1].lat
            for (let item of anginpolyList) {
              // 坐标系数组
              anginangincoordinate += item.lng + ',' + item.lat + ';'
              anginx += item.lng
              anginy += item.lat
            }
            // 中心坐标
            anginx = (anginx / anginpolyList.length).toFixed(6)
            anginy = (anginy / anginpolyList.length).toFixed(6)

            var eachPoint = this.getbPoint()
            //交互 更改 中心坐标 坐标系数组 面积 标签坐标
            eachPoint.lng = anginx
            eachPoint.lat = anginy
            eachPoint.coordinate = anginangincoordinate
            eachPoint.area = 0
            eachPoint.labelLat = anginlabelLat
            eachPoint.labelLng = anginlabelLng

            this.vueHandleObj.updateAfterGraEdit(eachPoint)

            this.polyLine.disableEditing()
            // alert("执行了先打开再关闭的操作")
            this.changeeditFlag()
          } else {
            // alert("没有执行此操作")
          }
        }
      }
    ]
    for (var i = 0; i < txtMenuItem.length; i++) {
      this.menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100))
    }

    this.polyLine.addContextMenu(this.menu)
  }

  //特定事件
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

})

export default polyLineObj
