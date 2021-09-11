const http = require('./utils/http')
const request = require('./utils/request')
const auth = require('./utils/auth')


App({
  onLaunch() {
  },
  globalData: {
    themes: {
      primary: '#06C3ED',
      second: '#9933FF',
      third: '#D21DAA'
    },
    // 微信code
    code: null,
    // 后段交互toekn
    authToken: null,
    userInfo: {
      id: null, // id
      phone: null, // 手机号
      nickname: null, // 昵称
      avatar: null, // 头像地址
    }
  }
})
