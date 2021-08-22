let string = require('../../utils/string')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    needLogin: false, // 是否需要登录
    agreeProtocol: false, // 同意注册/登录
  },

  /**
   * 组件的方法列表
   */
  methods: {
    agreeProtocol () {
      this.setData({agreeProtocol: !this.data.agreeProtocol})
    },
    getPhoneNumber (event) {
      console.log(event)
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
        }
      })
      this.setData({needLogin: false})
    },
  },

  attached () {
    if (string.isEmpty(wx.getStorageSync('token'))) {
      this.setData({needLogin: true})
    }
  }
})
