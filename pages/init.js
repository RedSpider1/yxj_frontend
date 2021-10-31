const auth = require('../utils/auth')
const http = require('../utils/http')
const request = require('../utils/request')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    containerHeight: 0,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const systemInfo = wx.getSystemInfoSync()
    let containerHeight = systemInfo.windowHeight
    this.setData({
      containerHeight: containerHeight
    })
    http.get(request.getEnums.url, null, false).then((res) => {
      getApp().globalData.enums = res
      console.log('getEnum result', res)
    }).then( () => {
      auth.freeLogin(getApp())
    }).then( () => {
      wx.reLaunch({
        url: `/pages/home/index`,
      })
    })
  },
})