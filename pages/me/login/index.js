const string = require('../../../utils/string')
const http = require('../../../utils/http')
const request = require('../../../utils/request')
const image = require('../../../utils/image')
const auth = require('../../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.themes.primary,
    agreeProtocol: false, // 同意注册/登录
    containerHeight: 0,
    loginButtonWidth: 0,
    loginSuccess: false,
    sourceRoute: null,
  },

  agreeProtocol() {
    this.setData({
      agreeProtocol: !this.data.agreeProtocol
    })
  },

  getPhoneNumber(event) {
    console.log(event)
    const phoneDetail = event.detail
    wx.login().then(res => {
      http.post(request.login.url, {
        cloudId: phoneDetail.cloudID,
        encryptedData: phoneDetail.encryptedData,
        iv: phoneDetail.iv,
        jsCode: res.code
      }).then(res => {
        getApp().globalData.authToken = res
        auth.getCurrentUser(getApp())
        this.setData({
          loginSuccess: true,
        })
      }).catch(res => {
        console.log(res)
      })
    })
  },

  goIndex: function () {
    const sourceRoute = this.data.sourceRoute
    if (!string.isEmpty(sourceRoute)) {
      wx.navigateTo({
        url: `/${sourceRoute}`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/index',
      })
    }
  },

  goPersonalEdit: function () {
    wx.navigateTo({
      url: '/pages/me/edit/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    const query = wx.createSelectorQuery()
    query.select('#header').boundingClientRect()
    query.exec(res => {
      const systemInfo = wx.getSystemInfoSync()
      let containerHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - res[0].height
      if (this.data.loginSuccess) {
        containerHeight = 0.9 * containerHeight
      }
      this.setData({
        containerHeight: containerHeight,
        loginButtonWidth: 0.6 * systemInfo.screenWidth
      })
    })


    // if (!string.isEmpty(options.sourceRoute)) {
    //   this.setData({sourceRoute: options.sourceRoute})
    // }
    // const app = getApp()
    // if (!string.isEmpty(app.globalData.authToken)) {
    //   const phone = app.globalData.userInfo.phone
    //   if (!string.isEmpty(phone)) {
    //     this.selectComponent('#header').back()
    //     return
    //   }
    // }

    // let that = this
    // http.get(request.getUserInfo.url).then(res => {
    //   if (res !== null && !string.isEmpty(res.phone)) {
    //     app.globalData.userInfo.id = res.id
    //     app.globalData.userInfo.phone = res.phone
    //     app.globalData.userInfo.wechatNum = res.wechatNum
    //     app.globalData.userInfo.nickname = string.isEmpty(res.name) ? '' : res.name
    //     app.globalData.userInfo.avatar = string.isEmpty(res.avatar) ? image.defaultAvatar : res.avatar
    //     app.globalData.userInfo.sex = res.sex === null ? 1 : res.sex
    //     app.globalData.userInfo.slogan = string.isEmpty(res.slogan) ? '' : res.slogan
    //     app.globalData.userInfo.birthday = string.isEmpty(res.birthday) ? '1970-01-01' : res.birthday

    //     this.selectComponent('#header').back()
    //     return
    //   } else {
    //     that.reload()
    //   }
    // })
  },

  reload: function () {
    // const query = wx.createSelectorQuery()
    // query.select('#header').boundingClientRect()
    // const that = this
    // query.exec(res => {
    //   const systemInfo = wx.getSystemInfoSync()
    //   let containerHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - res[0].height
    //   if (that.data.loginSuccess) {
    //     containerHeight = 0.9 * containerHeight
    //   }
    //   that.setData({containerHeight: containerHeight, loginButtonWidth: 0.6 * systemInfo.screenWidth})
    // })
  },
})