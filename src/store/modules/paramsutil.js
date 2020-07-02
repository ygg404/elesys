export default {
  namespaced: true,
  state: {
    argsPageIndex: '',
    argsPageSize: ''
  },
  mutations: {
    updateargsPageIndex (state, args) {
      state.argsPageIndex = args
    },
    updateargsPageSize (state, args) {
      state.argsPageSize = args
    }
  }
}
