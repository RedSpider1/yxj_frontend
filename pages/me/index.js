const auth = require('../../utils/auth')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    nickname: null,
    avatar: null,
  },
  methods: {
    edit() {
      wx.navigateTo({
        url: '/pages/me/edit/index',
      })
    },
    contact() {
      wx.navigateTo({
        url: '/pages/me/contact/index',
      })
    },
    feedback() {
      wx.navigateTo({
        url: '/pages/me/feedback/index',
      })
    },
    logout() {
      Dialog.confirm({
          title: '确定注销登录',
          message: '注销后某些功能将不可用，确定注销？',
        }).then(() => {
          auth.logout()
          wx.navigateTo({
            url: '/pages/home/index',
          })
        })
        .catch(() => {
        });
    },
    onLoad: function (options) {
      auth.checkLogin()
      setTimeout(() => {
        this.setData({
          nickname: getApp().globalData.userInfo.nickname,
          avatar: getApp().globalData.userInfo.avatar
        })
      }, 1000);
    },
  }
})