// pages/relation/list/index.js
const http = require('../../../utils/http')
const request = require('../../../utils/request')
const auth = require('../../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    requestUrl: '',
    showChoose: true,
    items: [],
    title: '',
    alreadyExistId: [],
    pageNum: 1,
    pageSize: 20,
    hasNoMore: false,
    height: wx.getSystemInfoSync().windowHeight - 0.15 * wx.getSystemInfoSync().windowHeight
  },
  getTitleByType: function (type) {
    let title = ''
    let requestUrl = ''
    switch (type) {
      case 'view':
        title = '我浏览过'
        requestUrl = request.groupTeamQueryViewedGroups.url
        break;
      case 'join':
        title = '我参与的'
        requestUrl = request.groupTeamQueryInvolveGroups.url
        break;
      case 'create':
        title = '我创建的'
        requestUrl = request.groupTeamQueryListByUser.url
        break;
      case 'star':
        title = '我收藏的'
        break;
      default:
        title = '相关'
    }
    this.setData({requestUrl: requestUrl})
    return '友小聚 - ' + title
  },
  list: function () {
    if(this.data.hasNoMore) {
      return
    }
    let that = this
    let pageNum = this.data.pageNum
    let pageSize = this.data.pageSize

    if (this.data.requestUrl === '') {
      this.setData({hasNoMore: true})
      return
    }
    
    http.get(this.data.requestUrl, {
      pageNum: pageNum,
      pageSize: pageSize
    }).then(res => {
      if (res === null || res.length === 0) {
        this.setData({hasNoMore: true})
        return
      }
      let alreadyExistId = that.data.alreadyExistId
      let items = that.data.items
      for (let row of res) {
        if (alreadyExistId.indexOf(row.id) !== -1) {
          continue
        }
        items.push(row)
      }
      that.setData({items: items, alreadyExistId: alreadyExistId, pageNum: ++pageNum, pageSize: pageSize})
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
})