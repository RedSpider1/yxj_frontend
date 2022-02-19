// components/header-default/index.js
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '友小聚'
    },
    needReturn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: getApp().globalData.themes.primary,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back: function () {
      let pages = getCurrentPages()
      if (pages.length === 1) {
        wx.redirectTo({
          url: '/pages/home/index',
        })
        return
      }
      wx.navigateBack({delta: 1})
    },
    home() {
      wx.redirectTo({
        url: '/pages/home/index',
      })
    }
  }
})
