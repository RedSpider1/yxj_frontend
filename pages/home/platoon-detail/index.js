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
    joinerInfos: [], // 参与组队单用户信息
    showShare: false, // 展示分享
    showOptions: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '微博', icon: 'weibo' },
      { name: '复制链接', icon: 'link' },
      { name: '分享海报', icon: 'poster' },
      { name: '二维码', icon: 'qrcode' },
    ],
    movableBtn: {
      width: wx.getSystemInfoSync().windowWidth - 40,
      height: wx.getSystemInfoSync().windowHeight - 40
    }, // 导航按钮
    // 这里聚合按钮的显示逻辑，要根据当前用户的登录状态或id来判断
    showBtn: {
      join: true, // 参与
      exit: true, // 退出
      login: true, // 登录
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
  init (options) {
    const query = wx.createSelectorQuery()
    query.select('#header').boundingClientRect()
    query.exec(res => {
      this.setData({headerHeight: res[0].height - 1})
    })

    let platoonId = options.id
    if (platoonId === null || typeof platoonId === 'undefined' || platoonId === '') {
      wx.navigateTo({
        url: '/pages/index/index',
        success () {
          wx.showToast({
            title: '组队单id错误',
            icon: 'error',
            duration: 1000
          })
        }
      })
      return
    }

    this.setData({platoonId: platoonId})
    http.get(`pss/group/id/${platoonId}`).then(res => {
      let pictureUrlArray = []
      if (res.resourceObjList !== null && typeof res.resourceObjList !== undefined) {
        for (let pictureUrl of res.resourceObjList) {
          pictureUrlArray.push(file.default.getImgUrl(pictureUrl.path))
        }
      }
      this.setData({
        title: res.title,
        introduce: res.introduction,
        authorId: res.ownerInfo.id,
        authorName: res.ownerInfo.name,
        authorAvatar: file.default.getImgUrl(res.ownerInfo.avatar),
        examineTime: time.timestap2Str(new Date(res.startTime)),
        expireTime: new Date(res.endTime).toISOString(),
        countDownTime: res.endTime - new Date().getTime(),
        personRate: res.condition.currentTeamSize / res.condition.minTeamSize,
        pictureUrlArray: pictureUrlArray,
      })
      console.log(this.data)
      // let labelArray = []
      // if (res.labels !== null && typeof res.labels !== undefined) {
      //   for (let label of res.labels) {
      //     labelArray.push({
      //       color: color.randomColor(),
      //       name: label
      //     })
      //   }
      // }
      
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
    })

    // http.get(request.groupTeamQueryUsers.url, {groupId: this.data.platoonId}).then(res => {
    //   let joinerInfos = []
    //   for (let joinerInfo of res) {
    //     joinerInfos.push({
    //       id: joinerInfo.id,
    //       name: joinerInfo.name,
    //       avatar: file.default.getImgUrl(joinerInfo.avatar),
    //       type: joinerInfo.type === 0 ? '手机' : '微信',
    //       contact: joinerInfo.type === 0 ? joinerInfo.phone : joinerInfo.wechatNum,
    //       // todo 这里的逻辑要确认下，现在先取创建时间
    //       createTime: joinerInfo.createTime,
    //     })
    //   }
    //   that.setData({joinerInfos: joinerInfos})
    // })

    // if (string.isNotEmpty(getApp().globalData.authToken)) {
    //   http.get(request.groupTeamSelelctGroupTeamUserStatus.url(this.data.platoonId)).then(res => {
    //     // todo
    //   })
    // }
  },


  enlargeImg: function (event) {
    let pictureUrl = event.currentTarget.dataset.url
    console.log(pictureUrl)
    this.setData({enlargeImg: true, largeImg: pictureUrl})
  },
  ensmallImg: function () {
    this.setData({enlargeImg: false})
  },
  openShowShare: function () {
    this.setData({showShare: true})
  },
  closeShowShare() {
    this.setData({showShare: false});
  },
  selectShowShare(event) {
    Toast(event.detail.name);
    this.onClose();
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