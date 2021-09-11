const auth = require('../../utils/auth')

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  jmp: function (e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/relation/list/index?type=${type}`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    auth.checkLogin()
    this.selectComponent('#footer').load()
  },
})