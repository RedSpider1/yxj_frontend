//filter.js
const string = require('./string')

export const isLogin = function () {
  if (string.isEmpty(getApp().globalData.token)) {
    wx.navigateTo({
      url: '/pages/me/login/index',
    })
  }
}

export const authFilter = function (pageObj) {
    if(pageObj.onShow) {
        let _onShow = pageObj.onShow
        pageObj.onShow = function () {
          appData.promise.then(() => {
            wx.redirectTo({
              url: "/pages"
            })
          }, () => {
              let currentInstance = getPageInstance()
              _onShow.call(currentInstance);
          })
        }
    }
    return pageObj;
}