let http = require('../../utils/http')
let auth = require('../../utils/auth')

Page({
  data: {
    // 一级颜色
    primary: getApp().globalData.themes.primary,
    // 0: 最新, 1: 搜索
    active: 0,
    
    // 最新组队单操作信息
    newOpInfo: {
      // 组队单列表
      items: [],
      // 已经存在于组队单列表的id
      alreadyExistId: [],
      // 页码
      pageNum: 1,
      // 页大小
      pageSize: 20,
      // 高度设置
      height: wx.getSystemInfoSync().windowHeight - 0.25 * wx.getSystemInfoSync().windowHeight + 20,
      // 是否没有数据
      hasNoMore: false, 
      // 组队单列表类型 0首页, 1我参与过, 2我浏览过, 3收藏列表
      type: 0
    },
    // searchItems: [],
    // historyLabels: [],
    // searchLabels: [],
    // searchParam: {
    //   keyWord: '',
    //   labelIds: [],
    //   pageNum: 1,
    //   pageSize: 20,
    // },
  },
  onChangeActive (event) {
    console.log(event)
  },

  /**
   * 请求最新组队单接口
   */
  newList () {
    let newOpInfo = this.data.newOpInfo
    if(newOpInfo.hasNoMore) {
      return
    }
    http.get('/pss/group/list', {
      pageNum: newOpInfo.pageNum,
      pageSize: newOpInfo.pageSize,
      type: newOpInfo.type
    }).then(res => {
      if (res === null || res.length === 0) {
        this.setData({'newOpInfo.hasNoMore': true})
        return
      }

      let alreadyExistId = newOpInfo.alreadyExistId
      let items = newOpInfo.items
      for (let row of res) {
        if (alreadyExistId.indexOf(row.id) !== -1) {
          continue
        }
        items.push(row)
      }
      this.setData({
        'newOpInfo.items': items, 
        'newOpInfo.alreadyExistId': alreadyExistId, 
        'newOpInfo.pageNum': ++newOpInfo.pageNum
      })
    }).catch(res => {
      console.log(res)
    })
  },


  // search() {
  //   let that = this
  //   http.post(request.groupTeamSearch.url, {
  //     q: {
  //       keyword: that.data.searchParam.keyWord,
  //       lables: that.data.searchParam.labelIds
  //     },
  //     currentPage: that.data.searchParam.pageNum,
  //     pageSize: that.data.searchParam.pageSize
  //   }).then(res => {
  //     if (res === null || res.length === 0) {
  //       wx.showToast({
  //         title: '没有更多数据了哦',
  //         icon: 'none'
  //       })
  //       return
  //     }
  //     let items = that.data.searchItems
  //     for (let row of res) {
  //       items.push({
  //         id: row.id,
  //         title: row.title,
  //         introduce: row.introduce,
  //         subtitle: row.createName + ' 发布于 ' + row.examineTime,
  //         person: row.currentJoinNum + ' / ' + row.needNum,
  //         status: enums.team_status[row.teamStatus],
  //       })
  //     }
  //     that.setData({searchItems: items, "searchParam.pageNum": searchParam.pageNum + 1})
  //   })
  // },
  // listLabel() {
  //   let that = this
  //   http.get(request.labelList.url, { 
  //     pageNum: 1,
  //     pageSize: 10
  //   })
  //   .then(res => {
  //     if(res) {
  //       for (let row of res) {
  //         row.color = color.randomColor()
  //       }
  //       that.setData({searchLabels: res})
  //     }
  //   })
  // },
  // listSearchHistory() {
  //   let that = this
  //   http.get(request.listSearchHistory.url, {})
  //   .then(res => {
  //     if(res) {
  //       for (let row of res) {
  //         row.color = color.randomColor()
  //       }
  //       that.setData({searchLabels: res})
  //     }
  //   })
  // },

  // onKeyWordChange(e) {
  //   this.setData({
  //     "searchParam.keyWord": e.detail,
  //   });
  // },
  onLoad () {
    auth.checkAuthAndExecCallback(this.init)
  },

  init () {
    this.newList()
    // this.listLabel()
    // todo 这里会报没权限 检查一下
    // this.listSearchHistory()
  }
})
