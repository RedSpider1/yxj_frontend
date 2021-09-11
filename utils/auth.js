//filter.js
const string = require('./string')

function login () {
  wx.login({
    success: res => {
      this.globalData.code = res.code
      let that = this
      http.post(request.login.url, {jsCode: res.code}).then(res => {
        that.globalData.authToken = res.token
      })
    }
  })
}

export const checkLogin = function () {
  if (string.isEmpty(getApp().globalData.authToken)) {
    login()
  }

  if (string.isEmpty(getApp().globalData.authToken)) {
    wx.navigateTo({
      url: '/pages/me/login/index',
    })
  }
}

