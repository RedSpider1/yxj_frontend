// pages/relation/list/index.js
const http = require('../../../utils/http')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    // 最新组队单操作信息
    newOpInfo: {
      // 组队单列表
      items: [],
      // 页码
      pageNum: 1,
      // 页大小
      pageSize: 20,
      // 高度设置
      height: wx.getSystemInfoSync().windowHeight,
      // 是否没有数据
      hasNoMore: false,
      loading: false,
      // 组队单列表类型 0首页, 1我参与的, 2我浏览过, 3收藏列表 4我创建的 5搜索页面
      type: 0
    },
  },
  getTitleByType: function (type) {
    let title = ''
    switch (type) {
      case '2':
        title = '我浏览过'
        break;
      case '1':
        title = '我参与的'
        break;
      case '4':
        title = '我创建的'
        break;
      case '3':
        title = '我收藏的'
        break;
      default:
        title = '相关'
    }

    return '友小聚 - ' + title
  },
  async newList() {
    let newOpInfo = this.data.newOpInfo
    if (newOpInfo.hasNoMore || newOpInfo.loading) {
      return
    }
    this.setData({
      'newOpInfo.loading': true
    })
    http.get('/pss/group/list', {
      pageNum: newOpInfo.pageNum,
      pageSize: newOpInfo.pageSize,
      type: newOpInfo.type
    }).then(res => {
      if (res === null || res.length === 0) {
        this.setData({
          'newOpInfo.hasNoMore': true,
          'newOpInfo.loading': false,
        })
        return
      }

      let items = newOpInfo.items
      for (let row of res) {
        items.push(row)
      }
      this.setData({
        'newOpInfo.items': items,
        'newOpInfo.loading': false,
        'newOpInfo.pageNum': ++newOpInfo.pageNum
      })
      if (res.length < newOpInfo.pageSize) {
        this.setData({
          'newOpInfo.hasNoMore': true,
        })
      }
    }).catch(res => {
      console.log(res)
      this.setData({
        'newOpInfo.loading': false
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      title: this.getTitleByType(options.type),
      'newOpInfo.type': options.type
    })
    this.newList()
  },
})