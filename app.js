let auth = require('./utils/auth')

App({
  onLaunch() {
    // this.globalData.authFilter = new Promise(function (resolve, reject) {
    //   auth.authFilter(resolve, reject)
    // })

    wx.login({
      success: res => {
        console.log(res.code)
        this.globalData.code = res.code
      }
    })
  },
  globalData: {
    themeStyle: ['#06C3ED', '#D2CB1D', '#D21DAA'], // primary second third
    curThemeStyle: '#06C3ED',
    code: null,
    token: null,
  }
})
