//filter.js
const string = require('./string')
const http = require('./http')
const request = require('./request')

function login (tryLogin) {
  const app = getApp()
  const pages = getCurrentPages()
  const sourceRoute = pages[pages.length - 1].route
  // 有无token来进行处理
  if (string.isEmpty(app.globalData.authToken)) {
    wx.login({
      success: res => {
        app.globalData.code = res.code
        http.post(request.login.url, {jsCode: res.code}).then(res => {
          app.globalData.authToken = res.token
          if (!tryLogin) {
            wx.navigateTo({
              url: `/pages/me/login/index?sourceRoute=${sourceRoute}`,
            })
          }
        })
      }
    })
  } else if (string.isEmpty(app.globalData.userInfo.phone) && !tryLogin) {
    wx.navigateTo({
      url: `/pages/me/login/index?sourceRoute=${sourceRoute}`,
    })
  }
}

/**
 * 尝试登录
 */
export const tryLogin = function () {
  const app = getApp()
  if (string.isEmpty(app.globalData.authToken) || string.isEmpty(app.globalData.userInfo.phone)) {
    login(true)
  }
}

/**
 * 登录校验
 */
export const checkLogin = function () {
  const app = getApp()
  if (string.isEmpty(app.globalData.authToken) || string.isEmpty(app.globalData.userInfo.phone)) {
    login(false)
  }
}

export const logout = function () {
  const app = getApp()
  app.globalData.authToken = null
  app.globalData.userInfo = {
    id: null, // id
    phone: null, // 手机号
    nickname: null, // 昵称
    avatar: null, // 头像地址
    wechatNum: null, // 微信号
    sex: '男', // 性别
    slogan: '', // 个性签名
    birthday: '1970-01-01', // 生日
  }
}
