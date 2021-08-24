let string = require('../../utils/string')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.curThemeStyle,
    agreeProtocol: false, // 同意注册/登录
    containerHeight: 0,
    loginButtonWidth: 0,
    loginSuccess: false,
  },
  agreeProtocol () {
    this.setData({agreeProtocol: !this.data.agreeProtocol})
  },
  getPhoneNumber (event) {
    console.log(event)
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
      }
    })
    getApp().globalData.token = '1'
    this.setData({loginSuccess: true})
    this.reload()
  },
  goIndex: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  goPersonalEdit: function () {
    wx.navigateTo({
      url: '/pages/personal-edit/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!string.isEmpty(getApp().globalData.token)) {
      this.selectComponent('#header').back()
      return
    }

    this.reload()
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