export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    account: '',
    userDetail: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateAccount (state, account) {
      state.account = account
    },
    updateUserDetail (state, userDetail){
      state.userDetail = userDetail
    }
  }
}
