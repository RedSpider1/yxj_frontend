let http = require('../../utils/http')
let request = require('../../utils/request')
let status = require('../../utils/status')
let color = require('../../utils/color')

Page({
  data: {
    active: 0, // 0: 最新, 1: 搜索
    items: [],
    searchItems: [],
    historyLabels: [],
    searchLabels: [],
    searchParam: {
      keyWord: '',
      labelIds: [],
      pageNum: 1,
      pageSize: 20,
    },
    alreadyExistId: [],
    pageNum: 1,
    pageSize: 20,
    height: wx.getSystemInfoSync().windowHeight - 0.25 * wx.getSystemInfoSync().windowHeight
  },
  onChangeActive (event) {
    console.log(event)
  },
  list () {
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
      }
      that.setData({items: items, alreadyExistId: alreadyExistId, pageNum: ++pageNum, pageSize: pageSize})
    })
  },
  search() {
    let that = this
    http.post(request.groupTeamSearch.url, {
      q: {
        keyword: that.data.searchParam.keyWord,
        lables: that.data.searchParam.labelIds
      },
      currentPage: that.data.searchParam.pageNum,
      pageSize: that.data.searchParam.pageSize
    }).then(res => {
      if (res === null || res.length === 0) {
        wx.showToast({
          title: '没有更多数据了哦',
          icon: 'none'
        })
        return
      }
      let items = that.data.searchItems
      for (let row of res) {
        items.push({
          id: row.id,
          title: row.title,
          introduce: row.introduce,
          subtitle: row.createName + ' 发布于 ' + row.examineTime,
          person: row.currentJoinNum + ' / ' + row.needNum,
          status: status.team_status[row.teamStatus],
        })
      }
      that.setData({searchItems: items, "searchParam.pageNum": searchParam.pageNum + 1})
    })
  },
  listLabel() {
    let that = this
    http.get(request.labelList.url, { 
      pageNum: 1,
      pageSize: 10
    })
    .then(res => {
      if(res) {
        for (let row of res) {
          row.color = color.randomColor()
        }
        that.setData({searchLabels: res})
      }
    })
  },
  listSearchHistory() {
    let that = this
    http.get(request.listSearchHistory.url, {})
    .then(res => {
      if(res) {
        for (let row of res) {
          row.color = color.randomColor()
        }
        that.setData({searchLabels: res})
      }
    })
  },
  onKeyWordChange(e) {
    this.setData({
      "searchParam.keyWord": e.detail,
    });
  },
  onLoad () {
    this.list()
    this.listLabel()
    // this.listSearchHistory()
  },
  onShow () {
    this.selectComponent('#footer').load()
  }
})
