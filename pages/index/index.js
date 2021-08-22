let http = require('../../utils/http')
let request = require('../../utils/request')
let status = require('../../utils/status')

Page({
  data: {
    active: 0, // 0: 最新, 1: 搜索
    items: [],
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
        alreadyExistId.push(row.id)
      }
      that.setData({items: items, alreadyExistId: alreadyExistId, pageNum: ++pageNum, pageSize: pageSize})
    })
  },
  onLoad () {
    this.list()
  },
  onShow () {
    this.selectComponent('#footer').load()
  }
})
