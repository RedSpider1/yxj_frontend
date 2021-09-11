// pages/relation/list/index.js
let http = require('../../../utils/http')
let request = require('../../../utils/request')
let status = require('../../../utils/enums')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    showChoose: true,
    items: [],
    title: '',
    alreadyExistId: [],
    pageNum: 1,
    pageSize: 20,
    height: wx.getSystemInfoSync().windowHeight - 0.15 * wx.getSystemInfoSync().windowHeight
  },
  getTitleByType(type) {
    var title = ''
    switch (type) {
      case 'view':
        title = '我浏览过'
        break;
      case 'join':
        title = '我参与的'
        break;
      case 'create':
        title = '我创建的'
        break;
      case 'star':
        title = '我收藏的'
        break;
      default:
        title = '相关'
    }
    return '友小聚 - ' + title
  },
  list() {
    let that = this
    let pageNum = this.data.pageNum
    let pageSize = this.data.pageSize
    http.get(request.groupTeamQueryList.url, {
      pageNum: pageNum,
      pageSize: pageSize
    }).then(res => {
      if (res === null || res.length === 0) {
        wx.showToast({
          title: '没有更多数据了哦',
          icon: 'none'
        })
        return
      }
      let alreadyExistId = that.data.alreadyExistId
      let items = that.data.items
      for (let row of res) {
        if (alreadyExistId.indexOf(row.id) !== -1) {
          continue
        }
        items.push({
          id: row.id,
          title: row.title,
          introduce: row.introduce,
          subtitle: row.createName + ' 发布于 ' + row.examineTime,
          person: row.currentJoinNum + ' / ' + row.needNum,
          status: status.team_status[row.teamStatus],
        })
        alreadyExistId.push(row.id)
      }
      that.setData({
        items: items,
        alreadyExistId: alreadyExistId,
        pageNum: ++pageNum,
        pageSize: pageSize
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      title: this.getTitleByType(options.type)
    })
    // todo 这里根据不同的type拉数据，然后设置到items上
    this.list()
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