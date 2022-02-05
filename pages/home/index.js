let http = require('../../utils/http')
let auth = require('../../utils/auth')
let time = require('../../utils/time')
let request = require('../../utils/request')
let enums = require('../../utils/enums')

Page({
  data: {
    // 一级颜色
    primary: getApp().globalData.themes.primary,
    // 0: 最新, 1: 搜索
    active: 0,
    items: [],
    // 最新组队单操作信息
    newOpInfo: {
      // 组队单列表
      items: [],
      // 页码
      pageNum: 1,
      // 页大小
      pageSize: 20,
      // 高度设置
      height: wx.getSystemInfoSync().windowHeight - 0.25 * wx.getSystemInfoSync().windowHeight + 20,
      // 是否没有数据
      hasNoMore: false,
      loading: false,
      // 组队单列表类型 0首页, 1我参与的, 2我浏览过, 3收藏列表 4我创建的 5搜索页面
      type: 0
    },
    searchOpInfo: {
      // 组队单列表
      items: [],
      keyword: '',
      // 页码
      pageNum: 1,
      // 页大小
      pageSize: 20,
      // 高度设置
      height: wx.getSystemInfoSync().windowHeight - 0.25 * wx.getSystemInfoSync().windowHeight + 20,
      // 是否没有数据
      hasNoMore: false,
      loading: false,
      // 组队单列表类型 0首页, 1我参与的, 2我浏览过, 3收藏列表 4我创建的 5搜索页面
      type: 5
    },
    searchItems: [],
    historyLabels: [],
    searchLabels: [],
  },
  onChangeActive(event) {},

  /**
   * 请求最新组队单接口
   */
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

  async searchList() {
    let searchOpInfo = this.data.searchOpInfo
    if (searchOpInfo.hasNoMore || searchOpInfo.loading) {
      return
    }
    this.setData({
      'searchOpInfo.loading': true
    })
    http.get('/pss/group/list', {
      pageNum: searchOpInfo.pageNum,
      pageSize: searchOpInfo.pageSize,
      keyWord: searchOpInfo.keyword,
      type: searchOpInfo.type
    }).then(res => {
      if (res === null || res.length === 0) {
        this.setData({
          'searchOpInfo.hasNoMore': true,
          'searchOpInfo.loading': false,
        })
        return
      }

      let items = searchOpInfo.items
      for (let row of res) {
        items.push(row)
      }
      this.setData({
        'searchOpInfo.items': items,
        'searchOpInfo.loading': false,
        'searchOpInfo.pageNum': ++searchOpInfo.pageNum
      })
      if (res.length < searchOpInfo.pageSize) {
        this.setData({
          'searchOpInfo.hasNoMore': true,
        })
      }
    }).catch(res => {
      console.log(res)
      this.setData({
        'searchOpInfo.loading': false
      })
    })
  },

  search() {
    this.setData({
      "searchOpInfo.pageNum": 1,
      'searchOpInfo.items': [],
      'searchOpInfo.hasNoMore': false,
    });
    this.searchList()
  },

  onKeyWordChange(e) {
    this.setData({
      "searchOpInfo.keyword": e.detail,
    });
  },
  onShow() {
    auth.checkAuthAndExecCallback(this.init)
  },

  init() {
    this.newList()
    // this.listLabel()
    // todo 这里会报没权限 检查一下
    // this.listSearchHistory()
  }
})