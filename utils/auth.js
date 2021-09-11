//filter.js
const string = require('./string')
const http = require('./http')
const request = require('./request')

function login () {
  const app = getApp()
  wx.login({
    success: res => {
      app.globalData.code = res.code
      http.post(request.login.url, {jsCode: res.code}).then(res => {
        app.globalData.authToken = res.token
        wx.navigateTo({
          url: '/pages/me/login/index',
        })
      })
    }
  })
}

export const checkLogin = function () {
  const app = getApp()
  if (string.isEmpty(app.globalData.authToken) || string.isEmpty(app.globalData.userInfo.phone)) {
    login()
  }
}

