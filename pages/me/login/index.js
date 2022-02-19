const string = require('../../../utils/string')
const http = require('../../../utils/http')
const request = require('../../../utils/request')
const image = require('../../../utils/image')
const auth = require('../../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.themes.primary,
    agreeProtocol: false, // 同意注册/登录
    containerHeight: getApp().globalData.windowHeightWithoutHeaderAndFooter,
    loginSuccess: false,
    sourceRoute: null,
    showPolicy: false,
    loginButtonWidth: 0.8 * getApp().globalData.systemInfo.screenWidth,
  },

  showPolicy() {
    this.setData({
      showPolicy: true
    })
  },
  onClosePolicy() {
    this.setData({
      showPolicy: false
    })
  },

  agreeProtocol() {
    this.setData({
      agreeProtocol: !this.data.agreeProtocol
    })
  },

  getPhoneNumber(event) {
    const phoneDetail = event.detail
    wx.login().then(res => {
      if (phoneDetail.errMsg != "getPhoneNumber:ok") {
        return
      }
      getApp().globalData.authToken = null
      http.post(request.login.url, {
        cloudId: phoneDetail.cloudID,
        encryptedData: phoneDetail.encryptedData,
        iv: phoneDetail.iv,
        jsCode: res.code
      }).then(res => {
        getApp().globalData.authToken = res
        auth.getCurrentUser(getApp())
        this.setData({
          loginSuccess: true,
        })
      }).catch(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    })
  },

  goIndex: function () {
    const sourceRoute = this.data.sourceRoute
    if (!string.isEmpty(sourceRoute)) {
      wx.navigateTo({
        url: `/${sourceRoute}`,
      })
    } else {
      wx.redirectTo({
        url: '/pages/home/index',
      })
    }
  },

  goPersonalEdit: function () {
    wx.navigateTo({
      url: '/pages/me/edit/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      loginButtonWidth: 0.6 * getApp().globalData.systemInfo.screenWidth,
    })
  },

  reload: function () {
  
  },
})