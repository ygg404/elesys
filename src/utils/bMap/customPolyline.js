// 线类
import {stringIsNull} from '../index'

var polyLineObj = function () {
  // 句柄
  var handleObj
  // 地图对象
  var handleMap
  // 线
  var polyLine
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
        polyList.push(new BMap.Point(point[0], point[1]))
      }
    }
    // 线段样式
    var linestyle = {strokeColor: 'red', strokeWeight: 4, strokeOpacity: 0.7, fillColor: '#db8385'}
    this.polyLine = new BMap.Polyline(polyList, linestyle)
    this.polyLine.id = bPoint.id

    this.handleMap.addOverlay(this.polyLine)
    // 标题
    let opts = {
      position: new BMap.Point(bPoint.lng, bPoint.lat),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(0, 0)    // 设置文本偏移量
    }
    this.label = new BMap.Label(bPoint.label, opts)  // 创建文本标注对象
    this.label.setStyle({
      color: 'red',
      fontSize: '12px',
      height: '20px',
      lineHeight: '20px',
      fontFamily: '微软雅黑'
    })
    this.handleMap.addOverlay(this.label)

    this.createpolyLineContextMenu()
    // this.polyLineEvent()
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
    this.polygon.addEventListener('mouseover', function () {

    })
    this.polygon.addEventListener('rightclick', function (e) {
      label.setPosition(e.point)
    })
  }

  // 创建右键菜单
  polyLineObj.prototype.createpolyLineContextMenu = function () {
    this.menu = new BMap.ContextMenu()
    var txtMenuItem = [
      {
        text: '删除',
        callback: () => {
          this.handleObj.delDimHandle(this.bPoint)
        }
      },
      {
        text: '信息编辑',
        callback: () => {
          this.handleObj.addOrUpdateHandle(this.bPoint)
        }
      },
      {
        text: '开启图形编辑',
        callback: () => {
          if (this.editFlag === false) {
            this.editFlag = true
            this.polyLine.enableEditing()
          }
        }
      },
      {
        text: '关闭图形编辑',
        callback: () => {
          if (this.editFlag === true) {
            // 覆盖物围成坐标路径
            var anginpolyList = this.polyLine.getPath()
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

            var eachPoint = this.bPoint
            // 交互 更改 中心坐标 坐标系数组 面积 标签坐标
            eachPoint.lng = anginx
            eachPoint.lat = anginy
            eachPoint.coordinate = anginangincoordinate
            eachPoint.area = 0
            eachPoint.labelLat = anginlabelLat
            eachPoint.labelLng = anginlabelLng

            this.handleObj.updateAfterGraEdit(eachPoint)

            this.polyLine.disableEditing()
            this.editFlag = false
          } else {
            // alert("没有执行此操作")
          }
        }
      }
    ]
    for (var i = 0; i < txtMenuItem.length; i++) {
      this.menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100))
    }
    // this.label.addContextMenu(this.menu)
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

}

export default polyLineObj
