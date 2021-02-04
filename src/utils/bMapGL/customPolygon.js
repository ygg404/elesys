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
  //右键菜单
  var menu
  //图形编辑标识
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
        polyList.push(new BMapGL.Point(point[0],point[1]))
      }
    }
    // 面样式
    var gonstyle = {
      strokeColor: '#db2311',   // 边线颜色
      fillColor: '#db8385',     // 填充颜色。当参数为空时，圆形没有填充颜色
      strokeWeight: 4,          // 边线宽度，以像素为单位
      strokeOpacity: 0.6         // 边线透明度，取值范围0-1
    }
    this.polygon = new BMapGL.Polygon(polyList, gonstyle)
    this.polygon.id = bPoint.id
    // this.polyGonEvent()
    this.handleMap.addOverlay(this.polygon)
    // 标题
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
    this.handleMap.addOverlay(label)

    // this.createpolyGonContextMenu()
  }
  // 创建自定义标签 bPoint参数 数据库传过来
  polyGonObj.prototype.createpolyGonLabel = function () {
    var vuemap = this.getvueHandleMap()
    var objbpoint = this.getbPoint()
    var opts = {
      position: new BMapGL.Point(objbpoint.labelLng, objbpoint.labelLat),    // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(0, 0)    // 设置文本偏移量
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

  // 预留
  polyGonObj.prototype.showInfoLabel = function () {

  }

  // 创建右键菜单
  polyGonObj.prototype.createpolyGonContextMenu = function () {
    var vueobj = this.handleObj
    var label = this.label
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
        text: '显示标注信息',
        callback: () => {
          label.show()
        }
      },
      {
        text: '开启图形编辑',
        callback: () => {
          if (this.editFlag === false) {
            this.editFlag = true
            this.polygon.enableEditing()
          }
        }
      },
      {
        text: '关闭图形编辑',
        callback: () => {
          if (this.editFlag === true) {
            // 覆盖物围成坐标路径
            var anginpolyList = this.polygon.getPath()
            var anginx = 0
            var anginy = 0
            var anginangincoordinate = ''
            var anginlabelLng = anginpolyList[anginpolyList.length - 1].lng
            var anginlabelLat = anginpolyList[anginpolyList.length - 1].lat

            var anginarea = this.calculationArea(this.polygon)
            for (let item of anginpolyList) {
              //坐标系数组
              anginangincoordinate += item.lng + ',' + item.lat + ';'
              anginx += item.lng
              anginy += item.lat
            }
            //中心坐标
            anginx = (anginx / anginpolyList.length).toFixed(6)
            anginy = (anginy / anginpolyList.length).toFixed(6)

            var eachPoint = this.bPoint
            // 交互 更改 中心坐标 坐标系数组 面积 标签坐标
            eachPoint.lng = anginx
            eachPoint.lat = anginy
            eachPoint.coordinate = anginangincoordinate
            eachPoint.area = anginarea
            eachPoint.labelLat = anginlabelLat
            eachPoint.labelLng = anginlabelLng

            this.handleObj.updateAfterGraEdit(eachPoint)

            this.polygon.disableEditing()
            // alert("执行了先打开再关闭的操作")
            this.editFlag = false
          } else {
            // alert("没有执行此操作")
          }
        }
      }
    ]
    for (var i = 0; i < txtMenuItem.length; i++) {
      this.menu.addItem(new BMapGL.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100))
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
}

export default polyGonObj
