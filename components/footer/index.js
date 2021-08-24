// components/footer/index.js
Component({
  options: {
    addGlobalClass: true
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: 'home'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: getApp().globalData.curThemeStyle,
    active: '',
    home: '首页',
    view: '相关',
    create: '',
    message: '消息',
    personal: '我的',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange (event) {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route
      switch (event.detail) {
        case 'view':
          if (route === 'pages/myself/index') {
            break
          }
          wx.navigateTo({
            url: '/pages/myself/index',
          })
          break
        case 'create':
          if (route === 'pages/create-platoon/index') {
            break
          }
          wx.navigateTo({
            url: '/pages/create-platoon/index',
          })
          break
        case 'message':
          if (route === 'pages/message/index') {
            break
          }
          wx.navigateTo({
            url: '/pages/message/index',
          })
          break
        case 'personal':
          if (route === 'pages/personal-center/index') {
            break
          }
          wx.navigateTo({
            url: '/pages/personal-center/index',
          })
          break
        case 'home':
        default:
          if (route === 'pages/index/index') {
            break
          }
          wx.navigateTo({
            url: '/pages/index/index',
          })
          break
      }
    },
    load () {
      // todo
    }
  },
  attached: function () {
    this.load()
  }
})
