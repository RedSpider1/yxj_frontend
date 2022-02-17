const auth = require('../../utils/auth')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    containerHeight: 0,
  },

  jmp: function (e) {
    auth.checkAndGoToLoginPageOrCallback(() => {
      const type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: `/pages/relation/list/index?type=${type}`,
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const query = wx.createSelectorQuery()
    query.select('#header').boundingClientRect()
    query.exec(res => {
      const systemInfo = wx.getSystemInfoSync()
      let containerHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - res[0].height
      this.setData({
        containerHeight: containerHeight
      })
    })
  },
})