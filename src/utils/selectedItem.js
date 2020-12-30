import Vue from 'vue'

/**
 * 获取婚姻状况选项
 */
export function getMaritalItem () {
  return [{'id': 0, 'dateItem': '未婚'},
            {'id': 1, 'dateItem': '已婚'},
            {'id': 2, 'dateItem': '离异'},
            {'id': 3, 'dateItem': '丧偶'}]
}

/**
 * 获取职称等级选项
 */
export function getJobItem () {
  return [{'id': 1, 'dateItem': '全职'},
            {'id': 2, 'dateItem': '兼职'},
            {'id': 3, 'dateItem': '实习'}]
}

/**
 * 获取学历选项
 */
export function getEducationItem () {
  let itemList = [{'id': 0, 'dateItem': '无'},
    {'id': 1, 'dateItem': '小学'},
    {'id': 2, 'dateItem': '初中'},
    {'id': 3, 'dateItem': '中专/高中/职高'},
    {'id': 4, 'dateItem': '专科'},
    {'id': 5, 'dateItem': '本科'},
    {'id': 6, 'dateItem': '硕士研究生'},
    {'id': 7, 'dateItem': '博士研究生'}]
  return itemList
}

/**
 * 获取请假类型
 */
export function getLeaveItem () {
  let itemList = [
    {'id': 0, 'leaveItem': '病假'},
    {'id': 1, 'leaveItem': '事假'},
    {'id': 2, 'leaveItem': '年假'},
    {'id': 3, 'leaveItem': '陪产假'},
    {'id': 4, 'leaveItem': '产假'},
    {'id': 5, 'leaveItem': '婚假'}]
  return itemList
}

/**
 * 获取上下半年
 */
export function getYearItem () {
  let itemList = [
    {'id': 0, 'yearItem': '上半年'},
    {'id': 1, 'yearItem': '下半年'}]
  return itemList
}

/**
 * 获取满意评分列表
 */
export function getRateItem () {
  let itemList = [
    {'id': 100, 'rateItem': '100(很高)'},
    {'id': 90, 'rateItem': '90(高)'},
    {'id': 80, 'rateItem': '80(较高)'},
    {'id': 70, 'rateItem': '70(中上)'},
    {'id': 60, 'rateItem': '60(中等)'},
    {'id': 55, 'rateItem': '55(一般)'},
    {'id': 45, 'rateItem': '45(较少)'},
    {'id': 30, 'rateItem': '30(很少)'},
    {'id': 0, 'rateItem': '0(没有)'}]
  return itemList
}

/**
 * 获取仪器状态列表
 */
export function getLendItem () {
  let itemList = [
    {'id': 0, 'lendItem': '闲置中'},
    {'id': 1, 'lendItem': '已出借'},
    {'id': 2, 'lendItem': '维修中'},
    {'id': 3, 'lendItem': '已丢失'},
    {'id': 4, 'lendItem': '已报废'}
  ]
  return itemList
}

/**
 * 获取地图绘制类型列表
 */
export function getMapDrawingItem () {
  let itemList = [
    {'id': 1, 'drawItem': '点'},
    {'id': 2, 'drawItem': '线'},
    {'id': 3, 'drawItem': '面'}
  ]
  return itemList
}

/**
 * 获取定位方法类型列表
 */
export function getPosMethodItem () {
  let itemList = [
    {'id': 1, 'nameItem': '卫星定位'},
    {'id': 2, 'nameItem': '导线测量'}
  ]
  return itemList
}

/**
 * 获取定位方法类型列表
 */
export function getCorSysItem () {
  let itemList = [
    {'id': 1, 'nameItem': '2000国家大地坐标系'},
    {'id': 2, 'nameItem': '1954年北京坐标系'},
    {'id': 3, 'nameItem': '1980西安坐标系'},
    {'id': 4, 'nameItem': '独立坐标系'}
  ]
  return itemList
}

/**
 * 获取来源列表
 */
export function getOrginItem () {
  let itemList = [
    {'id': 1, 'nameItem': '自测'},
    {'id': 2, 'nameItem': '业主提供'}
  ]
  return itemList
}

/**
 * 获取控制点类级列表
 */
export function getPosCateItem () {
  let itemList = [
    {'id': 1, 'nameItem': '一级RTK'},
    {'id': 2, 'nameItem': '二级RTK'},
    {'id': 3, 'nameItem': '一级导线'},
    {'id': 4, 'nameItem': '二级导线'},
    {'id': 5, 'nameItem': '三级导线'}
  ]
  return itemList
}

/**
 * 获取控制点类级列表
 */
export function getMeasureItem () {
  let itemList = [
    {'id': 1, 'nameItem': '是'},
    {'id': 0, 'nameItem': '否'}
  ]
  return itemList
}

/**
 * 获取线路类型列表
 */
export function getLineTypeItem () {
  let itemList = [
    {'id': 1, 'nameItem': '水准路线'},
    {'id': 2, 'nameItem': '导线'},
    {'id': 3, 'nameItem': 'GPS基线'}
  ]
  return itemList
}

/**
 * 获取高程基准列表
 */
export function getHeightDatumItem () {
  let itemList = [
    {'id': 1, 'nameItem': '1956年黄海高程系统'},
    {'id': 2, 'nameItem': '1985国家高程基准'},
    {'id': 3, 'nameItem': '大地高'},
    {'id': 4, 'nameItem': '任意高程基准'}
  ]
  return itemList
}

/**
 * 获取高程等级列表
 */
export function getHeightLevelItem () {
  let itemList = [
    {'id': 1, 'nameItem': '一等水准'},
    {'id': 2, 'nameItem': '二等水准'},
    {'id': 3, 'nameItem': '三等水准'},
    {'id': 4, 'nameItem': '四等水准'},
    {'id': 5, 'nameItem': '等外水准'},
    {'id': 6, 'nameItem': 'GPS高程'},
    {'id': 7, 'nameItem': '无'}
  ]
  return itemList
}

/**
 * 获取清单规格列表
 */
export function getBillSpecItem () {
  let itemList = [
    {'id': 1, 'nameItem': '40cm×50cm'},
    {'id': 2, 'nameItem': '50cm×50cm'},
    {'id': 3, 'nameItem': '50cm×60cm'},
    {'id': 4, 'nameItem': '50cm×70cm'},
    {'id': 5, 'nameItem': '70cm×80cm'},
    {'id': 6, 'nameItem': '任意图幅'},
    {'id': 7, 'nameItem': 'A4'},
    {'id': 8, 'nameItem': 'A3'},
    {'id': 9, 'nameItem': '待定'}
  ]
  return itemList
}

/**
 * 获取清单备注列表
 */
export function getBillRemarkItem () {
  let itemList = [
    {'id': 1, 'nameItem': '纸质版'},
    {'id': 2, 'nameItem': '电子版'}
  ]
  return itemList
}

/**
 * 获取成果清单项目名
 */
export function getBillNameItem () {
  let itemList = [
    {'id': 1, 'nameItem': '待定'},
    {'id': 2, 'nameItem': '本项目无需提交项目成果'}
  ]
  return itemList
}

export function getSubTaskItem () {
  let itemList = [
    {'id': 1, 'nameItem': '负责人'},
    {'id': 2, 'nameItem': '技术人员'},
    {'id': 3, 'nameItem': '司机'}
  ]
  return itemList
}
