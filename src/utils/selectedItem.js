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
export function getTitleItem () {
  return [{'id': 0, 'dateItem': '无'},
            {'id': 1, 'dateItem': '技术员'},
            {'id': 2, 'dateItem': '助理工程师'},
            {'id': 3, 'dateItem': '中级工程师'},
            {'id': 4, 'dateItem': '高级工程师'},
            {'id': 4, 'dateItem': '正高级工程师'}]
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
