const http = require('./utils/http')
const request = require('./utils/request')

App({
  onLaunch() {
    // this.globalData.authFilter = new Promise(function (resolve, reject) {
    //   auth.authFilter(resolve, reject)
    // })

    // wx.login({
    //   success: res => {
    //     this.globalData.code = res.code
    //     let that = this
    //     http.post(request.login.url, {jsCode: res.code}).then(res => {
    //       that.globalData.token = res.token
    //     })
    //   }
    // })
    userInfo: {
      username: 13012345678
    }
  },
  globalData: {
    themes: {
      primary: '#06C3ED',
      second: '#9933FF',
      third: '#D21DAA'
    },
    // todo 删除这个
    themeStyle: ['#06C3ED', '#D2CB1D', '#D21DAA'], // primary second third
    // todo 删除这个
    curThemeStyle: '#06C3ED',
    code: null,
    token: null,
    userInfo: null,
  }
})
