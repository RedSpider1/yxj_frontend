// pages/personal-edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.curThemeStyle,
    avatar: '', // 头像地址
    name: '', // 昵称
    birthday: '', // 生日
    sex: '', // 性别
    slogan: '', // 个性签名


    showChooseDate: false,
    // minDate: new Date(1979, 0, 1).getTime(),
    maxDate: new Date(2021, 0, 1).getTime(),
  },
  closeChooseDate: function () {
    this.setData({showChooseDate: false})
  },
  openChooseDate: function () {
    this.setData({showChooseDate: true})
  },
  chooseDate: function () {
    // this
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
    this.selectComponent('#footer').load()
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