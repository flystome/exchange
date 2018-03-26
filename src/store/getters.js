const getters = {
  loginData: state => {
    return state.loginData
  },
  marketData: state => {
    var arr = []
    if (state.marketData.length !== 0) {
      Object.keys(state.marketData).forEach((d) => {
        state.marketData[d].forEach(data => {
          arr.push(data)
        })
      })
    }
    return arr
  }
}
export default getters
