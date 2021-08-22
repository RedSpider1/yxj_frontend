// components/footer/index.js
Component({
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
    active: '',
    home: '',
    view: '',
    create: '',
    message: '',
    personal: '',
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
      this.setData({home: '', view: '', create: '', message: '', personal: '', active: this.properties.name})
      switch (this.properties.name) {
        case 'view':
          this.setData({view: '我的'})
          break
        case 'create':
          this.setData({create: '创建组队单'})
          break
        case 'message':
          this.setData({message: '消息'})
          break
        case 'personal':
          this.setData({personal: '个人中心'})
          break
        case 'home':
          this.setData({home: '首页'})
          break
      }
    }
  },
  attached: function () {
    this.load()
  }
})
