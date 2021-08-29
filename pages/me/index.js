const auth = require('../../utils/auth')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  options: {
    addGlobalClass: true
  },
  /**
   * 页面的初始数据
   */
  data: {},

  edit() {
    wx.navigateTo({
      url: '/pages/me/edit/index',
    })
  },
  logout() {
    Dialog.confirm({
        title: '确定注销登录',
        message: '注销后某些功能将不可用，确定注销？',
      }).then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // auth.isLogin()
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
    // auth.isLogin()
    // this.selectComponent('#footer').load()
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