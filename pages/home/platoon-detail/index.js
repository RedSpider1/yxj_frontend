// pages/home/platoon-detail/index.js
const http = require('../../../utils/http')
const request = require('../../../utils/request')
const file = require('../../../utils/file')
const auth = require('../../../utils/auth')
const time = require('../../../utils/time')
const enums = require('../../../utils/enums')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: {},
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
    personRate: 0, // 参加人数 / 组队人数 百分比
    personColor: '#1989fa', // 参加人数 / 组队人数 颜色
    statusLabel: '',
    status: 0, // 组队单状态
    statusDesc: '', // 组队单状态描述
    enlargeImg: false, // 是否放大图片
    largeImg: '', // 放大图片的url
    largeSize: 200, // 屏幕长度/宽度
    joinerInfos: [], // 参与组队单用户信息，
    involveList: [], // 参与记录
    showShare: false, // 展示分享
    showJoinDialog: false,
    showExitDialog: false,
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
    onShareAppMessage() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: '转发到朋友圈'
          })
        }, 2000)
      })
      return {
        title: '转发到朋友圈',
        path: '/pages/home/platoon-detail/index?id=' + this.data.platoonId,
        promise
      }
    },
    movableBtn: {
      width: wx.getSystemInfoSync().windowWidth - 40,
      height: wx.getSystemInfoSync().windowHeight - 40
    }, // 导航按钮
    // 这里聚合按钮的显示逻辑，要根据当前用户的登录状态或id来判断
    showBtn: {
      join: false, // 参与
      exit: false, // 退出
      abandon: false, // 废弃
      edit: false, // 修改
      pass: false, // 提前成功
      postpone: false, // 延期
      collect: false, // 收藏
      login: false, // 登录
    },
    contacts: [],
    currentContact: {},
    joinDescription: '',
    exitDescription: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options)
    // auth.checkAuthAndExecCallback(() => this.init(options))
  },
  login() {
    auth.goToLoginPage()
  },
  async init(options) {
    this.initData()
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
    const relation = await http.get(`pss/group/${platoonId}/user-group-relation`)
    if (getApp().globalData.userInfo == null) {
      this.setData({
        'showBtn.login': true,
      })
    } else {
      this.setData({
        'showBtn.join': !relation.joined && !relation.created && groupInfo.status == 20,
        'showBtn.exit': relation.joined && !relation.created && groupInfo.status == 20,
        'showBtn.collect': !relation.collected,
      })
    }
    let pictureUrlArray = []
    if (groupInfo.resourceObjList !== null && typeof groupInfo.resourceObjList !== undefined) {
      for (let pictureUrl of groupInfo.resourceObjList) {
        pictureUrlArray.push(file.default.getImgUrl(pictureUrl.path))
      }
    }
    let labelArray = []
    for (let label of groupInfo.labels) {
      for (const v of getApp().globalData.labels) {
        if (label == v.name) {
          labelArray.push({
            color: v.color,
            name: v.name,
            id: v.id
          })
        }
      }
    }
    this.setData({
      groupInfo: groupInfo,
      title: groupInfo.title,
      introduce: groupInfo.introduction,
      authorId: groupInfo.ownerInfo.id,
      authorName: groupInfo.ownerInfo.name,
      authorAvatar: file.default.getImgUrl(groupInfo.ownerInfo.avatar),
      examineTime: time.timestap2Str(new Date(groupInfo.startTime), 'yyyy-MM-dd hh:mm'),
      expireTime: time.timestap2Str(new Date(groupInfo.endTime), 'yyyy-MM-dd hh:mm'),
      countDownTime: groupInfo.endTime - new Date().getTime(),
      personRate: groupInfo.condition.currentTeamSize / groupInfo.condition.minTeamSize * 100,
      personColor: this.getStatusColor(groupInfo.status),
      statusLabel: this.getStatusLabel(groupInfo.status),
      pictureUrlArray: pictureUrlArray,
      labelArray: labelArray,
    })

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
      this.setData({
        joinerInfos: joinerInfos
      })
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
      this.setData({
        involveList: involveList
      })
    })

    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      largeSize: systemInfo.screenWidth
    })
    // if (string.isNotEmpty(getApp().globalData.authToken)) {
    //   http.get(request.groupTeamSelelctGroupTeamUserStatus.url(this.data.platoonId)).then(res => {
    //     // todo
    //   })
    // }

    http.get('pss/contactinformation', null).then(res => {
      let contacts = []
      for (let contact of res) {
        contacts.push({
          id: contact.id,
          type: contact.type,
          value: contact.id,
          contactInformation: contact.contactInformation,
          text: this.getContactLalel(contact.type, contact.contactInformation)
        })
      }
      contacts.push({
        id: -1,
        value: -1,
        text: '新增联系方式'
      })
      this.setData({
        contacts: contacts
      })
      if (contacts.length > 0) {
        this.setData({
          currentContact: contacts[0]
        })
      }
    })

    http.post('pss/group/view/id/' + groupInfo.id, {})
  },

  onContactChange(event) {
    if (event.detail == -1) {
      wx.navigateTo({
        url: '/pages/me/contact/index',
      })
      this.setData({
        currentContact: this.data.contacts[0]
      })
      return
    }
    for (const contact of this.data.contacts) {
      if (contact.id == event.detail) {
        this.setData({
          currentContact: contact
        })
      }
    }
  },

  getContactLalel(type, value) {
    for (let v of enums.getEnumByAlias('联系方式类型').enumDescriptionVOS) {
      if (type == v.code) {
        return v.description + ': ' + value
      }
    }
    return type + ': ' + value
  },
  enlargeImg: function (event) {
    let pictureUrl = event.currentTarget.dataset.url
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
  exitTeam() {
    this.setData({
      showExitDialog: true
    })
  },
  onConfirmJoin() {
    http.post('pss/group/join', {
      contactInfo: this.data.currentContact.contactInformation,
      ossKey: '',
      remarks: this.data.joinDescription,
      resources: [],
      teamId: this.data.groupInfo.id,
      type: this.data.currentContact.type,
    }).then(res => {
      this.init({
        id: this.data.groupInfo.id
      })
      this.setData({
        showJoinDialog: false
      })
    })
  },
  onConfirmExit() {
    http.post('pss/group/quit', {
      remark: this.data.exitDescription,
      resourceList: [],
      id: this.data.groupInfo.id,
    }).then(res => {
      this.init({
        id: this.data.groupInfo.id
      })
      this.setData({
        showExitDialog: false
      })
    })
  },
  getStatusColor(status) {
    switch (status) {
      case 20:
        return '#1989fa'
      case 30:
        return '#07c160'
      case 40:
        return '#ff976a'
      default:
        return '#1989fa'
    }
  },
  getStatusLabel(status) {
    for (let v of enums.getEnumByAlias('组队单状态').enumDescriptionVOS) {
      if (status == v.code) {
        return v.description
      }
    }
  },

  onCloseJoinDialog() {
    this.setData({
      showJoinDialog: false
    })
  },

  onCloseExitDialog() {
    this.setData({
      showExitDialog: false
    })
  },

  collect() {
    http.post('/pss/group/collect/id/' + this.data.groupInfo.id).then(res => {
      this.setData({
        'showBtn.collect': false,
      })
      Toast({
        type: 'success',
        message: '收藏成功',
        forbidClick: true,
        duration: 1000,
      });
    })
  },
  cancelCollect() {
    http.put('/pss/group/cancelCollect/id/' + this.data.groupInfo.id).then(res => {
      this.setData({
        'showBtn.collect': true,
      })
      Toast({
        type: 'success',
        message: '取消收藏成功',
        forbidClick: true,
        duration: 1000,
      });
    })
  },

  async initData() {
    if (getApp().globalData.initDone) {
      return
    }
    const systemInfo = wx.getSystemInfoSync()
    getApp().globalData.systemInfo = systemInfo
    const query = wx.createSelectorQuery()
    query.select('#header').boundingClientRect()
    await query.exec(res => {
      getApp().globalData.windowHeightWithoutHeader = systemInfo.windowHeight - res[0].height
      this.setData({
        containerHeight: getApp().globalData.windowHeightWithoutHeader
      })
    })
    query.select('#footer').boundingClientRect()
    await query.exec(res => {
      getApp().globalData.windowHeightWithoutHeaderAndFooter = getApp().globalData.windowHeightWithoutHeader - res[0].height
    })

    http.get('pss/label/list', null, false).then(res => {
      let labelInfos = []
      let labelName2LabelInfoMap = {}
      for (let row of res) {
        labelInfos.push({
          id: row.id,
          name: row.labelName,
          color: color.randomColor(row.id)
        })
        labelName2LabelInfoMap[row.labelName] = labelInfos[labelInfos.length - 1]
      }
      getApp().globalData.labels = labelInfos
      getApp().globalData.labelName2LabelInfoMap = labelName2LabelInfoMap
    })
    http.get(request.getEnums.url, null, false).then((res) => {
      getApp().globalData.enums = res
      console.log(res)
    }).then(() => {
      auth.freeLogin(getApp())
    }).then(() => {
      getApp().globalData.initDone = true
      wx.reLaunch({
        url: `/pages/home/index`,
      })
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