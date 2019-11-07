const commonDetail = {
  state: {
    merchantTaskDetail: ''
  },
  mutations: {
    ADD_DETAIL: (state, merchantTaskDetail) => {
      state.merchantTaskDetail = merchantTaskDetail
    }

  },
  actions: {
    addDetail({ commit }, merchantTaskDetail) {
      commit('ADD_DETAIL', merchantTaskDetail)
    }
  }
}

export default commonDetail
