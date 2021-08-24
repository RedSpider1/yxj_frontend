let http = require('../../utils/http')
let request = require('../../utils/request')
let status = require('../../utils/status')
let color = require('../../utils/color')
let file = require('../../utils/file')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    platoonId: null, // 组队单id
    title: '', // 标题
    introduce: '', // 内容
    authorName: '', // 用户名
    firstAuthorNameChar: '', // 首字母
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
    } // 导航按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let that = this
    http.get(request.groupTeamDetails.url + platoonId).then(res => {
      let labelArray = []
      if (res.labelIdArray !== null && typeof res.labelIdArray !== undefined) {
        for (let label of res.labelIdArray) {
          labelArray.push({
            color: color.randomColor(),
            name: label
          })
        }
      }
      let pictureUrlArray = []
      if (res.pictureUrlArray !== null && typeof res.pictureUrlArray !== undefined) {
        for (let pictureUrl of res.pictureUrlArray) {
          pictureUrlArray.push(file.default.getImgUrl(pictureUrl))
        }
      }
      let countDownTime = res.expireTimestamp - new Date().getTime()

      that.setData({
        title: res.title, 
        introduce: res.introduce,
        authorName: res.createName,
        firstAuthorNameChar: res.createName.substring(0, 1),
        examineTime: res.examineTime,
        expireTime: res.expireTime,
        countDownTime: countDownTime,
        labelArray: labelArray,
        personRateDesc: `${res.currentJoinNum} / ${res.needNum}`,
        personRate: res.currentJoinNum * 1.0 / res.needNum * 100,
        personColor: res.teamStatus === 3 ? '#e15141' : (res.teamStatus === 2 ? '#07c160' : '#3d8af2'),
        status: res.teamStatus,
        statusDesc: status.team_status[res.teamStatus],
        pictureUrlArray: pictureUrlArray,
        largeSize: Math.min(wx.getSystemInfoSync().windowHeight, wx.getSystemInfoSync().windowWidth) - 50,
      })
    })

    http.get(request.groupTeamQueryUsers.url, {groupId: this.data.platoonId}).then(res => {
      let joinerInfos = []
      for (let joinerInfo of res) {
        joinerInfos.push({
          id: joinerInfo.id,
          name: joinerInfo.name,
          avatar: file.default.getImgUrl(joinerInfo.avatar),
          type: joinerInfo.type === 0 ? '手机' : '微信',
          contact: joinerInfo.type === 0 ? joinerInfo.phone : joinerInfo.wechatNum
        })
      }
      that.setData({joinerInfos: joinerInfos})
    })
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