const http = require('./utils/http')
const request = require('./utils/request')

App({
  onLaunch() {
    // this.globalData.authFilter = new Promise(function (resolve, reject) {
    //   auth.authFilter(resolve, reject)
    // })

    wx.login({
      success: res => {
        this.globalData.code = res.code
        let that = this
        http.post(request.login.url, {jsCode: res.code}).then(res => {
          that.globalData.token = res.token
        })
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
