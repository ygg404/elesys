import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 关闭 tab页面
 */
export function closeTab (tabName) {
  console.log('closeTap:' + tabName)
  let mainTabs = store.state.common.mainTabs
  store.commit('common/updateMainTabs', mainTabs.filter(item => item.name !== tabName))
  let mainTabsActiveName = store.state.common.mainTabsActiveName
  mainTabs = mainTabs.filter(item => item.name !== tabName)
  if (mainTabs.length >= 1) {
    // 当前选中tab被删除
    if (tabName === mainTabsActiveName) {
      router.push({ name: mainTabs[mainTabs.length - 1].name }, () => {
        store.commit('common/updateMainTabsActiveName', mainTabs[mainTabs.length - 1].name)
      })
    }
    console.log('router:' + router)
  } else {
    store.commit('common/updateMenuActiveName', '')
    router.push({ name: 'home' })
  }
}
