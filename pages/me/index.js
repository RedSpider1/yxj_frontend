const auth = require('../../utils/auth')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    text: "This is page data."
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
          getApp().globalData.token = null;
          wx.navigateTo({
            url: '/pages/me/login/index',
          })
        })
        .catch(() => {
        });
    },
    onLoad: function (options) {
      // auth.isLogin()
      // 页面创建时执行
    },
    onPullDownRefresh: function () {
      // 下拉刷新时执行
    },
    // 事件响应函数
    viewTap: function () {
      // ...
    }
  }
})