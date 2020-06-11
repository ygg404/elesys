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
