let string = require('../../../utils/string')
const http = require('../../../utils/http')
const request = require('../../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.themes.primary,
    agreeProtocol: false, // 同意注册/登录
    containerHeight: 0,
    loginButtonWidth: 0,
    loginSuccess: false,
  },
  agreeProtocol () {
    this.setData({agreeProtocol: !this.data.agreeProtocol})
  },
  getPhoneNumber (event) {
    const phoneDetail = event.detail
    http.post(request.phone.url, {
      cloudId: phoneDetail.cloudId,
      encryptedData: phoneDetail.encryptedData,
      iv: phoneDetail.iv
    }).then(res => {
      this.setData({loginSuccess: true})
    }).catch(res => {
      console.log(res)
    })
  },
  goIndex: function () {
    wx.navigateTo({
      url: '/pages/home/index',
    })
  },
  goPersonalEdit: function () {
    wx.navigateTo({
      url: '/pages/me/edit/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const app = getApp()
    if (!string.isEmpty(app.globalData.authToken)) {
      const phone = app.globalData.userInfo.phone
      if (!string.isEmpty(phone)) {
        this.selectComponent('#header').back()
        return
      }
    }

    let that = this
    http.get(request.getUserInfo.url).then(res => {
      if (res !== null && !string.isEmpty(res.phone)) {
        this.selectComponent('#header').back()
        return
      } else {
        that.reload()
      }
    })
  },
  reload: function () {
    const query = wx.createSelectorQuery()
    query.select('#header').boundingClientRect()
    const that = this
    query.exec(res => {
      const systemInfo = wx.getSystemInfoSync()
      let containerHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - res[0].height
      if (that.data.loginSuccess) {
        containerHeight = 0.9 * containerHeight
      }
      that.setData({containerHeight: containerHeight, loginButtonWidth: 0.6 * systemInfo.screenWidth})
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})