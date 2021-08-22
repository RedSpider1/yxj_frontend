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
    token: null,
    authFilter: null,
    code: null
  }
})
