const auth = require('./utils/auth')

App({
  onLaunch() {
    // 进入小程序，就会校验登录态
    auth.freeLogin(this)

  },
  globalData: {
    themes: {
      primary: '#33B4BC',
      second: '#D2CB1D',
      third: '#D21DAA'
    },
    // 后段交互toekn
    authToken: null,
    userInfo: null
  }
})