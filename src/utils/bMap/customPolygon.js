//多面线类
import {console} from 'vuedraggable/src/util/helper'

var polyGonObj = (function () {
  //句柄
  var vueHandleObj
  // 地图对象
  var vueHandleMap
  //多面线
  var polygon
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
  polyGonObj.prototype.getbPoint = function () {
    return this.bPoint
  }

  polyGonObj.prototype.geteditFlag = function () {
    return this.editFlag
  }
  polyGonObj.prototype.changeeditFlag = function () {
    this.editFlag = !this.editFlag
  }
  polyGonObj.prototype.getPolyGon = function () {
    return this.polygon
  }
  polyGonObj.prototype.getpolyGonId = function () {
    return this.polygon.id
  }
  polyGonObj.prototype.changeCoordinate = function (coordinate) {
    this.bPoint.coordinate = coordinate
  }
  polyGonObj.prototype.changeArea = function (area) {
    this.bPoint.area = area
  }
  polyGonObj.prototype.getlabel = function () {
    return this.label
  }
  polyGonObj.prototype.getvueHandleObj = function () {
    return this.vueHandleObj
  }
  polyGonObj.prototype.getvueHandleMap = function () {
    return this.vueHandleMap
  }
  polyGonObj.prototype.setTitle = function (title) {
    this.title = title
  }
  polyGonObj.prototype.getTitle = function () {
    return this.title
  }

  //构造
  polyGonObj.prototype.createpolyGonObj = function (bPoint, polyList, vueObj) {
    this.vueHandleObj = vueObj
    this.vueHandleMap = vueObj.map
    this.editFlag = false
    this.bPoint = bPoint
    //线段样式
    var linestyle = {
      strokeColor: '#db2311',   // 边线颜色
      fillColor: '#db8385',     // 填充颜色。当参数为空时，圆形没有填充颜色
      strokeWeight: 4,          // 边线宽度，以像素为单位
      strokeOpacity: 1,         // 边线透明度，取值范围0-1
      fillOpacity: 0.32          // 填充透明度，取值范围0-1
    }
    this.polygon = new BMap.Polygon(polyList, linestyle)
    this.polygon.id = bPoint.id

    this.polyGonEvent()
    this.createpolyGonContextMenu()
    this.vueHandleMap.addOverlay(this.getPolyGon())

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

  //创建自定义标签 bPoint参数 数据库传过来
  polyGonObj.prototype.createpolyGonLabel = function () {
    var vuemap = this.getvueHandleMap()
    var objbpoint = this.getbPoint()
    var opts = {
      position: new BMap.Point(objbpoint.labelLng, objbpoint.labelLat),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(0, 0)    // 设置文本偏移量
    }
    var html = '<div ><p>标题: ' + objbpoint.label +
      '</p><div><p>备注信息: ' + objbpoint.remark +
      '</p><p>围成面积: ' + objbpoint.area +
      '</p><p>创建人: ' + objbpoint.createUserName +
      '</p><p>创建时间: ' + objbpoint.createTime +
      '</p></div></div>'
    this.label = new BMap.Label(html, opts) // 创建文本标注对象
    this.label.setStyle({
      opacity: '0.7',
      background: '#FFFAFA',
      border: '1px solid #FFFAFA',
      color: 'red',
      fontSize: '12px',
      height: '100px',
      lineHeight: '15px',
      fontFamily: '微软雅黑',
      borderRadius: '10px'
    })
    // this.label.id = this.bPoint.id
    vuemap.addOverlay(this.label)
    this.label.hide()
  }

  //预留
  polyGonObj.prototype.showInfoLabel = function () {

  }

  //创建右键菜单
  polyGonObj.prototype.createpolyGonContextMenu = function () {
    var vueobj = this.getvueHandleObj()
    var label = this.getlabel()
    this.menu = new BMap.ContextMenu()
    var txtMenuItem = [
      {
        text: '删除',
        callback: () => {
          vueobj.deletePolyGonOverlay(this.getpolyGonId())
        }
      },
      {
        text: '信息编辑',
        callback: () => {
          vueobj.editOverlay(this.getPolyGon())
        }
      },
      {
        text: '显示标注信息',
        callback: () => {
          label.show()
        }
      },
      {
        text: '开启图形编辑',
        callback: () => {
          if (this.geteditFlag() == false) {
            this.changeeditFlag()
            this.polygon.enableEditing()
          }
        }
      },
      {
        text: '关闭图形编辑',
        callback: () => {
          if (this.geteditFlag() == true) {
            //覆盖物围成坐标路径
            var anginpolyList = this.getPolyGon().getPath()
            var anginx = 0
            var anginy = 0
            var anginangincoordinate = ''
            var anginlabelLng = anginpolyList[anginpolyList.length - 1].lng
            var anginlabelLat = anginpolyList[anginpolyList.length - 1].lat

            var anginarea = this.calculationArea(this.getPolyGon())
            for (let item of anginpolyList) {
              //坐标系数组
              anginangincoordinate += item.lng + ',' + item.lat + ';'
              anginx += item.lng
              anginy += item.lat
            }
            //中心坐标
            anginx = (anginx / anginpolyList.length).toFixed(6)
            anginy = (anginy / anginpolyList.length).toFixed(6)

            var eachPoint = this.getbPoint()
            //交互 更改 中心坐标 坐标系数组 面积 标签坐标
            eachPoint.lng = anginx
            eachPoint.lat = anginy
            eachPoint.coordinate = anginangincoordinate
            eachPoint.area = anginarea
            eachPoint.labelLat = anginlabelLat
            eachPoint.labelLng = anginlabelLng

            this.vueHandleObj.updateAfterGraEdit(eachPoint)

            this.polygon.disableEditing()
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

    this.polygon.addContextMenu(this.menu)
  }

  //特定事件
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

  polyGonObj.prototype.calculationArea = function (polygon) {
    if (!(polygon instanceof BMap.Polygon) && !(polygon instanceof Array)) {
      return 0
    }
    var pts = new Array()
    if (polygon instanceof BMap.Polygon) {
      pts = polygon.getPath()
    }
    // var pts = polygon
    //判断数组的长度，如果是小于3的话，不构成面，无法计算面积
    if (pts.length < 3) {
      return 0
    }
    var totalArea = 0// 初始化总面积
    var LowX = 0.0
    var LowY = 0.0
    var MiddleX = 0.0
    var MiddleY = 0.0
    var HighX = 0.0
    var HighY = 0.0
    var AM = 0.0
    var BM = 0.0
    var CM = 0.0
    var AL = 0.0
    var BL = 0.0
    var CL = 0.0
    var AH = 0.0
    var BH = 0.0
    var CH = 0.0
    var CoefficientL = 0.0
    var CoefficientH = 0.0
    var ALtangent = 0.0
    var BLtangent = 0.0
    var CLtangent = 0.0
    var AHtangent = 0.0
    var BHtangent = 0.0
    var CHtangent = 0.0
    var ANormalLine = 0.0
    var BNormalLine = 0.0
    var CNormalLine = 0.0
    var OrientationValue = 0.0
    var AngleCos = 0.0
    var Sum1 = 0.0
    var Sum2 = 0.0
    var Count2 = 0
    var Count1 = 0
    var Sum = 0.0
    var Radius = 6378137.0// ,WGS84椭球半径
    var Count = pts.length
    for (var i = 0; i < Count; i++) {
      if (i == 0) {
        LowX = pts[Count - 1].lng * Math.PI / 180
        LowY = pts[Count - 1].lat * Math.PI / 180
        MiddleX = pts[0].lng * Math.PI / 180
        MiddleY = pts[0].lat * Math.PI / 180
        HighX = pts[1].lng * Math.PI / 180
        HighY = pts[1].lat * Math.PI / 180
      } else if (i == Count - 1) {
        LowX = pts[Count - 2].lng * Math.PI / 180
        LowY = pts[Count - 2].lat * Math.PI / 180
        MiddleX = pts[Count - 1].lng * Math.PI / 180
        MiddleY = pts[Count - 1].lat * Math.PI / 180
        HighX = pts[0].lng * Math.PI / 180
        HighY = pts[0].lat * Math.PI / 180
      } else {
        LowX = pts[i - 1].lng * Math.PI / 180
        LowY = pts[i - 1].lat * Math.PI / 180
        MiddleX = pts[i].lng * Math.PI / 180
        MiddleY = pts[i].lat * Math.PI / 180
        HighX = pts[i + 1].lng * Math.PI / 180
        HighY = pts[i + 1].lat * Math.PI / 180
      }
      AM = Math.cos(MiddleY) * Math.cos(MiddleX)
      BM = Math.cos(MiddleY) * Math.sin(MiddleX)
      CM = Math.sin(MiddleY)
      AL = Math.cos(LowY) * Math.cos(LowX)
      BL = Math.cos(LowY) * Math.sin(LowX)
      CL = Math.sin(LowY)
      AH = Math.cos(HighY) * Math.cos(HighX)
      BH = Math.cos(HighY) * Math.sin(HighX)
      CH = Math.sin(HighY)
      CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL)
      CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH)
      ALtangent = CoefficientL * AL - AM
      BLtangent = CoefficientL * BL - BM
      CLtangent = CoefficientL * CL - CM
      AHtangent = CoefficientH * AH - AM
      BHtangent = CoefficientH * BH - BM
      CHtangent = CoefficientH * CH - CM
      AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent))
      AngleCos = Math.acos(AngleCos)
      ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent
      BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent)
      CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent
      if (AM != 0) {
        OrientationValue = ANormalLine / AM
      } else if (BM != 0) {
        OrientationValue = BNormalLine / BM
      } else {
        OrientationValue = CNormalLine / CM
      }
      if (OrientationValue > 0) {
        Sum1 += AngleCos
        Count1++
      } else {
        Sum2 += AngleCos
        Count2++
      }
    }
    var tempSum1, tempSum2
    tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2)
    tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2
    if (Sum1 > Sum2) {
      if ((tempSum1 - (Count - 2) * Math.PI) < 1) {
        Sum = tempSum1
      } else {
        Sum = tempSum2
      }
    } else {
      if ((tempSum2 - (Count - 2) * Math.PI) < 1) {
        Sum = tempSum2
      } else {
        Sum = tempSum1
      }
    }
    totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;
    return Math.abs(totalArea); // 返回总面积
  }

})

export default polyGonObj
