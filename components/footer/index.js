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
      this.setData({home: '', view: '', create: '', message: '', personal: ''})
      this.setData({active: event.detail})
      switch (event.detail) {
        case 'view':
          this.setData({view: '我的'})
          wx.navigateTo({
            url: '/pages/myself/index',
          })
          break
        case 'create':
          this.setData({create: '创建组队单'})
          wx.navigateTo({
            url: '/pages/create-platoon/index',
          })
          break
        case 'message':
          this.setData({message: '消息'})
          break
        case 'personal':
          this.setData({personal: '个人中心'})
          wx.navigateTo({
            url: '/pages/personal-center/index',
          })
          break
        case 'home':
        default:
          this.setData({home: '首页'})
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
