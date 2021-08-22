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
    countDownTips: '发送验证码',
    disabled: false,
    phone: '',
    sms: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber (event) {
      console.log(event)
    },
    login () {
      this.setData({needLogin: false})
    },
  },

  attached () {
    if (string.isEmpty(wx.getStorageSync('token'))) {
      this.setData({needLogin: true})
    }
  }
})
