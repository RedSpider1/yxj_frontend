// pages/home/platoon-detail/index.js
const http = require('../../../utils/http')
const request = require('../../../utils/request')
const status = require('../../../utils/enums')
const color = require('../../../utils/color')
const string = require('../../../utils/string')
const file = require('../../../utils/file')
const auth = require('../../../utils/auth')
const time = require('../../../utils/time')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerHeight: 0,
    primary: getApp().globalData.themes.primary,
    platoonId: null, // 组队单id
    title: '', // 标题
    introduce: '', // 内容
    authorId: '', // 作者id
    authorName: '', // 作者名
    authorAvatar: '', // 作者头像
    examineTime: '', // 发布时间
    expireTime: '', // 截止时间
    countDownTime: 0, // 倒计时
    labelArray: [], // 标签
    personDesc: '', // 参加人数 / 组队人数 描述
    personRate: 0, // 参加人数 / 组队人数 百分比
    personColor: '', // 参加人数 / 组队人数 颜色
    status: 0, // 组队单状态
    statusDesc: '', // 组队单状态描述
    enlargeImg: false, // 是否放大图片
    largeImg: '', // 放大图片的url
    largeSize: 0, // 屏幕长度/宽度
    joinerInfos: [], // 参与组队单用户信息，
    involveList: [], // 参与记录
    showShare: false, // 展示分享
    showJoinDialog: false,
    showOptions: [{
        name: '微信',
        icon: 'wechat',
        openType: 'share'
      },
      {
        name: '微博',
        icon: 'weibo'
      },
      {
        name: '复制链接',
        icon: 'link'
      },
      {
        name: '分享海报',
        icon: 'poster'
      },
      {
        name: '二维码',
        icon: 'qrcode'
      },
    ],
    movableBtn: {
      width: wx.getSystemInfoSync().windowWidth - 40,
      height: wx.getSystemInfoSync().windowHeight - 40
    }, // 导航按钮
    // 这里聚合按钮的显示逻辑，要根据当前用户的登录状态或id来判断
    showBtn: {
      join: true, // 参与
      exit: true, // 退出
      abandon: true, // 废弃
      edit: true, // 修改
      pass: true, // 提前成功
      postpone: true, // 延期
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    auth.checkAuthAndExecCallback(() => this.init(options))
  },
  async init(options) {
    const query = wx.createSelectorQuery()
    query.select('#header').boundingClientRect()
    query.exec(res => {
      this.setData({
        headerHeight: res[0].height - 1
      })
    })

    let platoonId = options.id
    if (platoonId === null || typeof platoonId === 'undefined' || platoonId === '') {
      wx.navigateTo({
        url: '/pages/index/index',
        success() {
          wx.showToast({
            title: '组队单id错误',
            icon: 'error',
            duration: 1000
          })
        }
      })
      return
    }
    this.setData({
      platoonId: platoonId
    })

    const groupInfo = await http.get(`pss/group/id/${platoonId}`)
    let pictureUrlArray = []
    if (groupInfo.resourceObjList !== null && typeof groupInfo.resourceObjList !== undefined) {
      for (let pictureUrl of groupInfo.resourceObjList) {
        pictureUrlArray.push(file.default.getImgUrl(pictureUrl.path))
      }
    }
    let labelArray = []
    for (let label of groupInfo.labels) {
        for (const v of getApp().globalData.labels) {
          if(label == v.id.toString()) {
            labelArray.push({
              color: v.color,
              name: v.name,
              id: v.id
            })
          }
        }
    }
    this.setData({
      title: groupInfo.title,
      introduce: groupInfo.introduction,
      authorId: groupInfo.ownerInfo.id,
      authorName: groupInfo.ownerInfo.name,
      authorAvatar: file.default.getImgUrl(groupInfo.ownerInfo.avatar),
      examineTime: time.timestap2Str(new Date(groupInfo.startTime)),
      expireTime: new Date(groupInfo.endTime).toISOString(),
      countDownTime: groupInfo.endTime - new Date().getTime(),
      personRate: groupInfo.condition.currentTeamSize / groupInfo.condition.minTeamSize,
      pictureUrlArray: pictureUrlArray,
      labelArray: labelArray,
    })

    // let countDownTime = parseInt(res.endTime) / 1000 - new Date().getTime()
    // that.setData({
    //   title: res.title, 
    //   introduce: res.introduce,
    //   authorId: res.ownerId,
    //   authorName: res.createName,
    //   firstAuthorNameChar: res.ownerId,
    //   examineTime: res.examineTime,
    //   expireTime: res.endTime,
    //   countDownTime: countDownTime,
    //   labelArray: labelArray,
    //   personRateDesc: `${res.currentJoinNum} / ${res.condition.minTeamSize}`,
    //   personRate: res.currentJoinNum * 1.0 / res.condition.minTeamSize * 100,
    //   personColor: res.teamStatus === 3 ? '#e15141' : (res.teamStatus === 2 ? '#07c160' : '#3d8af2'),
    //   status: res.teamStatus,
    //   statusDesc: status.team_status[res.teamStatus],
    //   pictureUrlArray: pictureUrlArray,
    //   largeSize: Math.min(wx.getSystemInfoSync().windowHeight, wx.getSystemInfoSync().windowWidth) - 50,
    // })

    // http.get(request.getUserInfoById.url, {userId: that.data.authorId}).then(res => {
    //   that.setData({
    //     authorAvatar: file.default.getImgUrl(res.avatar),
    //     authorName: res.name
    //   })
    // })

    http.get(request.groupTeamQueryUsers.url + '/' + this.data.platoonId).then(res => {
      let joinerInfos = []
      for (let joinerInfo of res.attendeeVOS) {
        joinerInfos.push({
          id: joinerInfo.userId,
          name: joinerInfo.name,
          avatar: joinerInfo.avatar,
          type: joinerInfo.attendeeContactVO.name,
          contact: joinerInfo.attendeeContactVO.value,
        })
      }
      this.setData({joinerInfos: joinerInfos})
    })

    http.post('pss/group/involveList', {
      "id": this.data.platoonId,
      "keyWord": "",
      "offset": 0,
      "pageNum": 1,
      "pageSize": 999
    }).then(res => {
      let involveList = []
      for (let v of res) {
        involveList.push({
          id: v.id,
          userId: v.userInfo.userId,
          userName: v.userInfo.name,
          userAvatar: v.userInfo.avatar,
          flag: v.flag,
          pictureUrlArray: v.pictureUrlArray,
          remark: v.remark,
          createTime: time.timestap2Str(new Date(v.createTime))
        })
      }
      this.setData({involveList: involveList})
    })

    // if (string.isNotEmpty(getApp().globalData.authToken)) {
    //   http.get(request.groupTeamSelelctGroupTeamUserStatus.url(this.data.platoonId)).then(res => {
    //     // todo
    //   })
    // }
  },


  enlargeImg: function (event) {
    let pictureUrl = event.currentTarget.dataset.url
    console.log(pictureUrl)
    this.setData({
      enlargeImg: true,
      largeImg: pictureUrl
    })
  },
  ensmallImg: function () {
    this.setData({
      enlargeImg: false
    })
  },
  openShowShare: function () {
    this.setData({
      showShare: true
    })
  },
  closeShowShare() {
    this.setData({
      showShare: false
    });
  },
  selectShowShare(event) {
    Toast(event.detail.name);
    this.onClose();
  },
  joinTeam() {
    this.setData({
      showJoinDialog: true
    })
  },
  onConfirmJoin() {

  },
  
  onCloseJoinDialog() {
    this.setData({
      showJoinDialog: false
    })
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