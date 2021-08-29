let http = require('../../utils/http')
let request = require('../../utils/request')
let status = require('../../utils/status')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChoose: true,
    items: [],
    alreadyExistId: [],
    pageNum: 1,
    pageSize: 20,
    height: wx.getSystemInfoSync().windowHeight - 0.15 * wx.getSystemInfoSync().windowHeight
  },
  jmp: function (event) {
    let type = event.currentTarget.dataset.type
    let title = ''
    switch (type) {
      case 'join':
        title = '我参与过'
        break
      case 'create':
        title = '我发起的'
        break
      case 'view':
      default:
        title = '我浏览过'
        break
    }
    this.setData({showChoose: false})
    this.list()
    wx.setNavigationBarTitle({
      title: title,
    })
  },
  list: function () {
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
      that.setData({items: items, alreadyExistId: alreadyExistId, pageNum: ++pageNum, pageSize: pageSize})
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